import { useEffect, useState } from "react";
import Calendar from "../components/Calendar.jsx";
import TimeSlots from "../components/TimeSlots.jsx";
import { getBookedSlots } from "../api/api.js";

export default function DateTimePage({ date, time, onDateSelect, onTimeSelect }) {
  const [booked, setBooked] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sana tanlanganda shu kundagi band vaqtlarni olamiz
  useEffect(() => {
    if (!date) return;
    let cancelled = false;
    setLoading(true);
    getBookedSlots(date)
      .then((list) => {
        if (!cancelled) {
          setBooked(list);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setBooked([]);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [date]);

  return (
    <div className="page">
      <h1 className="page-title">Sana va vaqtni tanlang</h1>
      <div className="datetime">
        <Calendar selectedDate={date} onSelect={onDateSelect} />
        {date && (
          <TimeSlots
            date={date}
            booked={booked}
            loading={loading}
            selected={time}
            onSelect={onTimeSelect}
          />
        )}
      </div>
    </div>
  );
}