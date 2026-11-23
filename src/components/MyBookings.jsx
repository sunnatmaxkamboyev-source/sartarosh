import { useEffect, useState } from "react";
import { cancelMyBooking, getMyBookings } from "../api/api.js";
import { getMyTokens } from "../utils/myBookings.js";
import { MONTHS } from "../config.js";
import { slotRange, toDateKey } from "../utils/date.js";

// "2026-12-02" -> "2-dekabr"
const dateText = (key) => {
  const [, m, d] = key.split("-").map(Number);
  return `${d}-${MONTHS[m - 1].toLowerCase()}`;
};

const STATUS_TEXT = {
  new: "Faol",
  done: "Bajarilgan",
  cancelled: "Bekor qilingan",
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  const load = () => {
    const tokens = getMyTokens();
    if (tokens.length === 0) return;
    getMyBookings(tokens)
      .then(setBookings)
      .catch(() => {});
  };

  useEffect(() => {
    load();
    // Admin holatni o'zgartirsa, mijoz ham ko'rishi uchun vaqti-vaqti bilan yangilaymiz
    const timer = setInterval(load, 30000);
    window.addEventListener("focus", load);
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", load);
    };
  }, []);

  const handleCancel = async (booking) => {
    if (!window.confirm("Broningizni bekor qilasizmi?")) return;
    setError("");
    try {
      await cancelMyBooking(booking.token);
    } catch (err) {
      setError(err.message);
    }
    load();
  };

  const today = toDateKey(new Date());
  const visible = bookings.filter((b) => b.date >= today);

  if (visible.length === 0) return null;

  return (
    <div className="my-bookings">
      <div className="my-bookings-title">Sizning bronlaringiz</div>
      {visible.map((b) => {
        const total = b.services.reduce((sum, s) => sum + s.price, 0);
        return (
          <div
            key={b.id}
            className={"my-booking" + (b.status === "cancelled" ? " cancelled" : "")}
          >
            <div className="my-booking-when">
              <strong>{dateText(b.date)}</strong>, {slotRange(b.time)}
            </div>
            <div className="my-booking-services">
              {b.services.map((s) => s.name).join(", ")} ·{" "}
              {total.toLocaleString("ru-RU")} so'm
            </div>
            <div className="my-booking-actions">
              <span className={"badge " + b.status}>{STATUS_TEXT[b.status]}</span>
              {b.status === "new" && (
                <button
                  className="btn-small danger"
                  onClick={() => handleCancel(b)}
                >
                  Bekor qilish
                </button>
              )}
            </div>
          </div>
        );
      })}
      {error && <div className="error-text">{error}</div>}
    </div>
  );
}