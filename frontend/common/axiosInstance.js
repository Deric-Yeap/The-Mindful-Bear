import axios from 'axios'
import { store } from '../redux/store'

const axiosInstance = axios.create({
  baseURL: 'http://10.0.2.2:8000/api/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState()
    const token = state.auth.token
    config.headers['X-Request-Timestamp'] = new Date().toISOString()
    console.log(token)
    if (token) {
      console.log(token)
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {    
    if (error.response && error.response.data && error.response.data.error_description) {
      console.error('API Error:', error.response.data.error_description)
    } else {
      console.error('API Error:', error.message)
    }
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data.data
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default axiosInstance
