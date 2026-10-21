import { useState } from 'react'
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
      { to: '/operators', icon: Users,       text: 'Operators',    badge: '128', badgeColor: 'blue'   },
      { to: '/events',    icon: CalendarDays, text: 'All Events'                                      },
      { to: '/orders',    icon: CreditCard,  text: 'Transactions'                                     },
      { to: '/refunds',   icon: Undo2,       text: 'Refunds',      badge: '7',   badgeColor: 'red'    },
    ],
  },
  {
    label: 'Administration',
    items: [
      { to: '/users',       icon: UserCog,       text: 'Users & Roles'                                },
      { to: '/permissions', icon: Lock,           text: 'Permissions'                                  },
      { to: '/audit',       icon: ClipboardCheck, text: 'Audit Log',  badge: '3', badgeColor: 'yellow' },
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

function Sidebar({ isCollapsed }) {

  // 📝 LEARN: useState stores the current tooltip to show
  // null = no tooltip, { text, y } = show tooltip at that vertical position
  const [tooltip, setTooltip] = useState(null)

  return (
    <aside
      className="bg-bg3 flex flex-col h-screen shrink-0 transition-all duration-300 ease-in-out"
      style={{
        width: isCollapsed ? '52px' : '220px',
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

        <div
          className="overflow-hidden whitespace-nowrap transition-all duration-300"
          style={{ width: isCollapsed ? 0 : 'auto', opacity: isCollapsed ? 0 : 1 }}
        >
          <div className="font-bold text-sm" style={{ color: 'var(--text)' }}>TixM8</div>
          <div className="text-[9px] uppercase tracking-widest" style={{ color: 'var(--text-3)' }}>
            Admin Panel
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto py-2">
        {navSections.map((section) => (
          <div key={section.label} className="px-2 mb-1">

            {/* Section label */}
            <div
              className="overflow-hidden transition-all duration-300"
              style={{ height: isCollapsed ? 0 : 22, opacity: isCollapsed ? 0 : 1 }}
            >
              <p className="text-[9px] font-bold uppercase tracking-widest px-2 mb-1"
                style={{ color: 'var(--text-3)' }}>
                {section.label}
              </p>
            </div>

            {/* Nav items */}
            {section.items.map((item) => (
              <div
                key={item.to}
                className="relative"
                // 📝 LEARN: getBoundingClientRect() gets the element's position on screen
                // We use it to position the fixed tooltip at the right vertical spot
                onMouseEnter={e => {
                  if (isCollapsed) {
                    const rect = e.currentTarget.getBoundingClientRect()
                    setTooltip({
                      text: item.text,
                      y: rect.top + rect.height / 2,
                    })
                  }
                }}
                onMouseLeave={() => setTooltip(null)}
              >
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center rounded-md text-xs font-medium cursor-pointer transition-all duration-150
                     ${isActive ? 'active-nav' : ''}`
                  }
                  style={({ isActive }) => ({
                    padding: '8px 10px',
                    justifyContent: 'flex-start',
                    gap: 8,
                    color: isActive ? 'var(--accent)' : 'var(--text-4)',
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
                  <item.icon size={18} strokeWidth={1.8} className="shrink-0" />

                  <span
                    className="whitespace-nowrap overflow-hidden transition-all duration-300"
                    style={{ maxWidth: isCollapsed ? 0 : 200, opacity: isCollapsed ? 0 : 1 }}
                  >
                    {item.text}
                  </span>

                  {item.badge && !isCollapsed && (
                    <span
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-auto shrink-0"
                      style={{
                        background: item.badgeColor === 'blue' ? 'var(--blue)'
                          : item.badgeColor === 'yellow' ? 'var(--yellow)' : 'var(--red)',
                        color: item.badgeColor === 'yellow' ? '#000' : '#fff',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              </div>
            ))}
          </div>
        ))}
      </nav>

      {/* ── Tooltip ── */}
      {/* 📝 LEARN: position fixed = relative to the SCREEN not any parent
          This escapes ALL overflow clipping — nothing can hide it */}
      {tooltip && (
        <div
          role="tooltip"
          className="fixed z-[999] px-3 py-2 rounded-lg text-xs font-medium
                     pointer-events-none whitespace-nowrap
                     transition-opacity duration-200 opacity-100"
          style={{
            left: '64px',          // sidebar width + gap
            top: tooltip.y,        // vertical center of hovered item
            transform: 'translateY(-50%)',
            background: 'var(--surface3)',
            color: 'var(--text)',
            border: '1px solid var(--border2)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          {tooltip.text}
          {/* Arrow pointing left */}
          <div
            className="absolute right-full top-1/2 -translate-y-1/2"
            style={{
              width: 0, height: 0,
              borderTop: '4px solid transparent',
              borderBottom: '4px solid transparent',
              borderRight: `4px solid var(--surface3)`,
            }}
          />
        </div>
      )}

    </aside>
  )
}

export default Sidebar