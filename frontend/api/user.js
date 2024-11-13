import axiosInstance from '../common/axiosInstance'

export const login = (data) => {
  return axiosInstance.post('users/login', data)
}

export const getMe = () => {
  return axiosInstance.get('users/getMe')
}

export const listUsers = () => {
  return axiosInstance.get('users/list-users')
}

export const create = (data) => {
  return axiosInstance.post('users/create', data)
}

export const upgradeUser = (data) => {
  return axiosInstance.post('users/upgrade-user/', data)
}

export const getExercises = async () => {
  return axiosInstance.get('users/exercises/')
}

export const getSessionExercises = async (sessionId) => {
  return axiosInstance.get(`users/session-exercises/${sessionId}`)
}

export const getSessionLandmarks = async (sessionId) => {
  return axiosInstance.get(`users/landmark-exercises/${sessionId}`)
}
