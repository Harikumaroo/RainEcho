import { FiDroplet, FiWind, FiThermometer } from 'react-icons/fi'
import { motion } from 'framer-motion'

function ComparisonMetric({ label, value1, value2, city1, city2 }) {
  return (
    <div className="comparison-metric">
      <p className="metric-label">{label}</p>
      <div className="metric-values">
        <div className="metric-value">
          <span className="city-name">{city1}</span>
          <span className="value">{value1}</span>
        </div>
        <div className="metric-value">
          <span className="city-name">{city2}</span>
          <span className="value">{value2}</span>
        </div>
      </div>
    </div>
  )
}

export default function ComparisonCard({ weather1, weather2, city1, city2 }) {
  const tempDiff = Math.abs(Math.round(weather1.temperature) - Math.round(weather2.temperature))
  const humidityDiff = Math.abs(weather1.humidity - weather2.humidity)
  const windDiff = Math.abs(weather1.wind_speed - weather2.wind_speed)

  return (
    <motion.section
      className="comparison-card rounded-[32px] border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 shadow-lg backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut', delay: 0.16 }}
    >
      <div className="comparison-header">
        <h3 className="text-2xl font-semibold text-gray-900">Weather Comparison</h3>
        <p className="text-sm text-gray-600 mt-1">Compare conditions between two locations</p>
      </div>

      <div className="comparison-grid mt-6">
        <div className="location-card">
          <div className="location-header">
            <img src={weather1.icon} alt={weather1.description} className="weather-icon" />
            <div>
              <h4 className="font-semibold text-gray-900">{city1}</h4>
              <p className="text-sm text-gray-600">{weather1.description}</p>
            </div>
          </div>
          <p className="temperature mt-4">{Math.round(weather1.temperature)}°C</p>
        </div>

        <div className="vs-divider">VS</div>

        <div className="location-card">
          <div className="location-header">
            <img src={weather2.icon} alt={weather2.description} className="weather-icon" />
            <div>
              <h4 className="font-semibold text-gray-900">{city2}</h4>
              <p className="text-sm text-gray-600">{weather2.description}</p>
            </div>
          </div>
          <p className="temperature mt-4">{Math.round(weather2.temperature)}°C</p>
        </div>
      </div>

      <div className="comparison-metrics mt-8 space-y-4">
        <ComparisonMetric
          label={`🌡️ Temperature (Diff: ${tempDiff}°C)`}
          value1={`${Math.round(weather1.temperature)}°C`}
          value2={`${Math.round(weather2.temperature)}°C`}
          city1={city1}
          city2={city2}
        />
        <ComparisonMetric
          label={`💧 Humidity (Diff: ${humidityDiff}%)`}
          value1={`${weather1.humidity}%`}
          value2={`${weather2.humidity}%`}
          city1={city1}
          city2={city2}
        />
        <ComparisonMetric
          label={`💨 Wind Speed (Diff: ${windDiff.toFixed(1)} m/s)`}
          value1={`${weather1.wind_speed} m/s`}
          value2={`${weather2.wind_speed} m/s`}
          city1={city1}
          city2={city2}
        />
        <ComparisonMetric
          label="🌅 Sunrise"
          value1={weather1.sunrise}
          value2={weather2.sunrise}
          city1={city1}
          city2={city2}
        />
        <ComparisonMetric
          label="🌇 Sunset"
          value1={weather1.sunset}
          value2={weather2.sunset}
          city1={city1}
          city2={city2}
        />
      </div>
    </motion.section>
  )
}
