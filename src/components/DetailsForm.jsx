import { useEffect, useState } from "react";
import { getServices } from "../api/api.js";
import { formatPhone, parsePhone } from "../utils/phone.js";

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" />
  </svg>
);
const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z" />
  </svg>
);

export default function DetailsForm({ onSubmit, submitting, serverError }) {
  const [services, setServices] = useState([]);
  const [name, setName] = useState("");
  const [digits, setDigits] = useState(""); // faqat 9 ta raqam
  const [selected, setSelected] = useState([]);
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    getServices().then(setServices);
  }, []);

  const toggleService = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (name.trim().length < 2) errs.name = "Ismingizni kiriting";
    if (digits.length !== 9) errs.phone = "Telefon raqamni to'liq kiriting";
    if (selected.length === 0) errs.services = "Kamida bitta xizmatni tanlang";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    onSubmit({
      name: name.trim(),
      phone: "+998" + digits,
      serviceIds: selected,
      note: note.trim(),
    });
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className={"field" + (errors.name ? " error" : "")}>
        <label className="field-label">Ism *</label>
        <div className="field-box">
          <span className="field-icon">
            <UserIcon />
          </span>
          <input
            type="text"
            placeholder="Ismingizni kiriting"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        {errors.name && <div className="error-text">{errors.name}</div>}
      </div>

      <div className={"field" + (errors.phone ? " error" : "")}>
        <label className="field-label">Telefon raqam *</label>
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
        {errors.phone && <div className="error-text">{errors.phone}</div>}
      </div>

      <h3 className="form-subtitle">Qaysi xizmatlar kerak? *</h3>
      <div className="checks">
        {services.map((s) => (
          <label key={s.id} className="check">
            <input
              type="checkbox"
              checked={selected.includes(s.id)}
              onChange={() => toggleService(s.id)}
            />
            <span className="box" />
            <span className="check-name">{s.name}</span>
            <span className="check-price">
              {s.price.toLocaleString("ru-RU")} so'm
            </span>
          </label>
        ))}
      </div>
      {errors.services && (
        <div className="error-text" style={{ marginTop: 8 }}>
          {errors.services}
        </div>
      )}

      <h3 className="form-subtitle">Izoh</h3>
      <div className="field">
        <div className="field-box area">
          <textarea
            placeholder="Bizga yozing...."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </div>

      {serverError && <div className="error-text">{serverError}</div>}

      <button type="submit" className="btn-primary" disabled={submitting}>
        {submitting ? "Yuborilmoqda..." : "Bronni tasdiqlash"}
      </button>
    </form>
  );
}