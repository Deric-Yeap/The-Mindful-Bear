import axiosInstance from '../common/axiosInstance'

export const listExercise = (data) => {
  return axiosInstance.get('exercise', data)
}

