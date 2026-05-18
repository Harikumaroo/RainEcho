import { FiCloud, FiDroplet, FiWind, FiSunrise, FiSunset } from 'react-icons/fi'
import { motion } from 'framer-motion'

function Metric({ label, value }) {
  return (
    <div className="metric-card">
      <h3>{label}</h3>
      <p>{value}</p>
    </div>
  )
}

export default function WeatherCard({ weather }) {
  return (
    <motion.section
      className="weather-card rounded-[32px] border border-gray-200 bg-white/95 p-8 shadow-lg backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut', delay: 0.08 }}
    >
      <div className="weather-header">
        <div className="weather-header-top">
          <div className="weather-title">
            <h2>{weather.city}, {weather.country}</h2>
            <span>{weather.date_time}</span>
          </div>
          <div className="hero-flag">Readable weather data for every team and traveler.</div>
        </div>
        <div className="weather-main">
          <div>
            <img src={weather.icon} alt={weather.description} />
          </div>
          <div className="temperature-block">
            <p className="temperature-note">{weather.description}</p>
            <h3 className="temp">{Math.round(weather.temperature)}°C</h3>
            <span className="detail">Feels like {Math.round(weather.feels_like)}°C</span>
          </div>
        </div>
      </div>

      <div className="weather-grid">
        <Metric label="Humidity" value={`${weather.humidity}%`} />
        <Metric label="Wind" value={`${weather.wind_speed} m/s`} />
        <Metric label="Sunrise" value={<><FiSunrise /> {weather.sunrise}</>} />
        <Metric label="Sunset" value={<><FiSunset /> {weather.sunset}</>} />
        <Metric label="Low / High" value={`${Math.round(weather.temp_min)}° / ${Math.round(weather.temp_max)}°`} />
        <Metric label="Pressure" value={`${weather.pressure} hPa`} />
      </div>
    </motion.section>
  )
}
