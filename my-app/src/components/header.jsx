function Header() {
  return (
    <header className="header">
      <div className="header-title">
        <h2>Dashboard</h2>  {/* later you can make this dynamic per page */}
      </div>
      <div className="header-right">
        <span>👤 Admin</span>
      </div>
    </header>
  )
}

export default Header