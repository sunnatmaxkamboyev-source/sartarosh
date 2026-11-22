import { useEffect, useState } from "react";
import { getBookings, setBookingStatus } from "../../api/api.js";
import { formatPhone } from "../../utils/phone.js";
import { slotRange, toDateKey } from "../../utils/date.js";

const STATUS_FILTERS = [
  { key: "all", label: "Barchasi" },
  { key: "new", label: "Yangi" },
  { key: "done", label: "Bajarilgan" },
  { key: "cancelled", label: "Bekor qilingan" },
];

const DATE_FILTERS = [
  { key: "all", label: "Barcha sanalar" },
  { key: "today", label: "Bugun" },
  { key: "tomorrow", label: "Ertaga" },
];

const STATUS_TEXT = {
  new: "Yangi",
  done: "Bajarilgan",
  cancelled: "Bekor qilingan",
};

// "2026-11-20" -> "20.11.2026"
const formatDate = (key) => key.split("-").reverse().join(".");

// Bugundan offset kun keyingi sana: 0 = bugun, 1 = ertaga
const dayKey = (offset) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return toDateKey(d);
};

export default function BookingsTab() {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("all");
  const [dateFilter, setDateFilter] = useState("all"); // all | today | tomorrow | custom
  const [customDate, setCustomDate] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const load = () =>
    getBookings()
      .then(setBookings)
      .catch((err) => setError(err.message));

  useEffect(() => {
    load();
  }, []);

  const changeStatus = async (id, newStatus) => {
    setError("");
    try {
      await setBookingStatus(id, newStatus);
    } catch (err) {
      setError(err.message);
    }
    load();
  };

  const pickQuickDate = (key) => {
    setDateFilter(key);
    setCustomDate("");
  };

  const pickCustomDate = (value) => {
    setCustomDate(value);
    setDateFilter(value ? "custom" : "all");
  };

  const targetDate =
    dateFilter === "today"
      ? dayKey(0)
      : dateFilter === "tomorrow"
      ? dayKey(1)
      : dateFilter === "custom"
      ? customDate
      : null;

  const q = search.trim().toLowerCase();
  const qDigits = q.replace(/\D/g, "");

  const shown = bookings.filter((b) => {
    if (status !== "all" && b.status !== status) return false;
    if (targetDate && b.date !== targetDate) return false;
    if (q) {
      const byName = b.name.toLowerCase().includes(q);
      const byPhone =
        qDigits.length > 0 && b.phone.replace(/\D/g, "").includes(qDigits);
      if (!byName && !byPhone) return false;
    }
    return true;
  });

  return (
    <div className="panel">
      <div className="toolbar">
        <input
          className="input"
          placeholder="Ism yoki telefon bo'yicha qidirish"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="date"
          className="input date"
          value={customDate}
          onChange={(e) => pickCustomDate(e.target.value)}
          aria-label="Sanani tanlash"
        />
      </div>

      <div className="filters">
        {DATE_FILTERS.map((f) => (
          <button
            key={f.key}
            className={"filter" + (dateFilter === f.key ? " active" : "")}
            onClick={() => pickQuickDate(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="filters">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.key}
            className={"filter" + (status === f.key ? " active" : "")}
            onClick={() => setStatus(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && <div className="error-text">{error}</div>}

      <div className="results-count">Topildi: {shown.length} ta</div>

      {shown.length === 0 && <p className="empty">Bronlar yo'q</p>}

      {shown.map((b) => {
        const total = b.services.reduce((sum, s) => sum + s.price, 0);
        return (
          <div key={b.id} className="booking">
            <div className="booking-when">
              <div className="booking-date">{formatDate(b.date)}</div>
              <div className="booking-time">{slotRange(b.time)}</div>
            </div>

            <div className="booking-info">
              <div className="booking-name">{b.name}</div>
              <a className="booking-phone" href={`tel:${b.phone}`}>
                {formatPhone(b.phone.slice(4))}
              </a>
              <div className={"tg-status " + (b.telegramLinked ? "on" : "off")}>
                {b.telegramLinked ? "Telegram ulangan ✓" : "Telegram ulanmagan"}
              </div>
              <div className="booking-services">
                {b.services.map((s) => s.name).join(", ")}
              </div>
              {b.note && <div className="booking-note">Izoh: {b.note}</div>}
            </div>

            <div className="booking-side">
              <span className={`badge ${b.status}`}>{STATUS_TEXT[b.status]}</span>
              <div className="booking-total">
                {total.toLocaleString("ru-RU")} so'm
              </div>
              {b.status === "new" && (
                <div className="booking-actions">
                  <button
                    className="btn-small"
                    onClick={() => changeStatus(b.id, "done")}
                  >
                    Bajarildi
                  </button>
                  <button
                    className="btn-small danger"
                    onClick={() => changeStatus(b.id, "cancelled")}
                  >
                    Bekor qilish
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}