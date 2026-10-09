// Sidebar.jsx — The navigation panel on the left side.
// This is a COMPONENT — a reusable piece of UI.

import { NavLink } from 'react-router-dom'
// NavLink = like a normal link BUT it knows which page you're on
// and adds an "active" style automatically.

import '../styles/Sidebar.css'

function Sidebar() {
  return (
    <aside className="sidebar">

      {/* Your brand name */}
      <div className="sidebar-logo">
        <h2>TixM8</h2>
        <span>Admin Panel</span>
      </div>

      <nav className="sidebar-nav">
        {/* isActive = true when you're on that page (highlights the link) */}
        <NavLink to="/"        className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>📊 Dashboard</NavLink>
        <NavLink to="/events"  className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>🎬 Events</NavLink>
        <NavLink to="/orders"  className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>🧾 Orders</NavLink>
        <NavLink to="/users"   className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>👥 Users</NavLink>
      </nav>

      <div className="sidebar-footer">
        <p>Logged in as</p>
        <strong>Admin</strong>
      </div>

    </aside>
  )
}

export default Sidebar