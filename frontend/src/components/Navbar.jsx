import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header className="site-nav">
      <div className="brand">
        <Link to="/" className="brand-logo">
          RainEcho
        </Link>
        <p className="brand-tagline">Weather clarity for every journey.</p>
      </div>

      <nav className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/compare" className="nav-link">Compare</Link>
        {user && <Link to="/dashboard" className="nav-link">Dashboard</Link>}
        <a href="/#current-weather" className="nav-link">Current</a>
        <a href="/#celestial" className="nav-link">Sun & Moon</a>
        <a href="/#forecast" className="nav-link">Forecast</a>
      </nav>

      <div className="nav-actions">
        {user ? (
          <div className="flex items-center gap-4">
             <span className="hidden md:inline text-sm text-gray-200">Welcome! <strong>{user.username}</strong></span>
            <button type="button" className="nav-button" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="nav-link-secondary">
              Login
            </Link>
            <Link to="/register" className="nav-button">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
