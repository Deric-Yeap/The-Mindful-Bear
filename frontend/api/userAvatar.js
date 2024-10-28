import axiosInstance from '../common/axiosInstance'

export const getUserAvatars = (id) => {
  return axiosInstance.get(`userAvatar/getUserAvatarByUserId/${id}`)
}
