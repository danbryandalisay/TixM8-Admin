import { useState } from 'react'
import { Eye, EyeOff, Ticket, ArrowRight, ShieldCheck, Sun, Moon } from 'lucide-react'
import '../styles/login-animations.css'

// ─────────────────────────────────────────────────────────────
// 📌 API CONFIGURATION
//    Points to the TixMate Go API running on localhost.
//    Change this to your production URL when deploying.
// ─────────────────────────────────────────────────────────────
const API_BASE = 'http://localhost:8080/api'

// ─────────────────────────────────────────────────────────────
// Login call — POST /api/auth/login
// Returns: { data: { token, username }, messages: [], ... }
// ─────────────────────────────────────────────────────────────
async function postLogin(username, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept':       'application/json',
    },
    body: JSON.stringify({ username, password }),
  })

  if (!response.ok) {
    throw new Error(`Server error ${response.status}: ${response.statusText}`)
  }

  return response.json()
}

// ─────────────────────────────────────────────────────────────
// 📌 PROPS received from App.jsx:
//   onLogin       — call this when login succeeds
//   isDark        — current theme (owned by App.jsx)
//   onToggleTheme — flip the theme
// ─────────────────────────────────────────────────────────────
function Login({ onLogin, isDark, onToggleTheme }) {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!username || !password) {
      setError('Please enter both username and password.')
      return
    }

    setLoading(true)

    // ── DEV BYPASS ───────────────────────────────────────────
    // Skips the real API so you can test the UI without a server.
    // ⚠️  Remove this block before going to production.
    if (username === 'admin' && password === 'admin123') {
      const user = {
        username: 'admin',
        token: 'dev-token',
        loginTime: Date.now(),
      }
      localStorage.setItem('tixm8_user', JSON.stringify(user))
      onLogin(user)
      return
    }
    // ── END DEV BYPASS ───────────────────────────────────────

    try {
      // Call Go API — POST /api/auth/login
      const result = await postLogin(username, password)

      // Check if API returned an error message
      if (result.messages && result.messages.length > 0) {
        setError(result.messages.join(' '))
        setLoading(false)
        return
      }

      // result.data = { token, username }
      const { token, username: loggedInUser } = result.data

      const user = {
        username: loggedInUser,
        token,
        loginTime: Date.now(),
      }
      localStorage.setItem('tixm8_user', JSON.stringify(user))

      onLogin(user)

    } catch (err) {
      const isCors = err.message === 'Failed to fetch' || err.message.includes('NetworkError')
      setError(
        isCors
          ? 'Cannot reach the server. Make sure the Go API is running (go run . in the api folder).'
          : `Error: ${err.message}`
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: 'var(--bg)' }}>

      <style>{`
        *, *::before, *::after {
          transition:
            background-color 0.35s ease,
            color             0.35s ease,
            border-color      0.35s ease,
            box-shadow        0.35s ease;
        }

        @keyframes tixm8-float-a {
          0%, 100% { transform: translateY(0px)   scale(1);    }
          50%       { transform: translateY(-30px) scale(1.06); }
        }
        @keyframes tixm8-float-b {
          0%, 100% { transform: translateY(0px)  scale(1);    }
          50%       { transform: translateY(26px) scale(0.95); }
        }
        @keyframes tixm8-pulse-gold {
          0%, 100% { opacity: 0.07; transform: translate(-50%, -50%) scale(1);    }
          50%       { opacity: 0.14; transform: translate(-50%, -50%) scale(1.10); }
        }
        @keyframes tixm8-spin-cw {
          from { transform: rotate(0deg);   }
          to   { transform: rotate(360deg); }
        }
        @keyframes tixm8-spin-ccw {
          from { transform: rotate(0deg);    }
          to   { transform: rotate(-360deg); }
        }
        @keyframes tixm8-shimmer {
          0%        { opacity: 0;   transform: translateX(-120%) skewX(-20deg); }
          40%, 60%  { opacity: 0.6;                                              }
          100%      { opacity: 0;   transform: translateX(220%)  skewX(-20deg); }
        }
      `}</style>

      {/* ══ LEFT SIDE — Branding ══ */}
      <div
        className="hidden lg:flex flex-col justify-between w-[52%] p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a0d00 0%, #3d2200 45%, #6e3f00 100%)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #111114 0%, #1c1c20 45%, #292935 100%)',
            opacity: isDark ? 1 : 0,
            transition: 'opacity 0.35s ease',
            zIndex: 0,
          }}
        />

        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)', opacity: 0.22, animation: 'tixm8-float-a 8s ease-in-out infinite', zIndex: 1 }} />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)', opacity: 0.18, animation: 'tixm8-float-b 10s ease-in-out infinite', zIndex: 1 }} />
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)', animation: 'tixm8-pulse-gold 12s ease-in-out infinite', zIndex: 1 }} />
        <div className="absolute top-1/2 left-1/2 w-[420px] h-[420px] rounded-full"
          style={{ border: '1px solid var(--accent-glow)', marginLeft: -210, marginTop: -210, animation: 'tixm8-spin-cw 22s linear infinite', zIndex: 1 }} />
        <div className="absolute top-1/2 left-1/2 w-[280px] h-[280px] rounded-full"
          style={{ border: '1px solid var(--accent-dim)', marginLeft: -140, marginTop: -140, animation: 'tixm8-spin-ccw 15s linear infinite', zIndex: 1 }} />
        <div className="absolute inset-0 pointer-events-none" style={{ overflow: 'hidden', zIndex: 1 }}>
          <div style={{ position: 'absolute', top: 0, bottom: 0, width: '40%', background: 'linear-gradient(90deg, transparent, var(--accent-dim), transparent)', animation: 'tixm8-shimmer 5s ease-in-out infinite' }} />
        </div>

        <div className="relative z-10 login-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-xl" style={{ width: 42, height: 42, background: 'var(--accent)' }}>
              <Ticket size={22} color="#000" strokeWidth={2} />
            </div>
            <div>
              <div className="font-bold text-xl text-white">TixM8</div>
              <div className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>Admin Console</div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="login-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold mb-6"
              style={{ background: 'rgba(245,166,35,0.15)', color: 'var(--accent)', border: '1px solid rgba(245,166,35,0.3)' }}>
              <ShieldCheck size={12} />
              Super Admin Access
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4 login-slide-up" style={{ animationDelay: '0.3s' }}>
            Manage your<br />
            <span style={{ color: 'var(--accent)' }}>ticketing platform</span><br />
            with confidence.
          </h1>
          <p className="text-sm leading-relaxed login-slide-up" style={{ color: 'rgba(255,255,255,0.5)', animationDelay: '0.4s' }}>
            Full visibility across all operators, events,<br />
            transactions and system health — in one place.
          </p>
          <div className="flex gap-8 mt-10 login-slide-up" style={{ animationDelay: '0.5s' }}>
            {[
              { value: '128',    label: 'Operators'    },
              { value: '218K',   label: 'Tickets Sold' },
              { value: '99.97%', label: 'Uptime'       },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-[11px] login-slide-up" style={{ color: 'rgba(255,255,255,0.3)', animationDelay: '0.6s' }}>
          © 2026 TixM8 Platform. All rights reserved.
        </div>
      </div>

      {/* ══ RIGHT SIDE — Login Form ══ */}
      <div className="flex flex-col items-center justify-center flex-1 px-8 login-fade-in relative" style={{ background: 'var(--bg)', animationDelay: '0.2s' }}>

        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="absolute top-5 right-5 p-2 rounded-lg transition-all duration-200"
          style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text-3)', cursor: 'pointer' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className="w-full max-w-sm">

          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="flex items-center justify-center rounded-xl" style={{ width: 36, height: 36, background: 'var(--accent)' }}>
              <Ticket size={18} color="#000" />
            </div>
            <span className="font-bold text-lg" style={{ color: 'var(--text)' }}>TixM8</span>
          </div>

          <div className="mb-8 login-slide-up" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>Welcome back</h2>
            <p className="text-sm" style={{ color: 'var(--text-2)' }}>Sign in to your admin account</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div className="login-slide-up" style={{ animationDelay: '0.4s' }}>
              <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-2)' }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <div className="login-slide-up" style={{ animationDelay: '0.5s' }}>
              <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-2)' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none transition-all duration-200"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
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

            {error && (
              <div
                className="px-4 py-3 rounded-xl text-xs font-medium login-shake"
                style={{ background: 'var(--red-dim)', color: 'var(--red)', border: '1px solid rgba(214,63,63,0.2)' }}
              >
                {error}
              </div>
            )}

            {/* ── Dev hint — remove before production ── */}
            <div
              className="text-center text-[11px] px-3 py-2 rounded-lg login-slide-up"
              style={{ background: 'var(--surface)', color: 'var(--text-3)', border: '1px dashed var(--border)', animationDelay: '0.55s' }}
            >
              Dev login: <strong style={{ color: 'var(--accent)' }}>admin</strong> / <strong style={{ color: 'var(--accent)' }}>admin123</strong>
            </div>

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
        </div>
      </div>

    </div>
  )
}

export default Login