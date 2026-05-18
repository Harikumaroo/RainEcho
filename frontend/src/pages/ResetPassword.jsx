import { useEffect, useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { confirmPasswordReset } from '../api/authApi'
import { motion, AnimatePresence } from 'framer-motion'
import { FiLock, FiArrowRight } from 'react-icons/fi'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [uid, setUid] = useState('')
  const [token, setToken] = useState('')

  useEffect(() => {
    setUid(searchParams.get('uid') || '')
    setToken(searchParams.get('token') || '')
  }, [searchParams])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      await confirmPasswordReset({ uid, token, new_password: newPassword })
      setMessage('Your password was reset successfully. Redirecting to login...')
      setNewPassword('')
      setTimeout(() => {
        navigate('/login')
      }, 1800)
    } catch (err) {
      setError(err?.response?.data?.detail || 'Unable to reset password. Please try again.')
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
            <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Reset Password</h1>
            <p className="text-blue-100/60 mb-8 font-medium">
              Set a new password for your account.
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
                  <FiLock className="text-blue-200/40 transition-colors group-focus-within:text-blue-400" size={20} />
                </div>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-white placeholder-blue-100/30 outline-none transition-all focus:border-blue-500/50 focus:bg-blue-500/10 focus:ring-4 focus:ring-blue-500/10"
                  placeholder="New password"
                  required
                  minLength={8}
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
                disabled={loading || !uid || !token}
              >
                {loading ? 'Resetting password...' : 'Reset password'}
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
            Need a reset link?{' '}
            <Link to="/forgot-password" className="text-blue-400 transition-colors hover:text-blue-300">
              Request one again
            </Link>
          </motion.div>
        </div>
      </motion.main>
    </div>
  )
}
