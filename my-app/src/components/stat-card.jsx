// StatCard.jsx — A reusable card that shows one stat (tickets, revenue, etc.)
//
// PROPS = data you pass IN to a component (like parameters in a function)
// Instead of making 4 separate cards, we make 1 and pass different data each time.
//
// Example of how it's used:
// <StatCard title="Total Revenue" value="₱1,243,000" icon="💰" color="#16a34a" />
function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div
      className="rounded-xl p-5 flex items-center gap-4"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        // borderLeft: `3px solid ${color}`,
      }}
    >
      <div
        className="flex items-center justify-center rounded-lg shrink-0"
        style={{ width: 40, height: 40, background: `${color}20`, color: color }}
      >
        {/* Render as component, not as value */}
        <Icon size={20} strokeWidth={1.8} />
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-3)' }}>
          {title}
        </p>
        <p className="text-xl font-bold" style={{ color: 'var(--text)' }}>
          {value}
        </p>
      </div>
    </div>
  )
}

export default StatCard