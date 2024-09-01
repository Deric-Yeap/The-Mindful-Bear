import axiosInstance from '../common/axiosInstance'

export const listDepartment = (data) => {
  return axiosInstance.get('department', data)
}

