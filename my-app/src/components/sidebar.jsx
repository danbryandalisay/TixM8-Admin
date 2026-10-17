import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  BarChart2,
  Users,
  CalendarDays,
  CreditCard,
  Undo2,
  UserCog,
  Lock,
  ClipboardCheck,
  HeartPulse,
  Settings,
} from 'lucide-react'

// 📝 LEARN: Instead of storing a string like 'dashboard',
// we store the actual icon component: LayoutDashboard
// Then we render it dynamically below using <item.icon />

const navSections = [
  {
    label: 'Overview',
    items: [
      { to: '/',          icon: LayoutDashboard, text: 'Dashboard'    },
      { to: '/analytics', icon: BarChart2,        text: 'Analytics'    },
    ],
  },
  {
    label: 'Platform',
    items: [
      { to: '/operators', icon: Users,      text: 'Operators',    badge: '128', badgeColor: 'blue' },
      { to: '/events',    icon: CalendarDays, text: 'All Events'                                   },
      { to: '/orders',    icon: CreditCard,  text: 'Transactions'                                  },
      { to: '/refunds',   icon: Undo2,       text: 'Refunds',      badge: '7',  badgeColor: 'red'  },
    ],
  },
  {
    label: 'Administration',
    items: [
      { to: '/users',       icon: UserCog,        text: 'Users & Roles'                               },
      { to: '/permissions', icon: Lock,            text: 'Permissions'                                 },
      { to: '/audit',       icon: ClipboardCheck,  text: 'Audit Log',  badge: '3', badgeColor: 'yellow'},
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/health',   icon: HeartPulse, text: 'System Health' },
      { to: '/settings', icon: Settings,   text: 'Settings'      },
    ],
  },
]

// 📝 LEARN: isCollapsed is a PROP — passed in from App.jsx
function Sidebar({ isCollapsed }) {
  return (
    <aside
      className="flex flex-col h-screen shrink-0 overflow-hidden transition-all duration-300 ease-in-out"
      style={{
        width: isCollapsed ? '52px' : '220px', // ← changes based on prop
        background: 'var(--bg2)',
        borderRight: '1px solid var(--border)',
      }}
    >

      {/* ── Logo / Brand ── */}
      <div
        className="flex items-center gap-3 shrink-0"
        style={{
          padding: isCollapsed ? '18px 11px' : '18px 16px',
          borderBottom: '1px solid var(--border)',
          transition: 'padding 0.3s ease',
        }}
      >
        {/* Brand icon — always visible */}
        <div
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{ width: 30, height: 30, background: 'var(--accent)' }}
        >
          <span
            className="material-symbols-rounded"
            style={{ fontSize: 16, color: '#000', fontVariationSettings: "'FILL' 1" }}
          >
            confirmation_number
          </span>
        </div>

        {/* Brand text — fades out when collapsed */}
        {/* 📝 LEARN: overflow-hidden + w-0 trick hides the text smoothly */}
        <div
          className="overflow-hidden whitespace-nowrap transition-all duration-300"
          style={{
            width: isCollapsed ? 0 : 'auto',
            opacity: isCollapsed ? 0 : 1,
          }}
        >
          <div className="font-bold text-sm" style={{ color: 'var(--text)' }}>TixM8</div>
          <div className="text-[9px] uppercase tracking-widest" style={{ color: 'var(--text-3)' }}>
            Admin Panel
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2">
        {navSections.map((section) => (
          <div key={section.label} className="px-2 mb-1">

            {/* Section label — hidden when collapsed */}
            <div
              className="overflow-hidden transition-all duration-300"
              style={{ height: isCollapsed ? 0 : 22, opacity: isCollapsed ? 0 : 1 }}
            >
              <p
                className="text-[9px] font-bold uppercase tracking-widest px-2 mb-1"
                style={{ color: 'var(--text-3)' }}
              >
                {section.label}
              </p>
            </div>

            {/* Nav items */}
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                title={isCollapsed ? item.text : ''}
                className={({ isActive }) =>
                  `flex items-center rounded-md text-xs font-medium cursor-pointer transition-all duration-150
                  ${isActive ? 'active-nav' : ''}`
                }
                // ✅ Fixed — icon stays left always, never moves
                style={({ isActive }) => ({
                  padding: '8px 10px',           // ← same padding always
                  justifyContent: 'flex-start',  // ← always left, icon never shifts
                  gap: 8,                        // ← gap stays, text just fades to 0 width
                  color: isActive ? 'var(--accent)' : 'var(--text-2)',
                  background: isActive ? 'var(--accent-dim)' : 'transparent',
                })}
                onMouseEnter={e => {
                  if (!e.currentTarget.classList.contains('active-nav'))
                    e.currentTarget.style.background = 'var(--surface)'
                }}
                onMouseLeave={e => {
                  if (!e.currentTarget.classList.contains('active-nav'))
                    e.currentTarget.style.background = 'transparent'
                }}
              >
                {/* Icon — always visible, never shrinks */}
                <item.icon size={18} strokeWidth={1.8} className="shrink-0" />

                {/* Text — smoothly hides when collapsed */}
                {/* 📝 LEARN: max-w-0 + overflow-hidden is the cleanest way to animate text hiding */}
                <span
                  className="whitespace-nowrap overflow-hidden transition-all duration-300"
                  style={{
                    maxWidth: isCollapsed ? 0 : 200,   // ← collapses to 0 width smoothly
                    opacity: isCollapsed ? 0 : 1,
                  }}
                >
                  {item.text}
                </span>

                {/* Badge — only show when open */}
                {item.badge && !isCollapsed && (
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-auto shrink-0"
                    style={{
                      background: item.badgeColor === 'blue'
                        ? 'var(--blue)'
                        : item.badgeColor === 'yellow'
                          ? 'var(--yellow)'
                          : 'var(--red)',
                      color: item.badgeColor === 'yellow' ? '#000' : '#fff',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* ── Footer / User ── */}
      <div
        className="flex items-center gap-2 shrink-0 cursor-pointer transition-colors"
        style={{
          padding: isCollapsed ? '12px 11px' : '12px 14px',
          borderTop: '1px solid var(--border)',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          transition: 'padding 0.3s ease',
        }}
      >
        {/* Avatar */}
        <div
          className="flex items-center justify-center rounded-full font-bold shrink-0"
          style={{ width: 30, height: 30, background: 'var(--accent)', fontSize: 11, color: '#000' }}
        >
          SA
        </div>

        {/* User info */}
        <div
          className="overflow-hidden whitespace-nowrap transition-all duration-300"
          style={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : 'auto' }}
        >
          <div className="text-xs font-semibold" style={{ color: 'var(--text)' }}>Super Admin</div>
          <div className="text-[10px]" style={{ color: 'var(--text-2)' }}>God Mode</div>
        </div>

        {/* Online dot */}
        {!isCollapsed && (
          <div
            className="w-2 h-2 rounded-full ml-auto shrink-0"
            style={{ background: 'var(--green)' }}
          />
        )}
      </div>

    </aside>
  )
}

export default Sidebar