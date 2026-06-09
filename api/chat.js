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

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await req.json();
    const { messages } = body;

    const context = await buildContext(process.env.GITHUB_TOKEN);

    const groqMessages = [
      { role: 'system', content: context },
      ...messages
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        max_tokens: 1000,
        messages: groqMessages
      })
    });

    const data = await response.json();

    if (data.choices && data.choices[0]) {
      return new Response(JSON.stringify({
        content: [{ type: 'text', text: data.choices[0].message.content }]
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ error: 'Groq error', detail: data }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
