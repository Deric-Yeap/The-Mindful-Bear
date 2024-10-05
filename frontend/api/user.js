import axiosInstance from '../common/axiosInstance'

export const login = (data) => {
  return axiosInstance.post('users/login', data)
}

export const getMe = () => {
  return axiosInstance.get('users/getMe')
}

export const create = (data) => {
  return axiosInstance.post('users/create', data)
}

export const getExercises = async () => {
  return axiosInstance.get('users/exercises/')
}