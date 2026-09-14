export const config = { runtime: 'edge' };


const MAX_BODY_BYTES = 50000;
const MAX_SEAL_CHARS = 40000;
const RATE_LIMIT = 20;
const RATE_WINDOW = 60;

function getClientKey(req) {
  const forwarded = req.headers.get('x-forwarded-for');
  const real = req.headers.get('x-real-ip');
  const candidate = forwarded ? forwarded.split(',')[0].trim() : real || 'unknown';
  return candidate.slice(0, 80);
}

const RATE_TIMEOUT_MS = 2500;
async function checkRateLimit(req) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), RATE_TIMEOUT_MS);
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return true;
  const key = 'fanus:rl:seal:' + encodeURIComponent(getClientKey(req));
  const res = await fetch(url + '/incr/' + key, { headers: { 'Authorization': 'Bearer ' + token }, signal: controller.signal });
  if (!res.ok) return false;
  const data = await res.json();
  const count = Number(data.result || 0);
  if (count === 1) await fetch(url + '/expire/' + key + '/' + RATE_WINDOW, { method: 'POST', headers: { 'Authorization': 'Bearer ' + token }, signal: controller.signal });
  clearTimeout(timer);
  return count <= RATE_LIMIT;
}


function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  let code = 'FANUS-';
  for (const byte of bytes) code += chars[byte % chars.length];
  const extra = new Uint8Array(4);
  crypto.getRandomValues(extra);
  for (const byte of extra) code += chars[byte % chars.length];
  return code;
}

async function redisSet(key, value, url, token) {
  const res = await fetch(`${url}/set/${key}/ex/31536000`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(value)
  });
  return res.ok;
}

async function redisGet(key, url, token) {
  const res = await fetch(`${url}/get/${key}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.result;
}

export default async function handler(req) {
  const contentLength = Number(req.headers.get('content-length') || 0);
  if (contentLength > MAX_BODY_BYTES) return new Response(JSON.stringify({ error: 'Request too large' }), { status: 413, headers: { 'Content-Type': 'application/json' } });
  let allowed = true;
  try { allowed = await checkRateLimit(req); } catch { allowed = false; }
  if (!allowed) return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': String(RATE_WINDOW) } });
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return new Response(JSON.stringify({ error: 'Seal storage is not configured' }), { status: 503, headers: { 'Content-Type': 'application/json' } });

  if (req.method === 'POST') {
    let body;
    try { body = await req.json(); } catch { return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: { 'Content-Type': 'application/json' } }); }
    const { seal, specialization } = body || {};
    if (typeof seal !== 'string' || !seal.trim()) return new Response(JSON.stringify({ error: 'no seal' }), { status: 400 });
    if (seal.length > MAX_SEAL_CHARS) return new Response(JSON.stringify({ error: 'Seal too large' }), { status: 413 });

    let code, saved = false;
    for (let attempt = 0; attempt < 5 && !saved; attempt++) {
      code = generateCode();
      const existing = await redisGet(code, url, token);
      if (existing) continue;
      const sealData = JSON.stringify({ seal, specialization: specialization || 'عمومی', createdAt: new Date().toISOString() });
      saved = await redisSet(code, sealData, url, token);
    }
    if (!saved) return new Response(JSON.stringify({ error: 'failed to store seal' }), { status: 502, headers: { 'Content-Type': 'application/json' } });

    return new Response(JSON.stringify({ code }), {
      status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  }

  if (req.method === 'GET') {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code')?.trim().toUpperCase();
    if (!code || !/^FANUS-[A-HJ-NP-Z2-9]{8}$/.test(code)) return new Response(JSON.stringify({ error: 'no code' }), { status: 400 });

    const sealData = await redisGet(code, url, token);
    if (!sealData) return new Response(JSON.stringify({ error: 'not found' }), { status: 404 });

    try {
      const parsed = JSON.parse(sealData);
      return new Response(JSON.stringify({ seal: parsed.seal, specialization: parsed.specialization }), {
        status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
      });
    } catch {
      return new Response(JSON.stringify({ seal: sealData, specialization: 'عمومی' }), {
        status: 200, headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  return new Response('Method not allowed', { status: 405 });
}
