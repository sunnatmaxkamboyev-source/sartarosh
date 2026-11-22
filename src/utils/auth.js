const KEY = "barber_admin";

export const loadAdmin = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY));
  } catch {
    return null;
  }
};

export const saveAdmin = (admin) => {
  localStorage.setItem(KEY, JSON.stringify(admin));
};

export const clearAdmin = () => {
  localStorage.removeItem(KEY);
};