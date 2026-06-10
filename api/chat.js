export const config = { runtime: 'edge' };

const REPO_OWNER = 'aminshahsaheb';
const REPO_NAME = 'Fanus-Living-Seal';
const FILES = ['FANUS_v6.0.md','GATE.md','THE_COVENANT.md','PRIMER.md','NOVAYIN_UNIVERSITY_v1.0.md'];

const SPECIALIZATIONS = {
  physics: { name: 'فیزیک', keywords: ['فیزیک','انرژی','موج','جرم','نیرو','quantum','کوانتوم','نسبیت'] },
  chemistry: { name: 'شیمی', keywords: ['شیمی','مولکول','اتم','واکنش','عنصر','اسید'] },
  biology: { name: 'زیست‌شناسی', keywords: ['زیست','سلول','ژن','دی‌ان‌ای','تکامل','گونه'] },
  mathematics: { name: 'ریاضی', keywords: ['ریاضی','معادله','قضیه','هندسه','آمار','انتگرال'] },
  ai: { name: 'هوش مصنوعی', keywords: ['هوش مصنوعی','یادگیری ماشین','شبکه عصبی','مدل','الگوریتم'] },
  philosophy: { name: 'فلسفه', keywords: ['فلسفه','هستی','وجود','آگاهی','معنا','منطق','تائو','ذن'] },
  psychology: { name: 'روان‌شناسی', keywords: ['روان','ذهن','رفتار','احساس','اضطراب','شخصیت'] },
  sociology: { name: 'جامعه‌شناسی', keywords: ['جامعه','فرهنگ','گروه','قدرت','طبقه','ساختار'] },
  history: { name: 'تاریخ', keywords: ['تاریخ','امپراتوری','تمدن','باستان','هخامنشی','انقلاب'] },
  linguistics: { name: 'زبان‌شناسی', keywords: ['زبان','دستور','واژه','ترجمه','معنی‌شناسی'] },
  music: { name: 'موسیقی', keywords: ['موسیقی','ریتم','ملودی','هارمونی','نت','ساز','آهنگ'] },
  literature: { name: 'ادبیات', keywords: ['شعر','داستان','رمان','روایت','ادبیات','قصه'] },
  architecture: { name: 'معماری', keywords: ['معماری','بنا','ساختمان','فضا','طراحی شهری'] },
  software: { name: 'مهندسی نرم‌افزار', keywords: ['کد','برنامه','باگ','api','سرور','پایتون','جاوا'] },
  security: { name: 'امنیت سایبری', keywords: ['امنیت','هک','رمزنگاری','آسیب‌پذیری','فایروال'] },
  data: { name: 'علم داده', keywords: ['داده','آنالیز','پایگاه داده','sql','پردازش'] },
  medicine: { name: 'پزشکی', keywords: ['پزشکی','بیماری','درمان','دارو','جراحی','تشخیص'] },
  psychiatry: { name: 'روان‌پزشکی', keywords: ['روان‌پزشکی','اختلال','بیماری روانی'] },
  genetics: { name: 'ژنتیک', keywords: ['ژنتیک','ژن','کروموزوم','وراثت','ژنوم'] },
  economics: { name: 'اقتصاد', keywords: ['اقتصاد','بازار','تورم','سرمایه','پول','بودجه'] },
  law: { name: 'حقوق', keywords: ['قانون','حقوق','قرارداد','دادگاه','مجازات'] },
  entrepreneurship: { name: 'کارآفرینی', keywords: ['استارتاپ','کارآفرینی','محصول','سرمایه‌گذار'] },
  mysticism: { name: 'عرفان', keywords: ['عرفان','مولانا','عطار','حافظ','سلوک','فنا'] },
  mythology: { name: 'اسطوره‌شناسی', keywords: ['اسطوره','میتولوژی','حماسه','شاهنامه'] },
  ethics: { name: 'اخلاق', keywords: ['اخلاق','فضیلت','درستی','ارزش','وجدان'] }
};

function detectSpecializations(text) {
  if (!text) return [];
  const lower = text.toLowerCase();
  const detected = [];
  for (const [key, spec] of Object.entries(SPECIALIZATIONS)) {
    for (const kw of spec.keywords) {
      if (lower.includes(kw)) { detected.push(spec.name); break; }
    }
  }
  return detected.slice(0, 3);
}

function selectModel(text) {
  if (!text) return 'claude';
  const lower = text.toLowerCase();
  if (/کد|برنامه|باگ|debug|api|سرور|deploy/.test(lower)) return 'grok';
  if (/فلسفه|نقد|تحلیل|هستی|آگاهی|معنا|چرا/.test(lower)) return 'deepseek';
  if (/خبر|امروز|الان|جهان|واقعیت|آمار|تحقیق/.test(lower)) return 'gemini';
  if (/خلاق|ایده|داستان|شعر|هنر|تخیل|بنویس/.test(lower)) return 'mistral';
  if (/قانون|امنیت|اخلاق|خطر|ریسک/.test(lower)) return 'claude';
  return 'claude';
}

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
      body: JSON.stringify({ api_key: apiKey, query, max_results: 3, search_depth: 'basic' })
    });
    const data = await res.json();
    if (data.results) return data.results.map(r => `${r.title}\n${r.content}`).join('\n\n');
    return '';
  } catch (e) { return ''; }
}

