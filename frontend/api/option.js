import axiosInstance from '../common/axiosInstance'

export const createOption = () => {
  return axiosInstance.get('option_set/get')
}

