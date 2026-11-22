export const BARBER = {
  name: "Sartarosh Ismi",
  title: "Barber",
  photo: "", // bo'sh bo'lsa bosh harf chiqadi
};

// Ish vaqti: 09:00 dan 22:00 gacha, har bir bron 1 soat
export const WORK_START = 9;
export const WORK_END = 22;
export const SLOT_MINUTES = 60;

export const MONTHS = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr",
];

// Hafta dushanbadan boshlanadi
export const WEEKDAYS_SHORT = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];

// Date.getDay() tartibida (0 = yakshanba)
export const WEEKDAYS_FULL = [
  "Yakshanba", "Dushanba", "Seshanba", "Chorshanba",
  "Payshanba", "Juma", "Shanba",
];