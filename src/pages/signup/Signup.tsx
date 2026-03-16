import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import toast from "react-hot-toast";
import "./Signup.css";
import LoadingSpinner from "../../components/loadingSpinner/LoadingSpinner";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Account creato! Verifica la tua email.");
      navigate("/");
    }
    setLoading(false);
  };

  return (
    <div className="signup-container">
      
      {loading && <LoadingSpinner />}

      <form className="signup-card" onSubmit={handleSignup}>
        <h2>Sign Up</h2>
        
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
            autoComplete="new-password" 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <label htmlFor="password">Password</label>
        </div>

        <button type="submit" disabled={loading}>
          Sign Up
        </button>

        <p>
          Already have an account? <Link to="/" className="p-link">Login</Link>
        </p>
      </form>
    </div>
  );
}