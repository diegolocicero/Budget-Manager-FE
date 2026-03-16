import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/loadingSpinner/LoadingSpinner";
import "./Login.css"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Bentornato!");
      navigate("/dashboard");
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
            type="password" 
            id="password" 
            placeholder=" " 
            autoComplete="current-password" 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <label htmlFor="password">Password</label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Accedi..." : "Login"}
        </button>

        <p>
          Don't have an account? <Link to="/signup" className="p-link">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}