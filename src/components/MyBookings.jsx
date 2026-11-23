import { useEffect, useState } from "react";
import { getMyBookings } from "../api/api.js";
import { getMyTokens } from "../utils/myBookings.js";
import { MONTHS } from "../config.js";
import { slotRange, toDateKey } from "../utils/date.js";

// "2026-12-02" -> "2-dekabr"
const dateText = (key) => {
  const [, m, d] = key.split("-").map(Number);
  return `${d}-${MONTHS[m - 1].toLowerCase()}`;
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const tokens = getMyTokens();
    if (tokens.length === 0) return;
    getMyBookings(tokens)
      .then(setBookings)
      .catch(() => {});
  }, []);

  const today = toDateKey(new Date());
  const upcoming = bookings.filter(
    (b) => b.date >= today && b.status !== "done"
  );

  if (upcoming.length === 0) return null;

  return (
    <div className="my-bookings">
      <div className="my-bookings-title">Sizning bronlaringiz</div>
      {upcoming.map((b) => {
        const total = b.services.reduce((sum, s) => sum + s.price, 0);
        const cancelled = b.status === "cancelled";
        return (
          <div key={b.id} className={"my-booking" + (cancelled ? " cancelled" : "")}>
            <div className="my-booking-when">
              <strong>{dateText(b.date)}</strong>, {slotRange(b.time)}
            </div>
            <div className="my-booking-services">
              {b.services.map((s) => s.name).join(", ")} ·{" "}
              {total.toLocaleString("ru-RU")} so'm
            </div>
            <span className={"badge " + (cancelled ? "cancelled" : "new")}>
              {cancelled ? "Bekor qilingan" : "Faol"}
            </span>
          </div>
        );
      })}
    </div>
  );
}