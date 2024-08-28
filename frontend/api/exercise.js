// api/exercise.js

import axiosInstance from '../common/axiosInstance';

// Function to fetch exercises
export const fetchExercises = async () => {
  try {
    const response = await axiosInstance.get('exercise/get');
    return response; // Return the fetched exercises
  } catch (error) {
    throw error; // Throw error to be handled in the calling function
  }
};
