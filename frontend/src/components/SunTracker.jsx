import { useMemo, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function SunTracker({ sunrise, sunset, currentTime }) {
  const [offsetMins, setOffsetMins] = useState(0)

  // Keep current time ticking by adding minutes
  useEffect(() => {
    const timer = setInterval(() => setOffsetMins(prev => prev + 1), 60000)
    return () => clearInterval(timer)
  }, [currentTime])

  // Reset offset when city changes
  useEffect(() => {
    setOffsetMins(0)
  }, [currentTime])

  const { progress, isDay, sunriseStr, sunsetStr } = useMemo(() => {
    if (!sunrise || !sunset || !currentTime) {
      return { progress: 0, isDay: false, sunriseStr: '--:--', sunsetStr: '--:--' }
    }

    const parseMins = (timeStr) => {
      const parts = timeStr.match(/(\d+):(\d+)/)
      if (parts) {
        return parseInt(parts[1], 10) * 60 + parseInt(parts[2], 10)
      }
      return null
    }

    const riseMins = parseMins(sunrise)
    const setMins = parseMins(sunset)
    const baseCurrentMins = parseMins(currentTime)

    if (riseMins === null || setMins === null || baseCurrentMins === null) {
      return { progress: 0, isDay: false, sunriseStr: sunrise, sunsetStr: sunset }
    }

    const currentMins = baseCurrentMins + offsetMins
    const totalDuration = setMins - riseMins
    const elapsed = currentMins - riseMins

    let calcProgress = 0
    let day = false

    if (currentMins < riseMins) {
      calcProgress = 0
    } else if (currentMins > setMins) {
      calcProgress = 100
    } else {
      calcProgress = (elapsed / totalDuration) * 100
      day = true
    }

    calcProgress = Math.max(0, Math.min(100, calcProgress))

    return {
      progress: calcProgress,
      isDay: day,
      sunriseStr: sunrise,
      sunsetStr: sunset
    }
  }, [sunrise, sunset, currentTime, offsetMins])

  // Map progress (0-100) to an angle for the SVG arc
  // We want the sun to travel along an elliptical path.
  const angle = (progress / 100) * Math.PI
  const rx = 140
  const ry = 60
  const cx = 150
  const cy = 80

  // Calculate sun position
  // 180 degrees mapping from left to right
  const sunX = cx - rx * Math.cos(angle)
  const sunY = cy - ry * Math.sin(angle)

  return (
    <motion.section 
      className="sun-tracker-card p-6 rounded-[32px] bg-white/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(251,191,36,0.15)] border border-white/60 w-full h-full flex flex-col justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col items-center">
        <h3 className="text-xl font-bold text-amber-600 mb-6 drop-shadow-sm">Sun Tracker</h3>
        
        <div className="relative w-[300px] h-[120px]">
          {/* Geometric Background Arc */}
          <svg width="300" height="120" viewBox="0 0 300 120" className="overflow-visible">
            {/* The path the sun follows */}
            <path
              d={`M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="3"
              strokeDasharray="6 4"
            />
            {/* Filled area under the path (gradient) */}
            <path
              d={`M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy} L ${cx + rx} ${cy + 20} L ${cx - rx} ${cy + 20} Z`}
              fill="url(#sunGradient)"
              opacity="0.3"
            />
            <defs>
              <linearGradient id="sunGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* The Sun */}
            <motion.g
              initial={{ x: cx - rx, y: cy }}
              animate={{ x: sunX, y: sunY }}
              transition={{ duration: 1.5, type: 'spring', bounce: 0.2 }}
            >
              <circle cx="0" cy="0" r="12" fill="#f59e0b" className="drop-shadow-lg" />
              <circle cx="0" cy="0" r="18" fill="#fde68a" opacity="0.4" />
              {isDay && <circle cx="0" cy="0" r="24" fill="#fef3c7" opacity="0.2" className="animate-pulse" />}
            </motion.g>

            {/* Horizon Line */}
            <line x1="0" y1="80" x2="300" y2="80" stroke="#cbd5e1" strokeWidth="2" />
          </svg>

          {/* Time Labels */}
          <div className="absolute top-[85px] left-0 text-sm font-semibold text-gray-500">
            {sunriseStr}
          </div>
          <div className="absolute top-[85px] right-0 text-sm font-semibold text-gray-500">
            {sunsetStr}
          </div>
          
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-full border border-amber-200">
            {isDay ? 'Daylight' : 'Nighttime'}
          </div>
        </div>
        
      </div>
    </motion.section>
  )
}
