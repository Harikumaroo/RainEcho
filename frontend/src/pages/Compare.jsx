import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import ComparisonCard from '../components/ComparisonCard'
import Loader from '../components/Loader'
import { fetchWeather } from '../api/weatherApi'
import { getWeatherBackground } from '../utils/backgroundHelper'

export default function Compare() {
  const [city1, setCity1] = useState('')
  const [city2, setCity2] = useState('')
  const [weather1, setWeather1] = useState(null)
  const [weather2, setWeather2] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCompare = async (e) => {
    e.preventDefault()
    if (!city1.trim() || !city2.trim()) {
      setError('Please enter both city names to compare.')
      return
    }

    setLoading(true)
    setError('')
    setWeather1(null)
    setWeather2(null)

    try {
      const [res1, res2] = await Promise.all([
        fetchWeather(city1.trim()),
        fetchWeather(city2.trim())
      ])
      setWeather1(res1.data)
      setWeather2(res2.data)
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to fetch weather data for one or both cities.')
    } finally {
      setLoading(false)
    }
  }

  const backgroundImage = useMemo(
    () => getWeatherBackground(weather1?.condition || 'clear', weather1?.is_night),
    [weather1],
  )

  return (
    <div
      className="page-shell relative min-h-screen bg-cover bg-center transition-all duration-1000"
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
        >
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl">City Comparison</h1>
          <p className="mt-4 text-base leading-7 text-gray-600">
            Enter two cities below to see a side-by-side weather analysis.
          </p>

          <form onSubmit={handleCompare} className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="relative">
              <input
                type="text"
                placeholder="First City (e.g. London)"
                value={city1}
                onChange={(e) => setCity1(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Second City (e.g. Paris)"
                value={city2}
                onChange={(e) => setCity2(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-blue-500/30 transition disabled:opacity-50"
            >
              {loading ? 'Comparing...' : 'Compare Cities'}
            </button>
          </form>
        </motion.header>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-center"
            >
              {error}
            </motion.div>
          )}

          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-12"
            >
              <Loader />
            </motion.div>
          ) : weather1 && weather2 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mt-12"
            >
              <ComparisonCard
                weather1={weather1}
                weather2={weather2}
                city1={weather1.city}
                city2={weather2.city}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>
    </div>
  )
}
