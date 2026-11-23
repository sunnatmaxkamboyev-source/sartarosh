const KEY = "barber_my_bookings";

export const getMyTokens = () => {
  try {
    const list = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
};

export const addMyToken = (token) => {
  if (!token) return;
  try {
    const list = [token, ...getMyTokens().filter((t) => t !== token)].slice(0, 10);
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // xotira to'la yoki yopiq bo'lsa, jim o'tamiz
  }
};