import { useState, useRef, useEffect } from 'react'
import { Sun, Moon, LogOut } from 'lucide-react'

function Header({ onToggle, onLogout, onToggleTheme, isDark, user }) {

  // 📝 LEARN: useState to track if dropdown is open or closed
  const [dropdownOpen, setDropdownOpen] = useState(false)

  // 📝 LEARN: useRef — points to the dropdown DOM element
  // Used to detect clicks OUTSIDE the dropdown to close it
  const dropdownRef = useRef(null)

  // 📝 LEARN: useEffect to close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      // if click is outside the dropdown div → close it
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    // cleanup — remove listener when component unmounts
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header
      className="bg-gradient-to-l from-bg2/70 to-bg3 flex items-center gap-3 shrink-0 px-4 h-[52px]"
      style={{borderBottom: '1px solid var(--border)' }}
    >
      {/* Toggle Sidebar */}
      <button
        onClick={onToggle}
        className="flex items-center justify-center rounded-md w-8 h-8 transition-colors"
        style={{ color: 'var(--text-2)' }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <span className="material-symbols-rounded" style={{ fontSize: 20 }}>menu</span>
      </button>

      {/* Search */}
      <div
        className="flex items-center gap-2 rounded-full px-3 flex-1 max-w-sm h-8"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <span className="material-symbols-rounded" style={{ fontSize: 15, color: 'var(--text-3)' }}>search</span>
        <input
          className="bg-transparent text-xs outline-none w-full"
          placeholder="Search…"
          style={{ color: 'var(--text)' }}
        />
      </div>

      {/* Right Side */}
      <div className="ml-auto flex items-center gap-2">

        {/* System Status */}
        <div
          className="hidden sm:flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-semibold"
          style={{ background: 'var(--green-dim)', border: '1px solid rgba(34,212,122,0.2)', color: 'var(--green)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--green)' }} />
          All Systems Operational
        </div>

        {/* Notification */}
        <button
          className="relative flex items-center justify-center rounded-md w-8 h-8 transition-colors"
          style={{ color: 'var(--text-2)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <span className="material-symbols-rounded" style={{ fontSize: 18 }}>notifications</span>
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--red)' }} />
        </button>

        {/* Divider */}
        <div className="w-px h-5" style={{ background: 'var(--border)' }} />

        {/* ── User Avatar + Dropdown ── */}
        {/* 📝 LEARN: useRef attached here so we can detect outside clicks */}
        <div className="relative" ref={dropdownRef}>

          {/* Avatar Button — toggles dropdown */}
          <button
            onClick={() => setDropdownOpen(prev => !prev)}
            className="flex items-center gap-2 rounded-lg px-2 py-1 transition-colors"
            style={{ color: 'var(--text)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            {/* Avatar circle */}
            <div
              className="flex items-center justify-center rounded-full font-bold w-7 h-7 text-[10px]"
              style={{ background: 'var(--accent)', color: '#000' }}
            >
              {user?.username?.slice(0, 2).toUpperCase() || 'SA'}
            </div>
            {/* Name — hidden on small screens */}
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold leading-tight" style={{ color: 'var(--text)' }}>
                {user?.role}
              </div>
              <div className="text-[10px] leading-tight" style={{ color: 'var(--text-3)' }}>
                {user?.username}
              </div>
            </div>
            {/* Chevron */}
            <span
              className="material-symbols-rounded transition-transform duration-200"
              style={{
                fontSize: 16,
                color: 'var(--text-3)',
                transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            >
              expand_more
            </span>
          </button>

          {/* ── Dropdown Menu ── */}
          {/* 📝 LEARN: dropdownOpen controls visibility
              transition classes make it animate smoothly */}
          <div
            className="absolute right-0 top-full mt-2 w-56 rounded-xl overflow-hidden z-50 transition-all duration-200"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              // Animate: visible when open, hidden when closed
              opacity: dropdownOpen ? 1 : 0,
              transform: dropdownOpen ? 'translateY(0)' : 'translateY(-8px)',
              pointerEvents: dropdownOpen ? 'auto' : 'none',
            }}
          >
            {/* User info header */}
            <div className="p-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2.5 px-1 py-1 rounded-lg" style={{ background: 'var(--surface2)' }}>
                <div
                  className="flex items-center justify-center rounded-full font-bold w-8 h-8 text-[11px] shrink-0"
                  style={{ background: 'var(--accent)', color: '#000' }}
                >
                  {user?.username?.slice(0, 2).toUpperCase() || 'SA'}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold truncate" style={{ color: 'var(--text)' }}>
                    {user?.role}
                  </div>
                  <div className="text-[10px] truncate" style={{ color: 'var(--text-2)' }}>
                    {user?.username}
                  </div>
                </div>
              </div>
            </div>

            {/* Menu items */}
            <ul className="p-2 flex flex-col gap-0.5">

              {/* Dark Mode Toggle */}
              {/* 📝 LEARN: This item has both text AND a toggle switch */}
              <li
                className="flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer transition-colors"
                style={{ color: 'var(--text-2)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                onClick={onToggleTheme}
              >
                <div className="flex items-center gap-2 text-xs font-medium">
                  {isDark ? <Sun size={15} /> : <Moon size={15} />}
                  Dark mode
                </div>

                {/* Toggle switch */}
                {/* 📝 LEARN: This is a pure CSS toggle — no library needed */}
                <div
                  className="relative w-8 h-[18px] rounded-full transition-colors duration-200 shrink-0"
                  style={{ background: isDark ? 'var(--accent)' : 'var(--border2)' }}
                >
                  <div
                    className="absolute top-[2px] w-3.5 h-3.5 bg-white rounded-full shadow transition-transform duration-200"
                    style={{ transform: isDark ? 'translateX(18px)' : 'translateX(2px)' }}
                  />
                </div>
              </li>

              {/* Divider */}
              <li className="my-1" style={{ borderTop: '1px solid var(--border)' }} />

              {/* Sign Out */}
              <li
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer text-xs font-medium transition-colors"
                style={{ color: 'var(--red)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--red-dim)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                onClick={() => { setDropdownOpen(false); onLogout() }}
              >
                <LogOut size={15} />
                Sign out
              </li>

            </ul>
          </div>
        </div>

      </div>
    </header>
  )
}

export default Header