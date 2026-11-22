const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);
const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

export default function SuccessScreen({
  dateLabel,
  timeLabel,
  telegramLink,
  onRestart,
}) {
  return (
    <div className="success">
      <div className="success-icon">
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </div>

      <div className="chips">
        <span className="chip">
          <span className="chip-icon"><CalendarIcon /></span>
          {dateLabel}
        </span>
        <span className="chip">
          <span className="chip-icon"><ClockIcon /></span>
          {timeLabel}
        </span>
      </div>

      <p className="success-text">
        Rahmat!
        <br />
        Broningiz muvaffaqiyatli yakunlandi.
      </p>

      {telegramLink && (
        <div className="tg-block">
          <a
            className="tg-btn"
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <SendIcon />
            Telegramda xabar olish
          </a>
          <p className="tg-hint">
            Bron o'zgarsa yoki bekor qilinsa, sizga Telegramdan xabar beramiz.
          </p>
        </div>
      )}

      <button className="btn-primary" onClick={onRestart}>
        Boshidan boshlash
      </button>
    </div>
  );
}