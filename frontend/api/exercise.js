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

// Function to create an exercise
export const createExercise = async (data) => {
  try {
    const response = await axiosInstance.post('exercise/create', data);
    return response; // Return the created exercise
  } catch (error) {
    throw error; // Throw error to be handled in the calling function
  }
};

// Function to update an exercise
export const updateExercise = async (data) => {
  try {
    const response = await axiosInstance.put('exercise/update', data);
    return response; // Return the updated exercise
  } catch (error) {
    throw error; // Throw error to be handled in the calling function
  }
};

// Function to delete an exercise
export const deleteExercise = async (id) => {
  try {
    const response = await axiosInstance.delete(`exercise/delete/${id}`);
    return response; // Return the deleted exercise
  } catch (error) {
    throw error; // Throw error to be handled in the calling function
  }
};
