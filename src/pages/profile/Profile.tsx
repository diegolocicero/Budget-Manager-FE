import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserAPIService } from "../../services/UserAPIService";
import type { UserProfile } from "../../services/UserAPIService";
import { useUser } from "../../services/UserContext";
import toast from "react-hot-toast";
import "./Profile.css";

const AVATAR_OPTIONS = [
  "/avatars/avatar_1.png",
  "/avatars/avatar_2.png",
  "/avatars/avatar_3.png",
  "/avatars/avatar_4.png",
  "/avatars/avatar_5.png",
  "/avatars/avatar_6.png",
  "/avatars/avatar_7.png",
  "/avatars/avatar_8.png",
];

export default function Profile() {
  const navigate = useNavigate();
  const { refreshProfile } = useUser();

  const [profile, setProfile] = useState<UserProfile>({
    username: "",
    email: "",
    avatarUrl: null,
  });
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [savingUsername, setSavingUsername] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await UserAPIService.getMe();
        setProfile(data);
        setUsername(data.username);
        setSelectedAvatar(data.avatarUrl);
      } catch {
        toast.error("Errore nel caricamento del profilo.");
      }
    };
    loadProfile();
  }, []);

  const handleSaveAvatar = async () => {
    if (!selectedAvatar) return;
    setSavingAvatar(true);
    try {
      await UserAPIService.updateAvatar(profile.username, selectedAvatar);
      setProfile((prev) => ({ ...prev, avatarUrl: selectedAvatar }));
      await refreshProfile();
      toast.success("Immagine profilo aggiornata!");
    } catch (e: any) {
      toast.error(e.message ?? "Errore nel salvataggio dell'immagine.");
    } finally {
      setSavingAvatar(false);
    }
  };

  const handleSaveUsername = async () => {
    if (!username.trim()) return;
    setSavingUsername(true);
    try {
      await UserAPIService.updateUsername(username, profile.avatarUrl);
      setProfile((prev) => ({ ...prev, username }));
      await refreshProfile();
      toast.success("Username aggiornato!");
    } catch (e: any) {
      toast.error(e.message ?? "Errore nel salvataggio dell'username.");
    } finally {
      setSavingUsername(false);
    }
  };

  const handleSavePassword = async () => {
    if (!newPassword || !confirmPassword) return;
    setSavingPassword(true);
    try {
      await UserAPIService.updatePassword(newPassword, confirmPassword);
      toast.success("Password aggiornata!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e: any) {
      toast.error(e.message ?? "Errore nell'aggiornamento della password.");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div className="profile-inner">
        <section className="profile-avatar-section">
          <div className="profile-avatar-current">
            <img
              src={profile.avatarUrl ?? "/avatars/avatar_1.png"}
              alt="avatar"
              className="profile-avatar-img"
            />
            <div className="profile-avatar-badge">✎</div>
          </div>
          <div className="profile-avatar-info">
            <h1 className="profile-username">{profile.username || "—"}</h1>
            <p className="profile-email">{profile.email}</p>
          </div>
        </section>

        <section className="profile-card">
          <div className="profile-card-header">
            <h2 className="profile-card-title">Immagine Profilo</h2>
          </div>
          <div className="avatar-picker-grid">
            {AVATAR_OPTIONS.map((src, i) => (
              <button
                key={i}
                className={`avatar-option ${selectedAvatar === src ? "selected" : ""}`}
                onClick={() => setSelectedAvatar(src)}
              >
                <img src={src} alt={`avatar ${i + 1}`} />
              </button>
            ))}
          </div>
          <button
            className="profile-save-btn"
            onClick={handleSaveAvatar}
            disabled={savingAvatar || selectedAvatar === profile.avatarUrl}
          >
            {savingAvatar ? "Salvataggio..." : "Salva Immagine"}
          </button>
        </section>

        <section className="profile-card">
          <div className="profile-card-header">
            <h2 className="profile-card-title">Nome Utente</h2>
          </div>
          <div className="profile-field">
            <label>Username</label>
            <input
              type="text"
              placeholder="Il tuo username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <button
            className="profile-save-btn"
            onClick={handleSaveUsername}
            disabled={
              savingUsername ||
              !username.trim() ||
              username === profile.username
            }
          >
            {savingUsername ? "Salvataggio..." : "Salva Username"}
          </button>
        </section>

        <section className="profile-card">
          <div className="profile-card-header">
            <h2 className="profile-card-title">Password</h2>
          </div>
          <div className="profile-field">
            <label>Nuova Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="profile-field">
            <label>Conferma Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button
            className="profile-save-btn"
            onClick={handleSavePassword}
            disabled={savingPassword || !newPassword || !confirmPassword}
          >
            {savingPassword ? "Aggiornamento..." : "Aggiorna Password"}
          </button>
        </section>

        <div className="profile-actions-row">
          <button
            className="profile-back-btn"
            onClick={() => {
              window.scrollTo(0, 0);
              navigate("/home");
            }}
          >
            ← Indietro
          </button>
        </div>
      </div>
    </div>
  );
}
