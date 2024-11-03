import axiosInstance from '../common/axiosInstance'

export const gachaFragment = () => {
  return axiosInstance.post('userFragment/gachaFragment')
}
