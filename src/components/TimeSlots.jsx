import { WEEKDAYS_FULL, MONTHS } from "../config.js";
import { generateSlots, isSlotPast } from "../utils/date.js";

export default function TimeSlots({ date, booked, loading, selected, onSelect }) {
  const slots = generateSlots();

  return (
    <div className="timeslots">
      <div className="ts-title">
        {WEEKDAYS_FULL[date.getDay()]}, {date.getDate()}-{MONTHS[date.getMonth()].toLowerCase()}
      </div>

      <div className="ts-list">
        {slots.map((slot) => {
          // Band yoki o'tib ketgan vaqt: xira bo'ladi va bosib bo'lmaydi
          const disabled = booked.includes(slot) || isSlotPast(date, slot);
          return (
            <button
              key={slot}
              disabled={disabled || loading}
              onClick={() => onSelect(slot)}
              className={
                "slot" +
                (disabled ? " disabled" : "") +
                (selected === slot ? " selected" : "")
              }
            >
              {slot}
            </button>
          );
        })}
      </div>
    </div>
  );
}