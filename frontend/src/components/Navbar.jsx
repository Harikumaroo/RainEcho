import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="site-nav relative z-50">
      <div className="brand flex justify-between items-center w-full md:w-auto">
        <div>
          <Link to="/" className="brand-logo">
            RainEcho
          </Link>
          <p className="brand-tagline">Weather clarity for every journey.</p>
        </div>
        <button 
          className="md:hidden text-white text-2xl p-2 focus:outline-none" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Desktop Navigation */}
      <nav className="nav-links hidden md:flex">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/compare" className="nav-link">Compare</Link>
        {user && <Link to="/dashboard" className="nav-link">Dashboard</Link>}
        <a href="/#current-weather" className="nav-link">Current</a>
        <a href="/#celestial" className="nav-link">Sun & Moon</a>
        <a href="/#forecast" className="nav-link">Forecast</a>
      </nav>

      <div className="nav-actions hidden md:flex">
        {user ? (
          <div className="flex items-center gap-4">
             <span className="hidden lg:inline text-sm text-gray-200">Welcome! <strong>{user.username}</strong></span>
            <button type="button" className="nav-button" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="nav-link-secondary">
              Login
            </Link>
            <Link to="/register" className="nav-button">
              Register
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-4 p-6 rounded-3xl bg-[#1a233a]/90 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col gap-6 md:hidden">
          <nav className="flex flex-col gap-3 text-center">
            <Link to="/" className="nav-link text-lg w-full" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/compare" className="nav-link text-lg w-full" onClick={() => setIsOpen(false)}>Compare</Link>
            {user && <Link to="/dashboard" className="nav-link text-lg w-full" onClick={() => setIsOpen(false)}>Dashboard</Link>}
            <a href="/#current-weather" className="nav-link text-lg w-full" onClick={() => setIsOpen(false)}>Current</a>
            <a href="/#celestial" className="nav-link text-lg w-full" onClick={() => setIsOpen(false)}>Sun & Moon</a>
            <a href="/#forecast" className="nav-link text-lg w-full" onClick={() => setIsOpen(false)}>Forecast</a>
          </nav>

          <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
            {user ? (
              <>
                <span className="text-center text-sm text-gray-200">Welcome! <strong>{user.username}</strong></span>
                <button type="button" className="nav-button w-full" onClick={() => { logout(); setIsOpen(false); }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link-secondary w-full text-center" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="nav-button w-full text-center" onClick={() => setIsOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
