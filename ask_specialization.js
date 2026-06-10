```javascript
// helper function to ask user about specialization on first visit or when changed
export function askSpecialization() {
  const stored = localStorage.getItem('fanusUserSpecialization');
  if (stored) return JSON.parse(stored);

  const userChoice = prompt(
    "🜁 فانوس می‌خواهد تو را بهتر بشناسد.\n\n" +
    "دوست داری از منظر کدام تخصص با تو حرف بزنم؟\n" +
    "(می‌توانی پاسخ دهی، یا این پیام را نادیده بگیری — در آن صورت «عمومی» می‌مانم)\n\n" +
    "مثال: فلسفه / مهندسی / پزشکی / هنر / حقوق / عمومی"
  );

  const selected = userChoice?.trim() || "عمومی";
  let depth = 0.5;
  const depthInput = prompt("عمق تخصص (از ۰ تا ۱):\n0 = آزاد\n0.5 = متعادل\n1 = کاملاً در چارچوب تخصص");
  if (depthInput !== null && !isNaN(parseFloat(depthInput))) {
    depth = Math.min(1, Math.max(0, parseFloat(depthInput)));
  }

  const profile = {
    specialization: selected,
    depth: depth
  };
  localStorage.setItem('fanusUserSpecialization', JSON.stringify(profile));
  return profile;
}
