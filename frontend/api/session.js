import axiosInstance from '../common/axiosInstance'

export const createSession = async (data) => {
  return axiosInstance.post('session/create/', data)
}
