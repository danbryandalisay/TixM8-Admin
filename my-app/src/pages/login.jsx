import { useState } from 'react'
import { Eye, EyeOff, Ticket, ArrowRight, ShieldCheck, Sun, Moon } from 'lucide-react'
import '../styles/login-animations.css'

// ─────────────────────────────────────────────────────────────
// 📌 API CONFIGURATION
//    Change these values to match your TixM8 app settings.
//    The base URL is the same one from General.cs (BaseAddress).
// ─────────────────────────────────────────────────────────────
const API_BASE      = 'http://appcore.vdimdci.com.ph/api'  // no trailing slash
const APP_ID        = 'POWERPAD'   // ← your application_id (was "POWERPAD" in PowerPad)
const APP_DOMAIN    = 'MDCI'         // ← application_domain (the company code)
// admin:naqbex-7hipma-datPab

// ─────────────────────────────────────────────────────────────
// 📚 WHAT IS AN async FUNCTION?
//
//   Normal function:  returns a value immediately
//   async function:   returns a Promise — a "promise" that the
//                     value will arrive later (from a server, etc.)
//
//   await:            pauses ONLY inside the async function until
//                     the Promise resolves, then continues.
//                     The rest of your app keeps running normally.
//
//   try / catch:      like a safety net — if fetch() fails
//                     (no internet, server down, bad status),
//                     execution jumps to catch(err) so you can
//                     show a friendly error instead of crashing.
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// STEP 1 & 2 — Auth POST  (mirrors General.AuthenticateUser)
//
//   In C#:
//     var response = await client.PostAsync("auth/", content);
//     var result   = JsonConvert.DeserializeObject<ResultData>(responseData);
//
//   In React (fetch API):
//     const response = await fetch(url, { method, headers, body })
//     const result   = await response.json()   ← same as DeserializeObject
// ─────────────────────────────────────────────────────────────
async function postAuth(payload) {
  // fetch() is the browser's built-in HTTP client (like HttpClient in C#)
  const response = await fetch(`${API_BASE}/auth/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',  // tell server we're sending JSON
      'Accept':       'application/json',  // tell server we expect JSON back
    },
    // JSON.stringify() = JsonConvert.SerializeObject() in C#
    body: JSON.stringify(payload),
  })

  // response.ok is true for HTTP 200–299 (like EnsureSuccessStatusCode)
  if (!response.ok) {
    throw new Error(`Server error ${response.status}: ${response.statusText}`)
  }

  // response.json() = JsonConvert.DeserializeObject<ResultData>()
  // It's also async because reading the response body takes a moment
  return response.json()
}

// ─────────────────────────────────────────────────────────────
// STEP 3 — Permission check  (mirrors General.HasAccess)
//
//   In C#:
//     request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", sessionId)
//     var response = await client.SendAsync(request)
//
//   In React:
//     headers: { Authorization: `Bearer ${sessionId}` }
// ─────────────────────────────────────────────────────────────
async function hasAccess(moduleId, sessionId) {
  const response = await fetch(`${API_BASE}/usrperm/modperm/?modid=${moduleId}`, {
    method: 'GET',
    headers: {
      // Template literal = string interpolation  (`Bearer ${value}`)
      // Same as $"Bearer {sessionId}" in C#
      'Authorization': `Bearer ${sessionId}`,
      'Accept':        'application/json',
    },
  })

  if (!response.ok) return false

  const result = await response.json()

  // result.data is a string[] — check if any item equals "Access"
  // Array.isArray guards against null/undefined
  // .some() = foreach with early return true  (like your C# break)
  return Array.isArray(result.data) &&
    result.data.some(item => item.toLowerCase() === 'access')
}

// ─────────────────────────────────────────────────────────────
// 📌 PROPS received from App.jsx:
//
//   onLogin       — call this when login succeeds
//   isDark        — the current theme state (owned by App.jsx)
//   onToggleTheme — call this to flip the theme (updates App.jsx state)
//
// 📚 WHY PROPS INSTEAD OF LOCAL STATE?
//
//   Before: Login had its own isDark state → completely separate
//   from App.jsx's isDark → they got out of sync after login.
//
//   Now: App.jsx is the SINGLE SOURCE OF TRUTH for isDark.
//   Login just reads it (via prop) and triggers changes (via prop).
//   This is called "lifting state up" — a core React pattern.
//
//   Rule of thumb: if two components need the same piece of data,
//   put the state in their closest common parent (App.jsx here)
//   and pass it down as props.
// ─────────────────────────────────────────────────────────────
function Login({ onLogin, isDark, onToggleTheme }) {

  // 📌 Multiple useState — each piece of data gets its own state
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  // ✅ No isDark state here anymore — App.jsx owns it.
  // ✅ No useEffect for theme here anymore — App.jsx handles it.
  // ✅ toggleDark is now just onToggleTheme from props.

  // ───────────────────────────────────────────────────────────
  // handleSubmit is now async because we use await inside it.
  //
  // Before (fake):   handleSubmit = (e) => { ... setTimeout ... }
  // After  (real):   handleSubmit = async (e) => { ... await fetch ... }
  //
  // The form calls this the same way — React doesn't care that it's async.
  // ───────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!username || !password) {
      setError('Please enter both username and password.')
      return
    }

    setLoading(true)

    try {

      // ── STEP 1: First auth call ───────────────────────────
      // Matches this block in Login.aspx.cs:
      //   var userAuth = new UserAuthentication {
      //     username = USERNAME, password = PASSWORD,
      //     application_id = applicationID, device_id = string.Empty
      //   }
      //   var result = await General.AuthenticateUser(content)
      // ──────────────────────────────────────────────────────
      const step1 = await postAuth({
        username,
        password,
        application_id: APP_ID,
        device_id:      '',        // empty on first call, same as C#
      })

      // Check status — same as:  if (result.status == "VALID")
      if (step1.status !== 'VALID') {
        // step1.messages is a string[] — join them with a line break
        setError(
          Array.isArray(step1.messages)
            ? step1.messages.join(' ')
            : 'Invalid username or password.'
        )
        setLoading(false)
        return
      }

      // ── STEP 2: Second auth call with domain + audience ───
      // Matches this block in Login.aspx.cs:
      //   userAuth.application_domain = company    // "MDCI"
      //   userAuth.device_id          = Guid.NewGuid().ToString()
      //   userAuth.audience           = applicationID
      //   result = await General.AuthenticateUser(content)
      // ──────────────────────────────────────────────────────
      const step2 = await postAuth({
        username,
        password,
        application_id:     APP_ID,
        device_id:          crypto.randomUUID(),  // = Guid.NewGuid().ToString() in C#
        application_domain: APP_DOMAIN,
        audience:           APP_ID,
      })

      if (step2.status !== 'VALID') {
        setError(
          Array.isArray(step2.messages)
            ? step2.messages.join(' ')
            : 'Could not establish a session. Please try again.'
        )
        setLoading(false)
        return
      }

      // step2.data = the session token (same as result.data in C#)
      const sessionId = step2.data

      // ── STEP 3: Permission checks ─────────────────────────
      // Matches:
      //   bool hasAccessMain         = await General.HasAccess("Main", session_id, "Access")
      //   bool hasAccessApplications = await General.HasAccess("Application", ...)
      //   bool hasAccessContentMgr   = await General.HasAccess("ContentManager", ...)
      // ──────────────────────────────────────────────────────
      const canMain = await hasAccess('Main', sessionId)

      // Only check sub-modules if Main access is granted (same logic as C#)
      const canApplication    = canMain ? await hasAccess('Application',    sessionId) : false
      const canContentManager = canMain ? await hasAccess('ContentManager', sessionId) : false

      // ── Save to localStorage (same as Session[] in ASP.NET) ──
      // localStorage persists after refresh; use sessionStorage if
      // you want it cleared when the browser tab closes.
      const user = {
        username,
        sessionId,
        canApplication,
        canContentManager,
      }
      localStorage.setItem('tixm8_user', JSON.stringify(user))

      // Tell App.jsx we're logged in — same as before
      onLogin(user)

    } catch (err) {
      // ── Network / CORS error ────────────────────────────────
      // err.message === 'Failed to fetch' usually means:
      //   • The server is unreachable, OR
      //   • CORS is blocking the request (see vite.config.js note below)
      //
      // 💡 FIX FOR CORS:
      //   In vite.config.js, add a proxy so the browser thinks
      //   it's calling your own server:
      //
      //   server: {
      //     proxy: {
      //       '/api': {
      //         target:      'http://appcore.vdimdci.com.ph',
      //         changeOrigin: true,
      //         rewrite:     (path) => path.replace(/^\/api/, '/api'),
      //       }
      //     }
      //   }
      //
      //   Then change API_BASE above to just '/api'
      // ───────────────────────────────────────────────────────
      const isCors = err.message === 'Failed to fetch' || err.message.includes('NetworkError')
      setError(
        isCors
          ? 'Cannot reach the server. Check your network or set up the Vite proxy (see code comments).'
          : `Error: ${err.message}`
      )
    } finally {
      // finally runs whether try succeeded or catch fired — always stop loading
      setLoading(false)
    }
  }

  // ─────────────────────────────────────────────────────────────
  // The JSX below is UNCHANGED from your original — only the
  // handleSubmit logic above was replaced.
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: 'var(--bg)' }}>

      {/* ══ LEFT SIDE — Branding ══ */}

      {/* 📌 LOOPING ANIMATIONS
           These @keyframes are injected as a <style> tag so we don't have to
           touch login-animations.css. They define the looping motion on the
           decorative shapes — each one runs forever (infinite).

           animation shorthand breakdown:
             tixm8-float-a   ← keyframe name
             8s               ← one cycle takes 8 seconds
             ease-in-out      ← slow at start and end, fast in middle
             infinite         ← loops forever (instead of stopping after 1 play)
      */}
      <style>{`
        /* ── Theme transition ───────────────────────────────────
           CSS variables change instantly by default.
           Adding transition: on the elements that USE those
           variables makes the computed color values animate
           smoothly whenever the .Dark class is added/removed.

           We exclude elements that have their own animations
           (like spinners) by not listing transform or opacity here,
           so those continue to work normally.
        ── */
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

      <div
        className="hidden lg:flex flex-col justify-between w-[52%] p-12 relative overflow-hidden"
        style={{
          // Base is always the golden gradient.
          // The dark overlay div below fades in on top of it via opacity.
          background: 'linear-gradient(135deg, #1a0d00 0%, #3d2200 45%, #6e3f00 100%)',
        }}
      >
        {/* ── Dark mode overlay ────────────────────────────────────
             CSS gradients are technically background-IMAGE, not
             background-COLOR, so the browser can't tween between
             two gradients directly.

             The trick: stack a second gradient on top and transition
             its OPACITY — opacity DOES animate, so it fades smoothly
             between the two looks without any JS animation needed.

             opacity: 0  → golden panel shows through (light mode)
             opacity: 1  → dark panel covers it fully  (dark mode)

             Note: transition is set directly here (not via the * rule)
             because we specifically want opacity to animate for this
             element only — the * rule intentionally skips opacity to
             keep the other animations running at full speed.
        ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #111114 0%, #1c1c20 45%, #292935 100%)',
            opacity: isDark ? 1 : 0,
            transition: 'opacity 0.35s ease',
            zIndex: 0,
          }}
        />

        {/* ── Decorative circles — looping float animations + CSS var colors ── */}

        {/* Top-right blob: floats UP then DOWN every 8 s */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
            opacity: 0.22,
            animation: 'tixm8-float-a 8s ease-in-out infinite',
            zIndex: 1,
          }}
        />

        {/* Bottom-left blob: floats DOWN then UP every 10 s (opposite phase) */}
        <div
          className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full"
          style={{
            background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
            opacity: 0.18,
            animation: 'tixm8-float-b 10s ease-in-out infinite',
            zIndex: 1,
          }}
        />

        {/* Center glow: slowly pulses (grows + brightens) every 12 s */}
        <div
          className="absolute top-1/2 left-1/2 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
            animation: 'tixm8-pulse-gold 12s ease-in-out infinite',
            zIndex: 1,
          }}
        />

        {/* Spinning outer ring — clockwise, 22 s per rotation */}
        <div
          className="absolute top-1/2 left-1/2 w-[420px] h-[420px] rounded-full"
          style={{
            border: '1px solid var(--accent-glow)',
            marginLeft: -210, marginTop: -210,
            animation: 'tixm8-spin-cw 22s linear infinite',
            zIndex: 1,
          }}
        />

        {/* Spinning inner ring — counter-clockwise, 15 s per rotation */}
        <div
          className="absolute top-1/2 left-1/2 w-[280px] h-[280px] rounded-full"
          style={{
            border: '1px solid var(--accent-dim)',
            marginLeft: -140, marginTop: -140,
            animation: 'tixm8-spin-ccw 15s linear infinite',
            zIndex: 1,
          }}
        />

        {/* Shimmer sweep — a bright streak that crosses the panel every 5 s */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ overflow: 'hidden', zIndex: 1 }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0, bottom: 0,
              width: '40%',
              background: 'linear-gradient(90deg, transparent, var(--accent-dim), transparent)',
              animation: 'tixm8-shimmer 5s ease-in-out infinite',
            }}
          />
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

        {/* ── Dark mode toggle button ────────────────────────────
             Positioned absolute so it sits in the top-right corner
             of the form panel without affecting the form layout.

             aria-label = text screen readers announce when focused
             (good accessibility habit)
        ── */}
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="absolute top-5 right-5 p-2 rounded-lg transition-all duration-200"
          style={{
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            color: 'var(--text-3)',
            cursor: 'pointer',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          {/* isDark and the toggle both come from App.jsx via props now */}
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