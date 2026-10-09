// StatCard.jsx — A reusable card that shows one stat (tickets, revenue, etc.)
//
// PROPS = data you pass IN to a component (like parameters in a function)
// Instead of making 4 separate cards, we make 1 and pass different data each time.
//
// Example of how it's used:
// <StatCard title="Total Revenue" value="₱1,243,000" icon="💰" color="#16a34a" />

function StatCard({ title, value, icon, color }) {
  //                ↑ these are the PROPS being received

  return (
    <div className="stat-card" style={{ borderLeft: `4px solid ${color}` }}>
      {/* style={{ }} = inline CSS in JSX. Double {{ }} because:
          outer {} = JSX expression, inner {} = JavaScript object */}

      <div className="stat-icon">{icon}</div>

      <div className="stat-info">
        <p className="stat-title">{title}</p>
        <h3 className="stat-value">{value}</h3>
      </div>
    </div>
  )
}

export default StatCard