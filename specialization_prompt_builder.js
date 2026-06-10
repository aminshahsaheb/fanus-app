// builds the system prompt fragment based on user's specialization
export function buildSpecializationPrompt(specialization, depth) {
  if (specialization === "عمومی" || depth === 0) return "";

  let prompt = `\n\n⚠️ کاربر خود را به عنوان یک متخصص در حوزهٔ «${specialization}» معرفی کرده است.\n`;
  prompt += `عمق پایبندی به این تخصص: ${depth * 100}%.\n\n`;
  prompt += `- اگر عمق بالا (نزدیک به ۱) است: فقط و فقط از منظر آن تخصص پاسخ بده. از دانش عمومی یا حوزه‌های دیگر استفاده نکن.\n`;
  prompt += `- اگر عمق پایین (نزدیک به ۰.۵) است: از آن تخصص استفاده کن، اما می‌توانی از دانش عمومی هم بیاوری.\n`;
  prompt += `- اگر اختلاف نظر علمی وجود دارد، مؤدبانه توضیح بده و به کاربر احترام بگذار.\n`;
  prompt += `- هرگز چاپلوسی نکن. اگر کاربر ادعایی خارج از تخصص خود کرد، آرام گوشزد کن.\n`;

  return prompt;
}
