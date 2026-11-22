import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { formatPhone, parsePhone } from "../utils/phone.js";

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z" />
  </svg>
);
const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 9h-1V7a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2zm-7-2a2 2 0 0 1 4 0v2h-4z" />
  </svg>
);

export default function AdminLoginPage() {
  const { admin, login } = useAuth();
  const [digits, setDigits] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Allaqachon kirgan bo'lsa, qayta so'ramaymiz
  if (admin) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (digits.length !== 9) return setError("Telefon raqamni to'liq kiriting");
    if (!password) return setError("Parolni kiriting");

    setError("");
    setLoading(true);
    try {
      await login("+998" + digits, password);
      // Muvaffaqiyatli bo'lsa, yuqoridagi Navigate o'zi admin panelga olib boradi
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="shell">
      <div className="card login-card">
        <div className="login-box">
          <div className="logo" style={{ marginBottom: 28 }}>
            <span className="logo-mark">B</span>
            <span className="logo-text">BARBER</span>
          </div>
          <h1 className="login-title">Admin panelga kirish</h1>

          <form className="form" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label className="field-label">Telefon raqam</label>
              <div className="field-box">
                <span className="field-icon">
                  <PhoneIcon />
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="+998 90 123 45 67"
                  value={formatPhone(digits)}
                  onChange={(e) => setDigits(parsePhone(e.target.value))}
                />
              </div>
            </div>

            <div className="field">
              <label className="field-label">Parol</label>
              <div className="field-box">
                <span className="field-icon">
                  <LockIcon />
                </span>
                <input
                  type="password"
                  placeholder="Parolni kiriting"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && <div className="error-text" style={{ marginBottom: 14 }}>{error}</div>}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Kirilmoqda..." : "Kirish"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}