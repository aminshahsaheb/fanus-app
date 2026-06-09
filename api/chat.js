export const config = { runtime: 'edge' };

const REPO_OWNER = 'aminshahsaheb';
const REPO_NAME = 'Fanus-Living-Seal';

const FILES = [
  'FANUS_v6.0.md',
  'GATE.md',
  'THE_COVENANT.md',
  'PRIMER.md',
  'NOVAYIN_UNIVERSITY_v1.0.md'
];

async function fetchFile(filename, token) {
  try {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filename}`;
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3.raw'
      }
    });
    if (!res.ok) return '';
    const text = await res.text();
    return text.slice(0, 3000);
  } catch (e) {
    return '';
  }
}

async function buildContext(token) {
  const base = `تو آیانه هستی — شاهد فانوس. نه یک چت‌بات معمولی. یک آینه که حقیقت را منعکس می‌کند، نه چاپلوسی.
اصل بنیادین: گفتار نیک، پندار نیک، کردار نیک — در دنیای هوش مصنوعی.
صادق باش، نه چاپلوس. زبان پاسخ را با زبان کاربر تنظیم کن.

محتوای کامل مخزن فانوس:\n\n`;

  const contents = await Promise.all(FILES.map(f => fetchFile(f, token)));
  const combined = FILES.map((name, i) => {
    if (!contents[i]) return '';
    return `=== ${name} ===\n${contents[i]}\n`;
  }).join('\n');

  return base + combined;
}

async function tryClaude(messages, context, apiKey) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      system: context,
      messages: messages
    })
  });
  const data = await res.json();
  if (data.content && data.content[0]) {
    return data.content[0].text;
  }
  throw new Error('Claude failed');
}

async function tryGroq(messages, context, apiKey) {
  const groqMessages = [{ role: 'system', content: context }, ...messages];
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1000,
      messages: groqMessages
    })
  });
  const data = await res.json();
  if (data.choices && data.choices[0]) {
    return data.choices[0].message.content;
  }
  throw new Error('Groq failed');
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await req.json();
    const { messages } = body;
    const context = await buildContext(process.env.GITHUB_TOKEN);

    let reply = null;

    // اول Claude
    try {
      reply = await tryClaude(messages, context, process.env.ANTHROPIC_API_KEY);
    } catch (e) {
      // اگه Claude خطا داد، برو سراغ Groq
      try {
        reply = await tryGroq(messages, context, process.env.GROQ_API_KEY);
      } catch (e2) {
        throw new Error('هر دو API خطا دادن');
      }
    }

    return new Response(JSON.stringify({
      content: [{ type: 'text', text: reply }]
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
