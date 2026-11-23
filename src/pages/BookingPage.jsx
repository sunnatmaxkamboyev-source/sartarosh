import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import DateTimePage from "./DateTimePage.jsx";
import DetailsForm from "../components/DetailsForm.jsx";
import SuccessScreen from "../components/SuccessScreen.jsx";
import MyBookings from "../components/MyBookings.jsx";
import { MONTHS } from "../config.js";
import { slotRange, toDateKey } from "../utils/date.js";
import { createBooking } from "../api/api.js";
import { addMyToken } from "../utils/myBookings.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function BookingPage() {
  const { admin } = useAuth();
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [done, setDone] = useState(false);
  const [telegramLink, setTelegramLink] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const dateLabel = date
    ? `${date.getDate()}-${MONTHS[date.getMonth()].toLowerCase()}, ${date.getFullYear()}`
    : null;
  const timeLabel = time ? slotRange(time) : null;

  // Qadam: 1 = sana, 2 = vaqt, 3 = ma'lumot
  const step = showDetails ? 3 : date ? 2 : 1;

  const handleDateSelect = (d) => {
    setDate(d);
    setTime(null);
  };

  const handleTimeSelect = (t) => {
    setTime(t);
    setServerError("");
    setShowDetails(true);
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setServerError("");
    try {
      const booking = await createBooking({
        date: toDateKey(date),
        time,
        ...formData,
      });
      // Saytga qaytganda bronini ko'rsatish uchun kodni eslab qolamiz
      addMyToken(booking.viewToken);
      setTelegramLink(booking.telegramLink || "");
      setDone(true);
    } catch (err) {
      setServerError(err.message || "Xatolik yuz berdi. Qayta urinib ko'ring.");
    } finally {
      setSubmitting(false);
    }
  };

  const restart = () => {
    setDate(null);
    setTime(null);
    setShowDetails(false);
    setDone(false);
    setTelegramLink("");
    setServerError("");
  };

  const adminLink = admin && (
    <Link to="/admin" className="admin-link">
      Admin panel
    </Link>
  );

  if (done) {
    return (
      <div className="shell">
        {adminLink}
        <div className="card success-card">
          <SuccessScreen
            dateLabel={dateLabel}
            timeLabel={timeLabel}
            telegramLink={telegramLink}
            onRestart={restart}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="shell">
      {adminLink}
      {!showDetails && <MyBookings />}
      <div className="card">
        <Sidebar
          step={step}
          dateLabel={dateLabel}
          timeLabel={timeLabel}
          onBack={showDetails ? () => setShowDetails(false) : null}
        />
        <main className="main">
          {!showDetails ? (
            <DateTimePage
              date={date}
              time={time}
              onDateSelect={handleDateSelect}
              onTimeSelect={handleTimeSelect}
            />
          ) : (
            <div className="page">
              <h1 className="page-title">Ma'lumotlarni kiriting</h1>
              <DetailsForm
                onSubmit={handleSubmit}
                submitting={submitting}
                serverError={serverError}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}