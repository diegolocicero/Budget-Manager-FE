import { NavLink } from "react-router-dom";
import "./sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <NavLink
          to="/home"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <svg
            className="nav-icon"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
            <path d="M7 18v-7h6v7" />
          </svg>
          <span className="nav-tooltip">Home</span>
        </NavLink>

        <NavLink
          to="/insight"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <svg
            className="nav-icon"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="2,15 7,9 11,12 15,6 18,8" />
            <path d="M18 4v4h-4" />
          </svg>
          <span className="nav-tooltip">Insight</span>
        </NavLink>

        <NavLink
          to="/ledger"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <svg
            className="nav-icon"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 2h9l3 3v13a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z" />
            <path d="M13 2v4h3" />
            <line x1="7" y1="9" x2="13" y2="9" />
            <line x1="7" y1="12" x2="13" y2="12" />
            <line x1="7" y1="15" x2="10" y2="15" />
          </svg>
          <span className="nav-tooltip">Ledger</span>
        </NavLink>
      </nav>
    </aside>
  );
}
