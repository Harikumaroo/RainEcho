import { useMemo, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function MoonTracker({ sunrise, sunset, currentTime }) {
  const [offsetMins, setOffsetMins] = useState(0)

  // Keep current time ticking by adding minutes
  useEffect(() => {
    const timer = setInterval(() => setOffsetMins(prev => prev + 1), 60000)
    return () => clearInterval(timer)
  }, [currentTime])

  useEffect(() => {
    setOffsetMins(0)
  }, [currentTime])

  const { progress, isNight, moonriseStr, moonsetStr } = useMemo(() => {
    if (!sunrise || !sunset || !currentTime) {
      return { progress: 0, isNight: false, moonriseStr: '--:--', moonsetStr: '--:--' }
    }

    const parseMins = (timeStr) => {
      const parts = timeStr.match(/(\d+):(\d+)/)
      if (parts) {
        return parseInt(parts[1], 10) * 60 + parseInt(parts[2], 10)
      }
      return null
    }

    // For the weather app, we approximate moon cycle based on sunset -> sunrise
    const riseMins = parseMins(sunset)
    const setMins = parseMins(sunrise)
    const baseCurrentMins = parseMins(currentTime)

    if (riseMins === null || setMins === null || baseCurrentMins === null) {
      return { progress: 0, isNight: false, moonriseStr: sunset, moonsetStr: sunrise }
    }

    let currentMins = baseCurrentMins + offsetMins
    // Normalize currentMins to a 24-hour cycle starting from noon to handle night crossover
    // Night is from sunset to sunrise. If sunset is 18:00 and sunrise is 06:00.
    
    // Total duration of night
    let totalDuration = setMins - riseMins
    if (totalDuration < 0) totalDuration += 24 * 60

    // Elapsed time since sunset
    let elapsed = currentMins - riseMins
    if (elapsed < 0 && currentMins <= setMins) {
        // past midnight, before sunrise
        elapsed += 24 * 60
    }

    let calcProgress = 0
    let night = false

    // Check if it's currently night
    if ((riseMins < setMins && currentMins >= riseMins && currentMins <= setMins) || 
        (riseMins >= setMins && (currentMins >= riseMins || currentMins <= setMins))) {
        calcProgress = (elapsed / totalDuration) * 100
        night = true
    } else {
        // It's day time. We can just park the moon at 0 or 100
        calcProgress = 0
    }

    calcProgress = Math.max(0, Math.min(100, calcProgress))

    return {
      progress: calcProgress,
      isNight: night,
      moonriseStr: sunset,
      moonsetStr: sunrise
    }
  }, [sunrise, sunset, currentTime, offsetMins])

  const angle = (progress / 100) * Math.PI
  const rx = 140
  const ry = 60
  const cx = 150
  const cy = 80

  const moonX = cx - rx * Math.cos(angle)
  const moonY = cy - ry * Math.sin(angle)

  return (
    <motion.section 
      className="moon-tracker-card p-6 rounded-[32px] bg-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(31,38,135,0.15)] border border-white/20 w-full h-full flex flex-col justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="flex flex-col items-center">
        <h3 className="text-xl font-bold text-slate-100 mb-6 drop-shadow-md">Moon Phase</h3>
        
        <div className="relative w-[300px] h-[120px]">
          <svg width="300" height="120" viewBox="0 0 300 120" className="overflow-visible">
            <path
              d={`M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`}
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="3"
              strokeDasharray="6 4"
            />
            <path
              d={`M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy} L ${cx + rx} ${cy + 20} L ${cx - rx} ${cy + 20} Z`}
              fill="url(#moonGradient)"
              opacity="0.4"
            />
            <defs>
              <linearGradient id="moonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
              </linearGradient>
            </defs>

            <motion.g
              initial={{ x: cx - rx, y: cy }}
              animate={{ x: moonX, y: moonY }}
              transition={{ duration: 1.5, type: 'spring', bounce: 0.2 }}
            >
              {/* Moon shape */}
              <circle cx="0" cy="0" r="12" fill="#f8fafc" className="drop-shadow-lg" />
              {/* Moon craters/details */}
              <circle cx="-4" cy="-3" r="2" fill="#cbd5e1" opacity="0.6" />
              <circle cx="3" cy="4" r="3" fill="#cbd5e1" opacity="0.5" />
              <circle cx="5" cy="-2" r="1.5" fill="#cbd5e1" opacity="0.6" />
              
              <circle cx="0" cy="0" r="18" fill="#e2e8f0" opacity="0.3" />
              {isNight && <circle cx="0" cy="0" r="26" fill="#818cf8" opacity="0.2" className="animate-pulse" />}
            </motion.g>

            <line x1="0" y1="80" x2="300" y2="80" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
          </svg>

          <div className="absolute top-[85px] left-0 text-sm font-semibold text-indigo-100">
            {moonriseStr}
          </div>
          <div className="absolute top-[85px] right-0 text-sm font-semibold text-indigo-100">
            {moonsetStr}
          </div>
          
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-xs font-bold text-indigo-100 bg-indigo-900/50 px-3 py-1 rounded-full border border-indigo-300/30 backdrop-blur-md">
            {isNight ? 'Moonlight' : 'Daytime'}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
