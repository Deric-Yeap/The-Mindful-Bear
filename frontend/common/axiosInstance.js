import axios from 'axios'
import { store } from '../redux/store'

const axiosInstance = axios.create({
  baseURL: 'http://10.0.2.2:8000/api/',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState()
    const token = state.auth.token
    config.headers['X-Request-Timestamp'] = new Date().toISOString()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {        
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => {    
    return response.data.data
  },
  (error) => {
    if (error.response && error.response.data && error.response.data.error_description) {
      console.log('Error Description:', error.response.data.error_description);
    } else {
      console.log('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
)

export default axiosInstance
