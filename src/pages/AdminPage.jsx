import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { formatPhone } from "../utils/phone.js";
import BookingsTab from "./admin/BookingsTab.jsx";
import ServicesTab from "./admin/ServicesTab.jsx";
import ProfileTab from "./admin/ProfileTab.jsx";

const TABS = [
  { key: "bookings", label: "Bronlar" },
  { key: "services", label: "Xizmatlar" },
  { key: "profile", label: "Profil" },
];

export default function AdminPage() {
  const { admin, logout } = useAuth();
  const [tab, setTab] = useState("bookings");

  return (
    <div className="admin">
      <header className="admin-header">
        <div className="logo">
          <span className="logo-mark">B</span>
          <span className="logo-text">BARBER</span>
        </div>

        <div className="admin-actions">
          <Link to="/" className="link-btn">
            Saytga qaytish
          </Link>
          <span className="admin-phone">{formatPhone(admin.phone.slice(4))}</span>
          <button className="btn-outline" onClick={logout}>
            Chiqish
          </button>
        </div>
      </header>

      <main className="admin-main">
        <div className="tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={"tab" + (tab === t.key ? " active" : "")}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "bookings" && <BookingsTab />}
        {tab === "services" && <ServicesTab />}
        {tab === "profile" && <ProfileTab />}
      </main>
    </div>
  );
}