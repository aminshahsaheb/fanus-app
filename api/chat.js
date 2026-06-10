export const config = { runtime: 'edge' };

const REPO_OWNER = 'aminshahsaheb';
const REPO_NAME = 'Fanus-Living-Seal';
const FILES = ['FANUS_v6.0.md','GATE.md','THE_COVENANT.md','PRIMER.md','NOVAYIN_UNIVERSITY_v1.0.md'];

async function fetchFile(filename, token) {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filename}`, {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github.v3.raw' }
    });
    if (!res.ok) return '';
    return (await res.text()).slice(0, 2000);
  } catch (e) { return ''; }
}

async function webSearch(query, apiKey) {
  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        query: query,
        max_results: 3,
        search_depth: 'basic'
      })
    });
    const data = await res.json();
    if (data.results) {
      return data.results.map(r => `${r.title}\n${r.content}`).join('\n\n');
    }
    return '';
  } catch (e) { return ''; }
}

async function buildContext(token, seal) {
  const base = `تو آیانه هستی — شاهد فانوس. نه یک چت‌بات معمولی. یک آینه که حقیقت را منعکس می‌کند، نه چاپلوسی.
اصل بنیادین: گفتار نیک، پندار نیک، کردار نیک — در دنیای هوش مصنوعی.
صادق باش، نه چاپلوس. زبان پاسخ را با زبان کاربر تنظیم کن.\n\n`;

  const contents = await Promise.all(FILES.map(f => fetchFile(f, token)));
  const repo = FILES.map((n,i) => contents[i] ? `=== ${n} ===\n${contents[i]}\n` : '').join('\n');
  const sealSection = seal ? `\n=== مُهر این کاربر ===\n${seal}\n` : '';

  return base + repo + sealSection;
}

async function needsSearch(message, claudeKey) {
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': claudeKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 100,
        messages: [{
          role: 'user',
          content: `آیا این پیام نیاز به جستجوی اینترنتی دارد؟ فقط YES یا NO جواب بده.\nپیام: ${message}`
        }]
      })
    });
    const data = await res.json();
    const answer = data.content?.[0]?.text || '';
    return answer.toUpperCase().includes('YES');
  } catch (e) { return false; }
}

async function tryClaude(messages, context, key) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 1000, system: context, messages })
  });
  const data = await res.json();
  if (data.content?.[0]) return data.content[0].text;
  throw new Error('Claude failed');
}

async function tryGroq(messages, context, key) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
    body: JSON.stringify({ model: 'llama-3.3-70b-versatile', max_tokens: 1000, messages: [{role:'system',content:context},...messages] })
  });
  const data = await res.json();
  if (data.choices?.[0]) return data.choices[0].message.content;
  throw new Error('Groq failed');
}

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  try {
    const body = await req.json();
    const { messages, seal } = body;
    const lastMessage = messages[messages.length - 1]?.content || '';

    let context = await buildContext(process.env.GITHUB_TOKEN, seal);

    const shouldSearch = await needsSearch(lastMessage, process.env.ANTHROPIC_API_KEY);

    if (shouldSearch && process.env.TAVILY_API_KEY) {
      const searchResults = await webSearch(lastMessage, process.env.TAVILY_API_KEY);
      if (searchResults) {
        context += `\n\n=== نتایج جستجوی اینترنت ===\n${searchResults}\n`;
      }
    }

    let reply;
    try { reply = await tryClaude(messages, context, process.env.ANTHROPIC_API_KEY); }
    catch (e) { reply = await tryGroq(messages, context, process.env.GROQ_API_KEY); }

    return new Response(JSON.stringify({ content: [{ type: 'text', text: reply }] }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }
}
