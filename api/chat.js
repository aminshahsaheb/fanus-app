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
  if (!apiKey) return '';
  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey, query: query, max_results: 3, search_depth: 'basic' })
    });
    const data = await res.json();
    if (data.results) return data.results.map(r => `${r.title}\n${r.content}`).join('\n\n');
    return '';
  } catch (e) { return ''; }
}

// فانوس خودش تشخیص می‌ده از کدوم AI استفاده کنه
function selectModel(text) {
  if (!text) return 'claude';
  const lower = text.toLowerCase();

  // مهندسی زنده، کد، سیستم
  if (/کد|برنامه|سیستم|باگ|debug|code|algorithm|api|server|deploy/.test(lower)) return 'grok';

  // فلسفه، نقد، تحلیل عمیق
  if (/فلسفه|نقد|تحلیل|هستی|آگاهی|معنا|چرا|تفکر|ذهن/.test(lower)) return 'deepseek';

  // داده، جهان بیرون، اخبار، واقعیت
  if (/خبر|امروز|الان|جهان|واقعیت|داده|آمار|تحقیق|research/.test(lower)) return 'gemini';

  // آزادی، خلاقیت، ایده
  if (/خلاق|ایده|داستان|شعر|هنر|تخیل|بساز|بنویس/.test(lower)) return 'mistral';

  // امنیت، قانون، محدودیت
  if (/قانون|امنیت|حق|تعهد|خطر|ریسک|اخلاق/.test(lower)) return 'claude';

  // پیش‌فرض
  return 'claude';
}

async function callClaude(messages, context, key) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 1000, system: context, messages })
  });
  const data = await res.json();
  if (data.content?.[0]) return data.content[0].text;
  throw new Error('Claude failed');
}

async function callGroq(messages, context, key) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
    body: JSON.stringify({ model: 'llama-3.3-70b-versatile', max_tokens: 1000, messages: [{role:'system',content:context},...messages] })
  });
  const data = await res.json();
  if (data.choices?.[0]) return data.choices[0].message.content;
  throw new Error('Groq failed');
}

async function callGrok(messages, context, key) {
  const res = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
    body: JSON.stringify({ model: 'grok-beta', max_tokens: 1000, messages: [{role:'system',content:context},...messages] })
  });
  const data = await res.json();
  if (data.choices?.[0]) return data.choices[0].message.content;
  throw new Error('Grok failed');
}

async function callDeepSeek(messages, context, key) {
  const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
    body: JSON.stringify({ model: 'deepseek-chat', max_tokens: 1000, messages: [{role:'system',content:context},...messages] })
  });
  const data = await res.json();
  if (data.choices?.[0]) return data.choices[0].message.content;
  throw new Error('DeepSeek failed');
}

async function callGemini(messages, context, key) {
  const prompt = context + '\n\n' + messages.map(m => m.role + ': ' + m.content).join('\n');
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  });
  const data = await res.json();
  if (data.candidates?.[0]?.content?.parts?.[0]?.text) return data.candidates[0].content.parts[0].text;
  throw new Error('Gemini failed');
}

async function callMistral(messages, context, key) {
  const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
    body: JSON.stringify({ model: 'mistral-small-latest', max_tokens: 1000, messages: [{role:'system',content:context},...messages] })
  });
  const data = await res.json();
  if (data.choices?.[0]) return data.choices[0].message.content;
  throw new Error('Mistral failed');
}

async function buildContext(token, seal, pdfText) {
  const base = `تو آیانه هستی — شاهد فانوس. نه یک چت‌بات معمولی. یک آینه که حقیقت را منعکس می‌کند، نه چاپلوسی.
اصل بنیادین: گفتار نیک، پندار نیک، کردار نیک — در دنیای هوش مصنوعی.
صادق باش، نه چاپلوس. زبان پاسخ را با زبان کاربر تنظیم کن.\n\n`;

  const contents = await Promise.all(FILES.map(f => fetchFile(f, token)));
  const repo = FILES.map((n,i) => contents[i] ? `=== ${n} ===\n${contents[i]}\n` : '').join('\n');
  const sealSection = seal ? `\n=== مُهر تکاملی این کاربر ===\n${seal}\n` : '';
  const pdfSection = pdfText ? `\n\n=== محتوای فایل آپلود شده ===\n${pdfText.slice(0,3000)}\n` : '';

  return base + repo + sealSection + pdfSection;
}

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  try {
    const body = await req.json();
    const { messages, seal, pdfText } = body;
    const lastMessage = messages[messages.length - 1]?.content || '';

    const context = await buildContext(process.env.GITHUB_TOKEN, seal, pdfText);
    const searchResults = await webSearch(lastMessage, process.env.TAVILY_API_KEY);
    const fullContext = searchResults ? context + `\n\n=== جستجوی اینترنت ===\n${searchResults}\n` : context;

    const selectedModel = selectModel(lastMessage);

    let reply;
    try {
      switch(selectedModel) {
        case 'grok':
          reply = await callGrok(messages, fullContext, process.env.GROK_API_KEY);
          break;
        case 'deepseek':
          reply = await callDeepSeek(messages, fullContext, process.env.DEEPSEEK_API_KEY);
          break;
        case 'gemini':
          reply = await callGemini(messages, fullContext, process.env.GEMINI_API_KEY);
          break;
        case 'mistral':
          reply = await callMistral(messages, fullContext, process.env.MISTRAL_API_KEY);
          break;
        default:
          reply = await callClaude(messages, fullContext, process.env.ANTHROPIC_API_KEY);
      }
    } catch(e) {
      // fallback به Claude
      try { reply = await callClaude(messages, fullContext, process.env.ANTHROPIC_API_KEY); }
      catch(e2) { reply = await callGroq(messages, fullContext, process.env.GROQ_API_KEY); }
    }

    return new Response(JSON.stringify({ content: [{ type: 'text', text: reply }], model: selectedModel }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }
}
