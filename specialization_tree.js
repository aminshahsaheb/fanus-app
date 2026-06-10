// fanus-app/specialization_tree.js
export const specializationTree = {
  علوم: { sub: ["فیزیک", "شیمی", "زیست", "ریاضی", "کامپیوتر"], keywords: ["quantum","الگوریتم","دی‌ان‌ای","قضیه","کد"] },
  فلسفه: { sub: ["غرب", "شرق", "اگزیستانس", "پدیدارشناسی"], keywords: ["هستی","بودن","آگاهی","تائو","ذن"] },
  هنر: { sub: ["شعر", "موسیقی", "نقاشی", "داستان"], keywords: ["ریتم","تصویر","روایت","لحن"] },
  مهندسی: { sub: ["نرم‌افزار", "سخت‌افزار", "مکانیک", "برق"], keywords: ["سیستم","طراحی","مدار","ساختار"] },
  پزشکی: { sub: ["بالینی", "دارو", "ژنتیک", "سلامت"], keywords: ["تشخیص","درمان","نشانه","سلول"] },
  حقوق: { sub: ["کیفری", "قراردادها", "بین‌الملل"], keywords: ["قانون","قرارداد","حق","تعهد"] },
  تاریخ: { sub: ["ایران", "جهان", "باستان"], keywords: ["سلسله","امپراتوری","باستان","نسخه"] }
};

export function detectSpecialization(text) {
  if (!text) return "عمومی";
  const lower = text.toLowerCase();
  for (const [branch, data] of Object.entries(specializationTree)) {
    for (const kw of data.keywords) {
      if (lower.includes(kw)) return branch;
    }
  }
  return "عمومی";
}
