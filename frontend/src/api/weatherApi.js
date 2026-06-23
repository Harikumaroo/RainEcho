import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL,
  timeout: 12000,
})

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Token ${token}`
  } else {
    delete api.defaults.headers.common.Authorization
  }
}

export const fetchWeather = (city) => api.get(`/weather/${encodeURIComponent(city)}/`)
export const fetchForecast = (city) => api.get(`/forecast/${encodeURIComponent(city)}/`)

// Notifications APIs
export const fetchNotifications = () => api.get('/notifications/')
export const markNotificationsRead = () => api.post('/notifications/')
