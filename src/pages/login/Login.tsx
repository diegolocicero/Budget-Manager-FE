import { Link } from "react-router-dom";
import "./Login.css";

export default function Login() {
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
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
          Don't have an account? <Link to="/signup" className="p-link">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}