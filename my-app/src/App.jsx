import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/sidebar'
import Header from './components/header'
import Footer from './components/footer'
import Dashboard from './pages/dashboard'
import Events from './pages/events'
import Orders from './pages/orders'
import Users from './pages/users'
import Login from './pages/login'

function ProtectedRoute({ user, children }) {
  if (!user) return <Navigate to="/login" replace />
  return children
}

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('tixm8_user')
    return saved ? JSON.parse(saved) : null
  })

  const [isCollapsed, setIsCollapsed] = useState(true)

  // 📝 LEARN: Dark mode state — reads saved preference from localStorage
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('tixm8_theme') === 'dark'
  })

  // 📝 LEARN: useEffect — runs side effects when state changes
  // Every time isDark changes → update the class on <html> element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('Dark')
    } else {
      document.documentElement.classList.remove('Dark')
    }
    // Save preference so it persists after page refresh
    localStorage.setItem('tixm8_theme', isDark ? 'dark' : 'light')
  }, [isDark]) // ← runs every time isDark changes

  const toggleSidebar = () => setIsCollapsed(prev => !prev)
  const toggleTheme   = () => setIsDark(prev => !prev)

  const handleLogin  = (userData) => setUser(userData)
  const handleLogout = () => {
    localStorage.removeItem('tixm8_user')
    setUser(null)
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />}
        />
        <Route
          path="/*"
          element={
            <ProtectedRoute user={user}>
              <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
                <Sidebar isCollapsed={isCollapsed} />
                <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                  <Header
                    onToggle={toggleSidebar}
                    onLogout={handleLogout}
                    onToggleTheme={toggleTheme}
                    isDark={isDark}
                    user={user}
                  />
                  <main className="flex-1 overflow-y-auto p-6">
                    <Routes>
                      <Route path="/"       element={<Dashboard />} />
                      <Route path="/events" element={<Events />}    />
                      <Route path="/orders" element={<Orders />}    />
                      <Route path="/users"  element={<Users />}     />
                    </Routes>
                  </main>
                  <Footer /> 
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App