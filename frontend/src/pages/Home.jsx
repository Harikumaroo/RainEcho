import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import WeatherCard from '../components/WeatherCard'
import ForecastCard from '../components/ForecastCard'
import Navbar from '../components/Navbar'
import Loader from '../components/Loader'
import NotificationCenter from '../components/NotificationCenter'
import SunTracker from '../components/SunTracker'
import MoonTracker from '../components/MoonTracker'
import { fetchForecast, fetchWeather } from '../api/weatherApi'
import { saveSearch } from '../api/authApi'
import { getWeatherBackground } from '../utils/backgroundHelper'
import { useAuth } from '../context/AuthContext'

const defaultCity = 'Chennai'

export default function Home() {
  const { token, user, history, logout, refreshHistory } = useAuth()
  const [city, setCity] = useState(defaultCity)
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [clock, setClock] = useState(new Date())

  useEffect(() => {
    loadCity(defaultCity)
    const interval = window.setInterval(() => setClock(new Date()), 1000)
    return () => window.clearInterval(interval)
  }, [])

  const loadCity = async (searchCity) => {
    const normalizedCity = searchCity.trim()
    if (!normalizedCity) {
      setError('Please enter a city name before searching.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const [weatherResponse, forecastResponse] = await Promise.all([
        fetchWeather(normalizedCity),
        fetchForecast(normalizedCity),
      ])

      setWeather(weatherResponse.data)
      setForecast(forecastResponse.data.forecast)
      setCity(weatherResponse.data.city)
      if (token) {
        await saveSearch(weatherResponse.data.city, token)
        await refreshHistory()
      }
    } catch (err) {
      const message = err?.response?.data?.detail || 'We could not find that city. Try another search.'
      setError(message)
      setWeather(null)
      setForecast([])
    } finally {
      setLoading(false)
    }
  }

  const backgroundImage = useMemo(
    () => getWeatherBackground(weather?.condition || '', weather?.is_night),
    [weather],
  )

  return (
    <div
      className="page-shell relative min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <Navbar />

      <main className="app-shell mx-auto max-w-7xl px-4 py-10">
        <motion.header
          className="hero-panel rounded-[36px] border border-gray-200 bg-white/95 p-8 shadow-lg backdrop-blur-sm"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="hero-flag inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-800">
              Premium weather insights, built for modern teams.
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-800">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="rounded-full bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition"
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  
                </>
              )}
            </div>
          </div>

          <div className="hero-title mt-6 max-w-4xl">
            <h1 className="text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl">Global weather forecasting with cinematic clarity.</h1>
            <p className="mt-4 text-base leading-7 text-gray-600">
              Search any city to unlock live conditions, 5-day outlooks, sunrise/sunset data, and premium animated backgrounds.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="hero-flag rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-800">
              Dynamic visual journey, built on OpenWeatherMap and Django API.
            </div>
            <div className="hero-flag rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-800">
              {clock.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} • {clock.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
            </div>
          </div>
        </motion.header>

        {user && <NotificationCenter user={user} />}

        <SearchBar city={city} onCityChange={setCity} onSearch={() => loadCity(city)} loading={loading} />

        <AnimatePresence mode="wait" initial={false}>
          {loading ? (
            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Loader />
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="error-panel">
                <strong>Unable to load weather</strong>
                <p>{error}</p>
              </div>
            </motion.div>
          ) : weather ? (
            <motion.div id="current-weather" key="weather" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <WeatherCard weather={weather} />
              
              <section id="celestial" className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <SunTracker sunrise={weather.sunrise} sunset={weather.sunset} currentTime={weather.date_time} />
                <MoonTracker sunrise={weather.sunrise} sunset={weather.sunset} currentTime={weather.date_time} />
              </section>

              <section id="forecast" className="forecast-section rounded-[32px] border border-gray-200 bg-white/95 p-8 shadow-lg backdrop-blur-sm mt-8">
                <h3 className="text-2xl font-semibold text-gray-900">5-Day Outlook</h3>
                <div className="forecast-grid mt-6">
                  {forecast.map((item) => (
                    <ForecastCard key={item.date} item={item} />
                  ))}
                </div>
              </section>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {user && history.length > 0 && (
          <section className="forecast-section rounded-[32px] border border-gray-200 bg-white/95 p-8 shadow-lg backdrop-blur-sm mt-8">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-2xl font-semibold text-gray-900">Saved searches</h3>
              <button
                type="button"
                onClick={refreshHistory}
                className="rounded-full bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition"
              >
                Refresh
              </button>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {history.map((record) => (
                <div key={record.id} className="rounded-3xl border border-gray-200 bg-gray-50 p-5 text-gray-900">
                  <p className="text-sm text-gray-500">{new Date(record.created_at).toLocaleString()}</p>
                  <p className="mt-3 text-xl font-semibold">{record.city}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
