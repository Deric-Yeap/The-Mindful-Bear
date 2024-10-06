import axiosInstance from '../common/axiosInstance'

export const deleteQuestion = (id) => {
  return axiosInstance.delete(`question/${id}/`)
}

export const editQuestion = (id, data) => {
  return axiosInstance.put(`question/${id}/`, data)
}

