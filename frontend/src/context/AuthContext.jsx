import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loginUser, logoutUser, registerUser, fetchSearchHistory } from '../api/authApi'
import { setAuthToken } from '../api/weatherApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('weatherToken') || '')
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('weatherUser')
    return saved ? JSON.parse(saved) : null
  })
  const [history, setHistory] = useState([])

  useEffect(() => {
    setAuthToken(token)
    if (token) {
      fetchSearchHistory(token)
        .then((response) => setHistory(response.data))
        .catch(() => setHistory([]))
    } else {
      setHistory([])
    }
  }, [token])

  const saveAuth = (authToken, authUser) => {
    localStorage.setItem('weatherToken', authToken)
    localStorage.setItem('weatherUser', JSON.stringify(authUser))
    setToken(authToken)
    setUser(authUser)
  }

  const clearAuth = async () => {
    if (token) {
      await logoutUser(token).catch(() => null)
    }
    localStorage.removeItem('weatherToken')
    localStorage.removeItem('weatherUser')
    setToken('')
    setUser(null)
    setHistory([])
  }

  const login = async (credentials) => {
    const response = await loginUser(credentials)
    saveAuth(response.data.token, response.data.user)
    return response
  }

  const register = async (userInfo) => {
    const response = await registerUser(userInfo)
    saveAuth(response.data.token, response.data.user)
    return response
  }

  const refreshHistory = async () => {
    if (!token) return
    const response = await fetchSearchHistory(token)
    setHistory(response.data)
  }

  const value = useMemo(
    () => ({ token, user, history, login, logout: clearAuth, register, refreshHistory }),
    [token, user, history],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
