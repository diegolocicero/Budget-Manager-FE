import "./Profile.css";

const AVATAR_OPTIONS = [
  "/avatars/avatar_1.png",
  "/avatars/avatar_2.png",
  "/avatars/avatar_3.png",
  "/avatars/avatar_4.png",
];

export default function Profile() {
  return (
    <div className="profile-container">
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div className="profile-inner">

        {/* ── Avatar Section ── */}
        <section className="profile-avatar-section">
          <div className="profile-avatar-current">
            <img src="/avatars/avatar_1.png" alt="avatar" className="profile-avatar-img" />
            <div className="profile-avatar-badge">✎</div>
          </div>
          <div className="profile-avatar-info">
            <h1 className="profile-username">Username</h1>
            <p className="profile-email">email@example.com</p>
          </div>
        </section>

        {/* ── Avatar Picker ── */}
        <section className="profile-card">
          <div className="profile-card-header">
            <span className="profile-card-icon">🖼</span>
            <h2 className="profile-card-title">Immagine Profilo</h2>
          </div>
          <div className="avatar-picker-grid">
            {AVATAR_OPTIONS.map((src, i) => (
              <button key={i} className="avatar-option">
                <img src={src} alt={`avatar ${i + 1}`} />
              </button>
            ))}
          </div>
          <button className="profile-save-btn" disabled>
            Salva Immagine
          </button>
        </section>

        {/* ── Username Section ── */}
        <section className="profile-card">
          <div className="profile-card-header">
            <span className="profile-card-icon">👤</span>
            <h2 className="profile-card-title">Nome Utente</h2>
          </div>
          <div className="profile-field">
            <label>Username</label>
            <input
              type="text"
              placeholder="Il tuo username..."
              defaultValue="Username"
            />
          </div>
          <button className="profile-save-btn" disabled>
            Salva Username
          </button>
        </section>

        {/* ── Password Section ── */}
        <section className="profile-card">
          <div className="profile-card-header">
            <span className="profile-card-icon">🔒</span>
            <h2 className="profile-card-title">Password</h2>
          </div>
          <div className="profile-field">
            <label>Nuova Password</label>
            <input type="password" placeholder="••••••••" />
          </div>
          <div className="profile-field">
            <label>Conferma Password</label>
            <input type="password" placeholder="••••••••" />
          </div>
          <button className="profile-save-btn" disabled>
            Aggiorna Password
          </button>
        </section>

      </div>
    </div>
  );
}