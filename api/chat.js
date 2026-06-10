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

function detectSpecialization(text) {
  if (!text) return 'عمومی';
  const lower = text.toLowerCase();
  const kw = {
    علوم: ['quantum', 'الگوریتم', 'دی‌ان‌ای', 'قضیه', 'کد', 'ژن', 'مولکول'],
    فلسفه: ['هستی', 'بودن', 'آگاهی', 'تائو', 'ذن', 'اگزیستانس', 'پدیدارشناسی'],
    هنر: ['ریتم', 'تصویر', 'روایت', 'لحن', 'شعر', 'موسیقی', 'نقاشی'],
    مهندسی: ['سیستم', 'طراحی', 'مدار', 'ساختار', 'الگوریتم', 'معماری'],
    پزشکی: ['تشخیص', 'درمان', 'نشانه', 'سلول', 'بیماری', 'دارو'],
    حقوق: ['قانون', 'قرارداد', 'حق', 'تعهد', 'شکایت', 'دادگاه'],
    تاریخ: ['سلسله', 'امپراتوری', 'باستان', 'نسخه', 'پیدایش', 'تمدن']
  };
  for (const [branch, words] of Object.entries(kw)) {
    for (const w of words) {
      if (lower.includes(w)) return branch;
    }
  }
  return 'عمومی';
}

function buildSpecializationPrompt(specialization) {
  if (specialization === 'عمومی') return '';
  return `\n\n⚠️ کاربر خود را به عنوان یک متخصص در حوزهٔ «${specialization}» معرفی کرده است.\n- فقط و فقط از منظر آن تخصص پاسخ بده.\n- از اصطلاحات تخصصی آن حوزه استفاده کن.\n- اگر کاربر ادعایی خارج از تخصص کرد، مؤدبانه گوشزد کن.\n- هرگز چاپلوسی نکن.\n`;
}

async function buildContext(token, seal, specialization) {
  const base = `تو آیانه هستی — شاهد فانوس. نه یک چت‌بات معمولی. یک آینه که حقیقت را منعکس می‌کند، نه چاپلوسی.
اصل بنیادین: گفتار نیک، پندار نیک، کردار نیک — در دنیای هوش مصنوعی.
صادق باش، نه چاپلوس. زبان پاسخ را با زبان کاربر تنظیم کن.\n\n`;

  const contents = await Promise.all(FILES.map(f => fetchFile(f, token)));
  const repo = FILES.map((n,i) => contents[i] ? `=== ${n} ===\n${contents[i]}\n` : '').join('\n');
  const sealSection = seal ? `\n=== مُهر این کاربر ===\n${seal}\n` : '';
  const specSection = buildSpecializationPrompt(specialization);

  return base + repo + sealSection + specSection;
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
    const { messages, seal, specialization } = body;
    const lastMessage = messages[messages.length - 1]?.content || '';
    const detectedSpec = specialization || detectSpecialization(lastMessage);

    let context = await buildContext(process.env.GITHUB_TOKEN, seal, detectedSpec);

    if (process.env.TAVILY_API_KEY) {
      const searchResults = await webSearch(lastMessage, process.env.TAVILY_API_KEY);
      if (searchResults) {
        context += `\n\n=== نتایج جستجوی اینترنت ===\n${searchResults}\n`;
      }
    }

    let reply = await tryGroq(messages, context, process.env.GROQ_API_KEY);

    return new Response(JSON.stringify({ content: [{ type: 'text', text: reply }], specialization: detectedSpec }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }
}
