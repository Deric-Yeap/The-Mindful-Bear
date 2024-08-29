import axiosInstance from '../common/axiosInstance'

export const createSession = (data) => {
  return axiosInstance.put('session/create/', data)
}
