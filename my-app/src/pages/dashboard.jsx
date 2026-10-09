// Dashboard.jsx — The main dashboard page.
// This is what shows when you go to "/"

import StatCard from '../components/stat-card'
import '../styles/dashboard.css'

// ── DUMMY DATA ──
// This is fake/static data for now.
// In the future you'll fetch this from a real database using useEffect() + API.
// But for learning React, static data is the right place to start!

const stats = [
  { title: 'Total Tickets Sold', value: '12,430',      icon: '🎟️', color: '#4f46e5' },
  { title: 'Total Revenue',      value: '₱ 1,243,000', icon: '💰', color: '#16a34a' },
  { title: 'Upcoming Events',    value: '18',           icon: '📅', color: '#ea580c' },
  { title: 'Total Users',        value: '3,210',        icon: '👥', color: '#0284c7' },
]

const recentOrders = [
  { id: '#0001', customer: 'Juan Dela Cruz', event: 'Avengers Finale',   type: 'Movie',   amount: '₱ 450',   status: 'Completed' },
  { id: '#0002', customer: 'Maria Santos',   event: 'PBA Finals G5',     type: 'Sports',  amount: '₱ 1,200', status: 'Completed' },
  { id: '#0003', customer: 'Pedro Reyes',    event: 'Ben & Ben Concert', type: 'Concert', amount: '₱ 2,500', status: 'Pending'   },
  { id: '#0004', customer: 'Ana Gonzales',   event: 'Avengers Finale',   type: 'Movie',   amount: '₱ 450',   status: 'Completed' },
  { id: '#0005', customer: 'Carlo Mendoza',  event: 'UAAP Finals',       type: 'Sports',  amount: '₱ 800',   status: 'Cancelled' },
]

function Dashboard() {
  return (
    <div className="dashboard">

      {/* Page title */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back, Admin!</p>
      </div>
      <div className="bg-blue-500 text-white p-10 text-2xl font-bold">
        Tailwind is working!
      </div>

      {/* ── Stat Cards ──
          .map() = loops over an array and renders JSX for each item.
          Like a forEach but it RETURNS something.
          "key" = required by React so it can track each item. */}
      <div className="stat-grid">
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
      <div className="table-section">
        <h2>Recent Orders</h2>
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Event</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {/* .map() again — renders one <tr> per order */}
            {recentOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.event}</td>
                <td>{order.type}</td>
                <td>{order.amount}</td>
                <td>
                  {/* Dynamic className — changes badge color based on status */}
                  <span className={`badge badge-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default Dashboard