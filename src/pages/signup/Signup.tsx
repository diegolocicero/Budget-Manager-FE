import { Link } from "react-router-dom";
import "./Signup.css";

export default function Login() {
  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Sign Up</h2>
        <div className="input-group">
          <input type="text" id="email" placeholder=" " autoComplete="email" />
          <label htmlFor="email">Email</label>
        </div>
        <div className="input-group">
          <input type="password" id="password" placeholder=" " autoComplete="current-password" />
          <label htmlFor="password">Password</label>
        </div>
        <button>Login</button>
        <p>
          Already have an account? <Link to="/" className="p-link">Login</Link>
        </p>
      </div>
    </div>
  );
}