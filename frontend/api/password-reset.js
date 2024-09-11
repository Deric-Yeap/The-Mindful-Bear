import axiosInstance from '../common/axiosInstance'

export const passwordResetLink = (data) => {
  return axiosInstance.post('password_reset/', data)
}

export const passwordConfirm = (data) => {
  return axiosInstance.post('password_reset/confirm/', data)
}
