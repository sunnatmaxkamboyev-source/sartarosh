import { createContext, useContext, useState } from "react";
import { adminLogin } from "../api/api.js";
import { clearAdmin, loadAdmin, saveAdmin } from "../utils/auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Sahifa ochilganda brauzerda saqlangan admin bo'lsa, shuni olamiz
  const [admin, setAdmin] = useState(loadAdmin);

  const login = async (phone, password) => {
    const result = await adminLogin(phone, password);
    saveAdmin(result);
    setAdmin(result);
  };

  const logout = () => {
    clearAdmin();
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);