import { FiSearch } from 'react-icons/fi'
import { motion } from 'framer-motion'

export default function SearchBar({ city, onCityChange, onSearch, loading }) {
  return (
    <motion.div
      className="search-card rounded-[32px] border border-gray-200 bg-white/95 p-8 shadow-lg backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      <div className="search-bar grid gap-4 lg:grid-cols-[1fr_auto]">
        <input
          type="text"
          value={city}
          onChange={(event) => onCityChange(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && onSearch()}
          className="search-input rounded-2xl border border-gray-300 bg-white px-5 py-4 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
          placeholder="Search for a city, e.g. New York"
        />
        <button
          className="search-button inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          type="button"
          onClick={onSearch}
          disabled={loading}
        >
          <FiSearch size={20} />
          {loading ? 'Searching...' : 'Search city'}
        </button>
      </div>
    </motion.div>
  )
}
