import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useUser } from "../../services/UserContext";
import toast from "react-hot-toast";
import "./Header.css";

const ROUTE_LABELS: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/profile": "Profilo",
};

export default function Header() {
  const location = useLocation();
  const pageTitle = ROUTE_LABELS[location.pathname] ?? "Flusso";
  const { profile } = useUser();

  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Errore durante il logout.");
    } else {
      toast.success("Arrivederci!");
      navigate("/");
    }
    setLoggingOut(false);
  };

  return (
    <header className="app-header">
      <div className="header-logo">
        <span className="header-logo-text">{pageTitle}</span>
      </div>

      <div className="header-user" ref={dropdownRef}>
        <button
          className="header-user-btn"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <div className="header-avatar-wrap">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="avatar" className="header-avatar-img" />
            ) : (
              <div className="header-avatar-placeholder">👤</div>
            )}
          </div>
          <span className="header-email">{profile.email}</span>
          <span className={`header-chevron ${open ? "open" : ""}`}>›</span>
        </button>

        {open && (
          <div className="header-dropdown">
            <div
              className="dropdown-profile-row clickable"
              onClick={() => { navigate("/profile"); setOpen(false); }}
            >
              <div className="dropdown-avatar-wrap">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="avatar" className="dropdown-avatar-img" />
                ) : (
                  <div className="dropdown-avatar-placeholder">👤</div>
                )}
              </div>
              <span className="dropdown-email">{profile.email}</span>
            </div>

            <div className="dropdown-divider" />

            <button
              className="dropdown-logout-btn"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              <span className="logout-icon">⏻</span>
              {loggingOut ? "Uscita..." : "Logout"}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}