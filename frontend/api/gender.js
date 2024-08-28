import axiosInstance from '../common/axiosInstance'

export const listGender = (data) => {
  return axiosInstance.get('gender', data)
}

