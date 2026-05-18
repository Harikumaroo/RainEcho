import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const authApi = axios.create({
  baseURL,
  timeout: 12000,
})

export const registerUser = (payload) => authApi.post('/auth/register/', payload)
export const loginUser = (payload) => authApi.post('/auth/login/', payload)
export const requestPasswordReset = (payload) => authApi.post('/auth/password-reset/', payload)
export const confirmPasswordReset = (payload) => authApi.post('/auth/password-reset/confirm/', payload)
export const logoutUser = (token) =>
  axios.post(
    `${baseURL}/auth/logout/`,
    {},
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    },
  )
export const fetchSearchHistory = (token) =>
  axios.get(`${baseURL}/search-history/`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  })
export const saveSearch = (city, token) =>
  axios.post(
    `${baseURL}/search-history/`,
    { city },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    },
  )
