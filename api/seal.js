export const config = { runtime: 'edge' };

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'FANUS-';
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

async function redisSet(key, value, url, token) {
  const res = await fetch(`${url}/set/${key}`, {
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
  const data = await res.json();
  return data.result;
}

export default async function handler(req) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (req.method === 'POST') {
    const body = await req.json();
    const { seal } = body;
    if (!seal) return new Response(JSON.stringify({ error: 'no seal' }), { status: 400 });

    const code = generateCode();
    await redisSet(code, seal, url, token);

    return new Response(JSON.stringify({ code }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });
  }

  if (req.method === 'GET') {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    if (!code) return new Response(JSON.stringify({ error: 'no code' }), { status: 400 });

    const seal = await redisGet(code, url, token);
    if (!seal) return new Response(JSON.stringify({ error: 'not found' }), { status: 404 });

    return new Response(JSON.stringify({ seal }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response('Method not allowed', { status: 405 });
}
