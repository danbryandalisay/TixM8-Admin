import { useState } from 'react'
import { Eye, EyeOff, Ticket, ArrowRight, ShieldCheck } from 'lucide-react'
import '../styles/login-animations.css'

// 📝 LEARN: Hardcoded credentials for now
// Later you'll replace this with a real API call
const VALID_USERS = [
  { username: 'admin',   password: 'admin123', role: 'Super Admin'    },
  { username: 'finance', password: 'fin123',   role: 'Finance Admin'  },
]

// 📝 LEARN: onLogin is a PROP — a function passed from App.jsx
// When login succeeds, we call it so App.jsx knows the user is logged in
function Login({ onLogin }) {

  // 📝 LEARN: Multiple useState — each piece of data gets its own state
  const [username,    setUsername]    = useState('')
  const [password,    setPassword]    = useState('')
  const [showPass,    setShowPass]    = useState(false)   // toggle password visibility
  const [error,       setError]       = useState('')      // error message
  const [loading,     setLoading]     = useState(false)   // loading state

  // 📝 LEARN: Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault()  // prevents page reload on form submit

    // Clear previous error
    setError('')

    // Basic validation
    if (!username || !password) {
      setError('Please enter both username and password.')
      return
    }

    // Simulate a loading state (like a real API call)
    setLoading(true)

    // 📝 LEARN: setTimeout simulates an async API call
    // Later you'll replace this with: const res = await fetch('/api/login', {...})
    setTimeout(() => {
      const user = VALID_USERS.find(
        u => u.username === username && u.password === password
      )

      if (user) {
        // 📝 LEARN: localStorage saves data that persists after page refresh
        localStorage.setItem('tixm8_user', JSON.stringify(user))
        onLogin(user)  // tell App.jsx we're logged in
      } else {
        setError('Invalid username or password.')
        setLoading(false)
      }
    }, 800)
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: 'var(--bg)' }}>

      {/* ══ LEFT SIDE — Branding ══ */}
      {/* animate-slide-left = custom animation defined below */}
      <div
        className="hidden lg:flex flex-col justify-between w-[52%] p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #2a2018 0%, #3d2e1a 40%, #5c3d1e 100%)' }}
      >
        {/* Background decorative circles */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'var(--accent)' }}
        />
        <div
          className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full opacity-10"
          style={{ background: 'var(--accent)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-5"
          style={{ background: 'var(--accent)' }}
        />

        {/* Top — Logo */}
        <div className="relative z-10 login-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{ width: 42, height: 42, background: 'var(--accent)' }}
            >
              <Ticket size={22} color="#000" strokeWidth={2} />
            </div>
            <div>
              <div className="font-bold text-xl text-white">TixM8</div>
              <div className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Admin Console
              </div>
            </div>
          </div>
        </div>

        {/* Middle — Main copy */}
        <div className="relative z-10">
          <div className="login-slide-up" style={{ animationDelay: '0.2s' }}>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold mb-6"
              style={{ background: 'rgba(245,166,35,0.15)', color: 'var(--accent)', border: '1px solid rgba(245,166,35,0.3)' }}
            >
              <ShieldCheck size={12} />
              Super Admin Access
            </div>
          </div>

          <h1
            className="text-4xl font-bold text-white leading-tight mb-4 login-slide-up"
            style={{ animationDelay: '0.3s' }}
          >
            Manage your<br />
            <span style={{ color: 'var(--accent)' }}>ticketing platform</span><br />
            with confidence.
          </h1>

          <p
            className="text-sm leading-relaxed login-slide-up"
            style={{ color: 'rgba(255,255,255,0.5)', animationDelay: '0.4s' }}
          >
            Full visibility across all operators, events,<br />
            transactions and system health — in one place.
          </p>

          {/* Stats row */}
          <div
            className="flex gap-8 mt-10 login-slide-up"
            style={{ animationDelay: '0.5s' }}
          >
            {[
              { value: '128',    label: 'Operators'    },
              { value: '218K',   label: 'Tickets Sold' },
              { value: '99.97%', label: 'Uptime'       },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom — Footer note */}
        <div
          className="relative z-10 text-[11px] login-slide-up"
          style={{ color: 'rgba(255,255,255,0.3)', animationDelay: '0.6s' }}
        >
          © 2026 TixM8 Platform. All rights reserved.
        </div>
      </div>

      {/* ══ RIGHT SIDE — Login Form ══ */}
      <div
        className="flex flex-col items-center justify-center flex-1 px-8 login-fade-in"
        style={{ background: 'var(--bg)', animationDelay: '0.2s' }}
      >
        <div className="w-full max-w-sm">

          {/* Mobile logo (shows on small screens) */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{ width: 36, height: 36, background: 'var(--accent)' }}
            >
              <Ticket size={18} color="#000" />
            </div>
            <span className="font-bold text-lg" style={{ color: 'var(--text)' }}>TixM8</span>
          </div>

          {/* Heading */}
          <div className="mb-8 login-slide-up" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>
              Welcome back
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-2)' }}>
              Sign in to your admin account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Username */}
            <div className="login-slide-up" style={{ animationDelay: '0.4s' }}>
              <label
                className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5"
                style={{ color: 'var(--text-2)' }}
              >
                Username
              </label>
              <input
                type="text"
                value={username}
                // 📝 LEARN: onChange updates state on every keystroke
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            {/* Password */}
            <div className="login-slide-up" style={{ animationDelay: '0.5s' }}>
              <label
                className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5"
                style={{ color: 'var(--text-2)' }}
              >
                Password
              </label>
              {/* 📝 LEARN: relative + absolute positions the eye icon inside the input */}
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none transition-all duration-200"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
                {/* Toggle password visibility */}
                <button
                  type="button"
                  onClick={() => setShowPass(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-3)' }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {/* 📝 LEARN: && renders only when error is truthy (not empty string) */}
            {error && (
              <div
                className="px-4 py-3 rounded-xl text-xs font-medium login-shake"
                style={{ background: 'var(--red-dim)', color: 'var(--red)', border: '1px solid rgba(214,63,63,0.2)' }}
              >
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 mt-2 login-slide-up"
              style={{
                background: loading ? 'var(--accent-dim)' : 'var(--accent)',
                color: loading ? 'var(--text-2)' : '#000',
                animationDelay: '0.6s',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                // Loading spinner
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </button>

          </form>

          {/* Sample credentials hint */}
          <div
            className="mt-8 p-4 rounded-xl text-[11px] login-slide-up"
            style={{
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
              color: 'var(--text-2)',
              animationDelay: '0.7s',
            }}
          >
            <div className="font-semibold mb-2" style={{ color: 'var(--text-3)' }}>
              SAMPLE CREDENTIALS
            </div>
            <div className="flex flex-col gap-1">
              <div>Username: <span className="font-mono font-semibold" style={{ color: 'var(--text)' }}>admin</span></div>
              <div>Password: <span className="font-mono font-semibold" style={{ color: 'var(--text)' }}>admin123</span></div>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}

export default Login