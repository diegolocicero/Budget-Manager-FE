import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import LoadingSpinner from "../../components/loadingSpinner/LoadingSpinner";
import "./resetPassword.css";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password aggiornata!");
      navigate("/");
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      {loading && <LoadingSpinner />}

      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Nuova Password</h2>

        <div className="input-group">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder=" "
            autoComplete="new-password"
            className="has-toggle"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="password">Nuova password</label>
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
          {loading ? "Salvataggio..." : "Conferma"}
        </button>
      </form>
    </div>
  );
}