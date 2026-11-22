import { useState } from "react";
import { MONTHS, WEEKDAYS_SHORT } from "../config.js";
import { startOfToday, toDateKey } from "../utils/date.js";

export default function Calendar({ selectedDate, onSelect }) {
  const today = startOfToday();
  const [view, setView] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const year = view.getFullYear();
  const month = view.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Dushanba = 0 bo'lishi uchun siljitamiz
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;

  const isCurrentMonth =
    year === today.getFullYear() && month === today.getMonth();

  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  return (
    <div className="calendar">
      <div className="cal-header">
        <button
          className="nav-btn"
          disabled={isCurrentMonth}
          onClick={() => setView(new Date(year, month - 1, 1))}
          aria-label="Oldingi oy"
        >
          ‹
        </button>
        <span className="cal-title">
          {MONTHS[month]} {year}
        </span>
        <button
          className="nav-btn active"
          onClick={() => setView(new Date(year, month + 1, 1))}
          aria-label="Keyingi oy"
        >
          ›
        </button>
      </div>

      <div className="cal-grid cal-weekdays">
        {WEEKDAYS_SHORT.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>

      <div className="cal-grid">
        {cells.map((date, i) => {
          if (!date) return <div key={`e${i}`} />;
          const past = date < today;
          const selected =
            selectedDate && toDateKey(date) === toDateKey(selectedDate);
          const isToday = toDateKey(date) === toDateKey(today);
          return (
            <button
              key={i}
              disabled={past}
              onClick={() => onSelect(date)}
              className={
                "day" +
                (past ? " past" : " available") +
                (selected ? " selected" : "") +
                (isToday ? " today" : "")
              }
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}