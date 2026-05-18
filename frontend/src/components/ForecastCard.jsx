import { motion } from 'framer-motion'

export default function ForecastCard({ item }) {
  const getWeatherClass = (description) => {
    if (!description) return ''
    const desc = description.toLowerCase()

    if (desc.includes('rain') || desc.includes('drizzle')) return 'weather-rainy'
    if (desc.includes('cloud') || desc.includes('overcast')) return 'weather-cloudy'
    if (desc.includes('snow')) return 'weather-snowy'
    if (desc.includes('storm') || desc.includes('thunder')) return 'weather-storm'
    if (desc.includes('fog') || desc.includes('mist') || desc.includes('haze')) return 'weather-foggy'
    if (desc.includes('night') || desc.includes('clear night')) return 'weather-night'
    if (desc.includes('clear') || desc.includes('sunny') || desc.includes('sun')) return 'weather-sunny'

    return ''
  }

  const weatherClass = getWeatherClass(item.description)

  return (
    <motion.article
      className={`forecast-card rounded-[26px] border bg-white/10 p-6 text-center shadow-lg backdrop-blur-xl text-slate-50 ${weatherClass}`}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <h4>{item.date}</h4>
      <div className="forecast-icon-wrap">
        <img className="forecast-icon" src={item.icon} alt={item.description} />
      </div>
      <p className="forecast-temp">{Math.round(item.temperature)}°C</p>
      <p className="forecast-description">{item.description}</p>
      <p className="forecast-subtext">{item.humidity}% humidity</p>
    </motion.article>
  )
}
