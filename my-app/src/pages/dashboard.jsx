import { Ticket, PhilippinePeso, CalendarDays, Users,ShoppingCartPlus } from 'lucide-react'
import StatCard from '../components/stat-card'

// Icon is now a Lucide component, just like in sidebar.jsx
// color uses your CSS variables instead of hardcoded hex

const stats = [
  { title: 'Total Tickets Sold', value: '12,430',      icon: Ticket,       color: 'var(--purple)' },
  { title: 'Total Revenue',      value: '₱ 1,243,000', icon: PhilippinePeso,   color: 'var(--green)'  },
  { title: 'Upcoming Events',    value: '18',           icon: CalendarDays, color: 'var(--accent)' },
  { title: 'Total Users',        value: '3,210',        icon: Users,        color: 'var(--blue)'   },
]

const recentOrders = [
  { id: '#0001', customer: 'Juan Dela Cruz', event: 'Avengers Finale',   type: 'Movie',   amount: '₱ 450',   status: 'Completed' },
  { id: '#0002', customer: 'Maria Santos',   event: 'PBA Finals G5',     type: 'Sports',  amount: '₱ 1,200', status: 'Completed' },
  { id: '#0003', customer: 'Pedro Reyes',    event: 'Ben & Ben Concert', type: 'Concert', amount: '₱ 2,500', status: 'Pending'   },
  { id: '#0004', customer: 'Ana Gonzales',   event: 'Avengers Finale',   type: 'Movie',   amount: '₱ 450',   status: 'Completed' },
  { id: '#0005', customer: 'Carlo Mendoza',  event: 'UAAP Finals',       type: 'Sports',  amount: '₱ 800',   status: 'Cancelled' },
]

// Small helper to get badge styles per status
// Instead of writing if/else every time, we use an object lookup
const statusStyles = {
  Completed: { background: 'var(--green-dim)',  color: 'var(--green)'  },
  Pending:   { background: 'var(--yellow-dim)', color: 'var(--yellow)' },
  Cancelled: { background: 'var(--red-dim)',    color: 'var(--red)'    },
}

function Dashboard() {
  return (
    <div className="max-w-full">

      {/* ── Page Header ── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
          Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-2)' }}>
          Welcome back, Admin!
        </p>
      </div>

      {/* ── Stat Cards ── */}
      {/* grid-cols-4 = 4 columns, gap-4 = spacing between cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* ── Recent Orders Table ── */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        {/* Table header */}
        <div
          className="px-5 py-4"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <h2 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>
            Recent Orders
          </h2>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--surface2)' }}>
                {['Order ID', 'Customer', 'Event', 'Type', 'Amount', 'Status'].map(col => (
                  <th
                    key={col}
                    className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider"
                    style={{ color: 'var(--text-2)', borderBottom: '1px solid var(--border)' }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="transition-colors"
                  style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--text-2)' }}>
                    {order.id}
                  </td>
                  <td className="px-4 py-3 text-xs font-medium" style={{ color: 'var(--text)' }}>
                    {order.customer}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--text)' }}>
                    {order.event}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-2)' }}>
                    {order.type}
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text)' }}>
                    {order.amount}
                  </td>
                  <td className="px-4 py-3">
                    {/* statusStyles[order.status] looks up the style object
                        using the status string as a key — cleaner than if/else */}
                    <ShoppingCartPlus size={16} style={{ color: statusStyles[order.status].color }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

export default Dashboard