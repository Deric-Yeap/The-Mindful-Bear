import axiosInstance from '../common/axiosInstance'

export const listEmotion = () => {
  return axiosInstance.get('emotion')
}

