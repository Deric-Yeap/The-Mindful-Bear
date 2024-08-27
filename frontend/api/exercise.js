import axiosInstance from '../common/axiosInstance';

export const getExercises = async () => {
  try {
    const response = await axiosInstance.get('/exercise/get');
    return response.data;  // Assuming the data is in response.data
  } catch (error) {
    console.error('Error fetching exercises:', error);
    throw error;
  }
};
