import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <NavLink to="/home" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <svg className="nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
            <path d="M7 18v-7h6v7" />
          </svg>
          <span className="nav-tooltip">Home</span>
        </NavLink>

        <NavLink to="/insight" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <svg className="nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="2,15 7,9 11,12 15,6 18,8" />
            <path d="M18 4v4h-4" />
          </svg>
          <span className="nav-tooltip">Insight</span>
        </NavLink>
      </nav>
    </aside>
  );
}