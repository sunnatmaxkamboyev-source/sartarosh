// Kiritilgan matndan faqat 9 ta raqamni ajratib oladi (998 dan keyingi qism)
export const parsePhone = (raw) => {
  let digits = raw.replace(/\D/g, "");
  // "+998..." yoki to'liq raqam joylansa, 998 ni olib tashlaymiz
  if (raw.trim().startsWith("+") || digits.length > 9) {
    if (digits.startsWith("998")) digits = digits.slice(3);
  }
  return digits.slice(0, 9);
};

// 9 ta raqamni "+998 90 123 45 67" ko'rinishiga keltiradi
export const formatPhone = (digits) => {
  if (!digits) return "";
  const parts = [
    digits.slice(0, 2),
    digits.slice(2, 5),
    digits.slice(5, 7),
    digits.slice(7, 9),
  ].filter(Boolean);
  return "+998 " + parts.join(" ");
};