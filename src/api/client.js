import { clearAdmin, loadAdmin } from "../utils/auth.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const request = async (
  path,
  { method = "GET", body, auth = true } = {}
) => {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";

  // Admin kirgan bo'lsa, token avtomatik qo'shiladi
  const admin = auth ? loadAdmin() : null;
  if (admin?.token) headers.Authorization = `Bearer ${admin.token}`;

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Serverga ulanib bo'lmadi. Keyinroq urinib ko'ring.");
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    // javob bo'sh bo'lishi mumkin
  }

  if (!res.ok) {
    // Admin sessiyasi tugagan bo'lsa, kirish sahifasiga qaytaramiz
    if (res.status === 401 && admin) {
      clearAdmin();
      window.location.href = "/admin/login";
    }
    throw new Error(data?.message || "Xatolik yuz berdi");
  }

  return data;
};