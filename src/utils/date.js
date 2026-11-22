import { SLOT_MINUTES, WORK_START, WORK_END } from "../config.js";

const pad = (n) => String(n).padStart(2, "0");

// "2026-11-20" ko'rinishidagi kalit
export const toDateKey = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

// Ish vaqtidagi barcha boshlanish vaqtlari: ["09:00", "10:00", ...]
export const generateSlots = () => {
  const slots = [];
  for (let m = WORK_START * 60; m + SLOT_MINUTES <= WORK_END * 60; m += SLOT_MINUTES) {
    slots.push(`${pad(Math.floor(m / 60))}:${pad(m % 60)}`);
  }
  return slots;
};

// "09:00" -> "09:00 - 10:00"
export const slotRange = (start) => {
  const [h, m] = start.split(":").map(Number);
  const end = h * 60 + m + SLOT_MINUTES;
  return `${start} - ${pad(Math.floor(end / 60))}:${pad(end % 60)}`;
};

// Vaqt bugun uchun o'tib ketganmi
export const isSlotPast = (date, slot) => {
  const now = new Date();
  if (toDateKey(date) !== toDateKey(now)) return false;
  const [h, m] = slot.split(":").map(Number);
  return h * 60 + m <= now.getHours() * 60 + now.getMinutes();
};