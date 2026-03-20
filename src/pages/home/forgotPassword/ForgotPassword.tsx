import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../../supabaseClient";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/loadingSpinner/LoadingSpinner";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
      toast.success("Email inviata! Controlla la tua casella.");
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      {loading && <LoadingSpinner />}

      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>

        {sent ? (
          <p style={{ textAlign: "center" }}>
            Controlla la tua email per il link di reset.
          </p>
        ) : (
          <>
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

            <button type="submit" disabled={loading}>
              {loading ? "Invio..." : "Invia link"}
            </button>
          </>
        )}

        <p>
          <Link to="/" className="p-link">Torna al Login</Link>
        </p>
      </form>
    </div>
  );
}