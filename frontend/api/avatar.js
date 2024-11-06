import axiosInstance from '../common/axiosInstance'

export const getAvatars = (data) => {
  return axiosInstance.get('avatar/get')
}
