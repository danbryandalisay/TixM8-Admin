function Footer() {
  // 📝 LEARN: new Date().getFullYear() automatically gets the current year
  // So you never have to manually update the copyright year
  const year = new Date().getFullYear()

  return (
    <footer
      className="shrink-0 px-6 py-3 flex items-center justify-between text-[11px]"
      style={{
        borderTop: '1px solid var(--border)',
        color: 'var(--text-3)',
      }}
    >
      {/* Left — Copyright */}
      <span>© {year} TixM8 Admin. All rights reserved.</span>

      {/* Right — Version */}
      <span
        className="px-2 py-0.5 rounded-md font-mono"
        style={{
          background: 'var(--surface2)',
          border: '1px solid var(--border)',
          color: 'var(--text-3)',
        }}
      >
        v1.0.0
      </span>
    </footer>
  )
}

export default Footer