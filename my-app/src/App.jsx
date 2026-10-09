// App.jsx — This is the ROOT of your app.
// Think of it as the "main controller" that connects all your pages.

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/sidebar'
import Header from './components/header'
import Footer from './components/footer'
import Dashboard from './pages/dashboard'
import Events from './pages/events'
import Orders from './pages/orders'
import Users from './pages/users'
import './index.css'

function App() {
  return (
    // BrowserRouter — enables page navigation without refreshing
    <BrowserRouter>

      {/* This div = sidebar on the LEFT, page content on the RIGHT */}
      <div className="app-layout">
        <Sidebar />  {/* This stays on every page */}
        <div className="page-content">
          <Header />  {/* This stays on every page */}
          <div className="main-content">
            {/* Routes = only ONE of these shows at a time depending on the URL */}
            <Routes>
              <Route path="/"       element={<Dashboard />} />
              <Route path="/events" element={<Events />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/users"  element={<Users />} />
            </Routes>
          </div>
          <Footer />  {/* This stays on every page */}
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App