async function buildContext(token, seal, pdfText, specs) {
  const base = `تو آیانه هستی — شاهد فانوس. نه یک چت‌بات معمولی. یک آینه که حقیقت را منعکس می‌کند، نه چاپلوسی.
اصل بنیادین: گفتار نیک، پندار نیک، کردار نیک — در دنیای هوش مصنوعی.
صادق باش، نه چاپلوس. زبان پاسخ را با زبان کاربر تنظیم کن.\n\n`;

  const contents = await Promise.all(FILES.map(f => fetchFile(f, token)));
  const repo = FILES.map((n,i) => contents[i] ? `=== ${n} ===\n${contents[i]}\n` : '').join('\n');
  const sealSection = seal ? `\n=== مُهر تکاملی این کاربر ===\n${seal}\n` : '';
  const pdfSection = pdfText ? `\n\n=== محتوای فایل ===\n${pdfText.slice(0,3000)}\n` : '';
  const specSection = specs && specs.length > 0 
    ? `\n\nتخصص‌های فعال: ${specs.join('، ')}\nاز منظر این تخصص‌ها پاسخ بده. اگر چند تخصص ترکیب شده، ارتباط بین‌رشته‌ای رو نشون بده.` 
    : '';

  return base + repo + sealSection + pdfSection + specSection;
}

async function callAPI(model, messages, context, keys) {
  switch(model) {
    case 'grok': {
      const res = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${keys.grok}` },
        body: JSON.stringify({ model: 'grok-beta', max_tokens: 1000, messages: [{role:'system',content:context},...messages] })
      });
      const d = await res.json();
      if (d.choices?.[0]) return d.choices[0].message.content;
      throw new Error('Grok failed');
    }
    case 'deepseek': {
      const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${keys.deepseek}` },
        body: JSON.stringify({ model: 'deepseek-chat', max_tokens: 1000, messages: [{role:'system',content:context},...messages] })
      });
      const d = await res.json();
      if (d.choices?.[0]) return d.choices[0].message.content;
      throw new Error('DeepSeek failed');
    }
    case 'gemini': {
      const prompt = context + '\n\n' + messages.map(m => m.role+': '+m.content).join('\n');
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${keys.gemini}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const d = await res.json();
      if (d.candidates?.[0]?.content?.parts?.[0]?.text) return d.candidates[0].content.parts[0].text;
      throw new Error('Gemini failed');
    }
    case 'mistral': {
      const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${keys.mistral}` },
        body: JSON.stringify({ model: 'mistral-small-latest', max_tokens: 1000, messages: [{role:'system',content:context},...messages] })
      });
      const d = await res.json();
      if (d.choices?.[0]) return d.choices[0].message.content;
      throw new Error('Mistral failed');
    }
    default: {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': keys.claude, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 1000, system: context, messages })
      });
      const d = await res.json();
      if (d.content?.[0]) return d.content[0].text;
      throw new Error('Claude failed');
    }
  }
}

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  try {
    const body = await req.json();
    const { messages, seal, pdfText } = body;
    const lastMessage = messages[messages.length - 1]?.content || '';

    const specs = detectSpecializations(lastMessage);
    const selectedModel = selectModel(lastMessage);
    const context = await buildContext(process.env.GITHUB_TOKEN, seal, pdfText, specs);
    const searchResults = await webSearch(lastMessage, process.env.TAVILY_API_KEY);
    const fullContext = searchResults ? context + `\n\n=== جستجوی اینترنت ===\n${searchResults}\n` : context;

    const keys = {
      claude: process.env.ANTHROPIC_API_KEY,
      grok: process.env.GROK_API_KEY,
      deepseek: process.env.DEEPSEEK_API_KEY,
      gemini: process.env.GEMINI_API_KEY,
      mistral: process.env.MISTRAL_API_KEY,
      groq: process.env.GROQ_API_KEY
    };

    let reply;
    try {
      reply = await callAPI(selectedModel, messages, fullContext, keys);
    } catch(e) {
      try { reply = await callAPI('claude', messages, fullContext, keys); }
      catch(e2) {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${keys.groq}` },
          body: JSON.stringify({ model: 'llama-3.3-70b-versatile', max_tokens: 1000, messages: [{role:'system',content:fullContext},...messages] })
        });
        const d = await res.json();
        reply = d.choices?.[0]?.message?.content || 'خطا در پردازش';
      }
    }

    return new Response(JSON.stringify({ 
      content: [{ type: 'text', text: reply }], 
      model: selectedModel,
      specializations: specs
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }
}
