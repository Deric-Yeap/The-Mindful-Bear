import axiosInstance from '../common/axiosInstance'

export const login = (data) => {
  return axiosInstance.post('users/login', data)
}

export const getMe = (data) => {
  return axiosInstance.get('users/getMe', data)
}

