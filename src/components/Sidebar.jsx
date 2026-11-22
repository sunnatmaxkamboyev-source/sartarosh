import { useEffect, useState } from "react";
import { BARBER } from "../config.js";
import { getProfile } from "../api/api.js";

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const ClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);
const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" />
  </svg>
);

// step: 1 = sana, 2 = vaqt, 3 = ma'lumot
export default function Sidebar({ step, dateLabel, timeLabel, onBack }) {
  const [barber, setBarber] = useState(BARBER);

  useEffect(() => {
    getProfile().then(setBarber);
  }, []);

  const stepTexts = {
    1: "Iltimos, o'zingizga qulay sanani tanlang.",
    2: "Iltimos, o'zingizga qulay vaqtni tanlang.",
    3: "Ma'lumotlaringizni to'g'ri kiriting.",
  };

  const items = [
    { n: 1, icon: <CalendarIcon />, label: dateLabel || "Sana" },
    { n: 2, icon: <ClockIcon />, label: timeLabel || "Vaqt" },
    { n: 3, icon: <UserIcon />, label: "Ma'lumot kiritish" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        {onBack && (
          <button className="back-btn" onClick={onBack}>
            ‹ Orqaga
          </button>
        )}
        <div className="logo">
          <span className="logo-mark">B</span>
          <span className="logo-text">BARBER</span>
        </div>
      </div>

      <div className="sidebar-body">
        <div className="avatar">
          {barber.photo ? (
            <img src={barber.photo} alt={barber.name} />
          ) : (
            <span>{barber.name.charAt(0)}</span>
          )}
        </div>
        <div className="barber-title">{barber.title}</div>
        <div className="barber-name">{barber.name}</div>

        <div className="step-label">
          <span className="dot" /> {Math.min(step + 1, 3)}-qadam
        </div>
        <p className="step-text">{stepTexts[step]}</p>

        <ol className="timeline">
          {items.map((it) => {
            const state =
              it.n < step ? "done" : it.n === step ? "active" : "idle";
            return (
              <li key={it.n} className={`tl-item ${state}`}>
                <span className="tl-icon">{it.icon}</span>
                <span className="tl-label">{it.label}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </aside>
  );
}