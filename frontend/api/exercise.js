import axiosInstance from '../common/axiosInstance'

export const getExercises = async (data) => {
  return axiosInstance.get('exercise/get', data)
}

