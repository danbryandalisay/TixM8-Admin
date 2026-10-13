// 📝 LEARN: useState is imported from react
import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/sidebar'
import Header from './components/header'
import Dashboard from './pages/dashboard'
import Events from './pages/events'
import Orders from './pages/orders'
import Users from './pages/users'

function App() {

  // 📝 LEARN: useState — stores isCollapsed (true = closed, false = open)
  // true means collapsed by default (sidebar starts closed)
  const [isCollapsed, setIsCollapsed] = useState(true)

  // 📝 LEARN: This function flips the value
  // prev = current value; !prev = opposite of it
  const toggleSidebar = () => setIsCollapsed(prev => !prev)

  return (
    <BrowserRouter>
      {/* Full screen layout: sidebar LEFT, content RIGHT */}
      <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>

        {/* Sidebar — we pass isCollapsed so it knows what size to be */}
        <Sidebar isCollapsed={isCollapsed} />

        {/* Right side: header on top, page content below */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          
          {/* Header — we pass toggleSidebar so the button can trigger it */}
          <Header onToggle={toggleSidebar} />

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route path="/"       element={<Dashboard />} />
              <Route path="/events" element={<Events />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/users"  element={<Users />} />
            </Routes>
          </main>

        </div>
      </div>
    </BrowserRouter>
  )
}

export default App