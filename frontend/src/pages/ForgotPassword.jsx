import { useState } from 'react'
import { Link } from 'react-router-dom'
import { requestPasswordReset } from '../api/authApi'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMail, FiArrowRight } from 'react-icons/fi'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      await requestPasswordReset({ email })
      setMessage('If that email exists, a password reset link has been sent.')
      setEmail('')
    } catch (err) {
      setError(err?.response?.data?.detail || 'Unable to send password reset email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050b17] font-sans">
      <motion.div
        animate={{ opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ willChange: 'opacity', transform: 'translateZ(0)' }}
        className="absolute -top-[20%] -left-[10%] h-[600px] w-[600px] rounded-full bg-blue-600/30 blur-[100px]"
      />
      <motion.div
        animate={{ opacity: [0.1, 0.25, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        style={{ willChange: 'opacity', transform: 'translateZ(0)' }}
        className="absolute -bottom-[20%] -right-[10%] h-[700px] w-[700px] rounded-full bg-indigo-600/30 blur-[120px]"
      />

      <motion.main
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md px-6 py-16"
      >
        <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-10 shadow-2xl shadow-black/50 backdrop-blur-2xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Forgot Password</h1>
            <p className="text-blue-100/60 mb-8 font-medium">
              Enter your account email and we will send a reset link.
            </p>
          </motion.div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
            >
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <FiMail className="text-blue-200/40 transition-colors group-focus-within:text-blue-400" size={20} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-white placeholder-blue-100/30 outline-none transition-all focus:border-blue-500/50 focus:bg-blue-500/10 focus:ring-4 focus:ring-blue-500/10"
                  placeholder="Email address"
                  required
                />
              </div>
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, scale: 0.95 }}
                  animate={{ opacity: 1, height: 'auto', scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm font-medium text-red-400">
                    {error}
                  </p>
                </motion.div>
              )}
              {message && (
                <motion.div
                  initial={{ opacity: 0, height: 0, scale: 0.95 }}
                  animate={{ opacity: 1, height: 'auto', scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="rounded-xl border border-green-500/20 bg-green-500/10 p-3 text-sm font-medium text-green-200">
                    {message}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="pt-2"
            >
              <button
                type="submit"
                className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] hover:shadow-blue-500/40 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
                disabled={loading}
              >
                {loading ? 'Sending link...' : 'Send reset email'}
                {!loading && <FiArrowRight className="transition-transform group-hover:translate-x-1" size={18} />}
              </button>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-8 text-center text-sm font-medium text-blue-100/50"
          >
            Remembered your password?{' '}
            <Link to="/login" className="text-blue-400 transition-colors hover:text-blue-300">
              Sign in
            </Link>
          </motion.div>
        </div>
      </motion.main>
    </div>
  )
}
