import axiosInstance from '../common/axiosInstance'

export const listOptionSet = () => {
  return axiosInstance.get('option_set/')
}

