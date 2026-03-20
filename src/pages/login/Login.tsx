import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import LoadingSpinner from "../../components/loadingSpinner/LoadingSpinner";
import "./Login.css";
import { apiFetch } from "../../services/APIClient";
import { useUser } from "../../services/UserContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { refreshProfile } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error(error.message);
    } else {
      await apiFetch("/users/sync", { method: "POST" });
      await refreshProfile();
      toast.success("Bentornato!");
      navigate("/home");
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      {loading && <LoadingSpinner />}

      <form className="login-card" onSubmit={handleLogin}>
        <h2>Login</h2>

        <div className="input-group">
          <input
            type="email"
            id="email"
            placeholder=" "
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="email">Email</label>
        </div>

        <div className="input-group">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder=" "
            autoComplete="current-password"
            className="has-toggle"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="password">Password</label>
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Nascondi password" : "Mostra password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Accedi..." : "Accedi"}
        </button>

        <p>
          Non hai un account? <Link to="/signup" className="p-link">Registrati</Link>
        </p>

        <p style={{ marginTop: "-1.5rem", fontSize: "13px", opacity: 0.5, fontWeight: 300 }}>
          <Link to="/forgot-password" className="p-link">Hai dimenticato la password?</Link>
        </p>
      </form>
    </div>
  );
}