// 📝 LEARN: onToggle is a PROP — it's the toggleSidebar function from App.jsx
// When the button is clicked, it calls onToggle() which runs the function in App.jsx
// and changes isCollapsed there — which then updates the Sidebar automatically.

import { Menu, Bell, Search } from 'lucide-react'

function Header({ onToggle }) {
  return (
    <header
      className="flex justify-between items-center gap-3 shrink-0 px-4"
      style={{
        height: 52,
        background: 'var(--bg2)',
        borderBottom: '1px solid var(--border)',
      }}>
      
      {/* ── Left Side ── */}
      <div className="flex items-center gap-5">
        {/* ── Toggle Button ── */}
        {/* 📝 LEARN: onClick calls onToggle — which is the function from App.jsx */}
        <button
          onClick={onToggle}
          className="flex items-center justify-center rounded-md transition-colors"
          style={{ width: 32, height: 32, color: 'var(--text-2)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <Menu size={20} />
        </button>

        {/* ── Search Bar ── */}
        <div
          className="flex items-center gap-2 rounded-full px-3 flex-1 max-w-sm"
          style={{
            height: 32,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
          }}
        >
          <Search size={15} style={{ color: 'var(--text-3)' }} />
          <input
            className="bg-transparent text-xs outline-none w-full"
            placeholder="Search…"
            style={{ color: 'var(--text)' }}
          />
        </div>
      </div>
      
      {/* ── Right Side ── */}
      <div className="ml-auto flex items-center gap-2">

        {/* System status pill */}
        <div
          className="hidden sm:flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-semibold"
          style={{
            background: 'var(--green-dim)',
            border: '1px solid rgba(34,212,122,0.2)',
            color: 'var(--green)',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--green)' }} />
          All Systems Operational
        </div>

        {/* Notification button */}
        <button
          className="flex items-center justify-center rounded-md relative transition-colors"
          style={{ width: 30, height: 30, color: 'var(--text-2)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <Bell size={20} />
          {/* Red dot indicator */}
          <span
            className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
            style={{ background: 'var(--red)' }}
          />
        </button>

        {/* User avatar */}
        <div
          className="flex items-center justify-center rounded-full font-bold cursor-pointer"
          style={{ width: 28, height: 28, background: 'var(--accent)', fontSize: 10, color: '#000' }}
        >
          SA
        </div>

      </div>
    </header>
  )
}

export default Header