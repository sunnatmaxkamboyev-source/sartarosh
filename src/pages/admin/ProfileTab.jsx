import { useEffect, useState } from "react";
import { getProfile, saveProfile } from "../../api/api.js";
import { resizeImage } from "../../utils/image.js";

export default function ProfileTab() {
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getProfile().then(setProfile);
  }, []);

  if (!profile) return null;

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      return setError("Faqat rasm faylini tanlang");
    }
    setError("");
    setMessage("");
    const photo = await resizeImage(file, 300);
    setProfile((p) => ({ ...p, photo }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (profile.name.trim().length < 2) return setError("Ismni kiriting");
    setError("");
    await saveProfile({ ...profile, name: profile.name.trim() });
    setMessage("Saqlandi");
  };

  return (
    <div className="panel profile">
      <form onSubmit={handleSave}>
        <div className="profile-photo">
          <div className="avatar big">
            {profile.photo ? (
              <img src={profile.photo} alt="Profil rasmi" />
            ) : (
              <span>{profile.name.charAt(0)}</span>
            )}
          </div>
          <div className="profile-photo-actions">
            <label className="btn-outline file-btn">
              Rasm tanlash
              <input type="file" accept="image/*" onChange={handleFile} hidden />
            </label>
            {profile.photo && (
              <button
                type="button"
                className="btn-small danger"
                onClick={() => setProfile((p) => ({ ...p, photo: "" }))}
              >
                Rasmni olib tashlash
              </button>
            )}
          </div>
        </div>

        <label className="plain-label">Ism</label>
        <input
          className="input full"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
        />

        <label className="plain-label">Lavozim</label>
        <input
          className="input full"
          value={profile.title}
          onChange={(e) => setProfile({ ...profile, title: e.target.value })}
        />

        {error && <div className="error-text">{error}</div>}
        {message && <div className="success-note">{message}</div>}

        <button type="submit" className="btn-primary" style={{ marginTop: 20 }}>
          Saqlash
        </button>
      </form>
    </div>
  );
}