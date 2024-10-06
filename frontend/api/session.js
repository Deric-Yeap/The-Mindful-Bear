import axiosInstance from '../common/axiosInstance'

export const createSession = async (data) => {
  return axiosInstance.post('session/create/', data)
}

export const updateSession = async (data, sessionId) => {
  console.log(sessionId)
  return axiosInstance.put(`session/update/${sessionId}/`, data)
}
