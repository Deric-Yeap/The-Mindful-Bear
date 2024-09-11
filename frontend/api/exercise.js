import axiosInstance from '../common/axiosInstance';


export const fetchExercises = async () => {
  try {
    const response = await axiosInstance.get('exercise/get');
    return response;
  } catch (error) {
    throw error; 
  }
};
export const getExercises = async () => {

  return axiosInstance.get('exercise/get');

};
