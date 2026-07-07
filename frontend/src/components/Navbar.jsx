import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="site-nav flex-wrap md:flex-nowrap relative">
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

      <nav className={`nav-links flex-col md:flex-row w-full md:w-auto mt-4 md:mt-0 ${isOpen ? 'flex' : 'hidden'} md:flex`}>
        <Link to="/" className="nav-link w-full md:w-auto text-center">Home</Link>
        <Link to="/compare" className="nav-link w-full md:w-auto text-center">Compare</Link>
        {user && <Link to="/dashboard" className="nav-link w-full md:w-auto text-center">Dashboard</Link>}
        <a href="/#current-weather" className="nav-link w-full md:w-auto text-center">Current</a>
        <a href="/#celestial" className="nav-link w-full md:w-auto text-center">Sun & Moon</a>
        <a href="/#forecast" className="nav-link w-full md:w-auto text-center">Forecast</a>
      </nav>

      <div className={`nav-actions flex-col md:flex-row w-full md:w-auto mt-4 md:mt-0 ${isOpen ? 'flex' : 'hidden'} md:flex`}>
        {user ? (
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
             <span className="hidden lg:inline text-sm text-gray-200">Welcome! <strong>{user.username}</strong></span>
            <button type="button" className="nav-button w-full md:w-auto" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <Link to="/login" className="nav-link-secondary w-full md:w-auto text-center">
              Login
            </Link>
            <Link to="/register" className="nav-button w-full md:w-auto text-center">
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
