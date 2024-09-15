import axiosInstance from '../common/axiosInstance';

// Function to fetch exercises (no changes needed here)
export const fetchExercises = async () => {
  try {
    const response = await axiosInstance.get('exercise/get');
    return response; // Return the fetched exercises
  } catch (error) {
    throw error; // Throw error to be handled in the calling function
  }
};

// Function to create an exercise with FormData
export const createExercise = async (exerciseData) => {
  const formData = new FormData();
  formData.append('exercise_name', exerciseData.exercise_name);
  formData.append('audio_file', {
    uri: exerciseData.audio_file.uri, 
    name: exerciseData.audio_file.fileName,
    type: exerciseData.audio_file.type,
  });
  console.log('audio_file', exerciseData.audio_file);
  formData.append('description', exerciseData.description);
  
  // Adding foreign key: landmark_id from the landmarks table
  formData.append('landmark_id', exerciseData.landmark_id);
  console.log('formData', formData);

  try {
    const response = await axiosInstance.post('exercise/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response; // Return the created exercise
  } catch (error) {
    throw error.response; // Throw error to be handled in the calling function
  }
};

// Function to update an exercise with FormData
export const updateExercise = async (exerciseData) => {
  const formData = new FormData();
  formData.append('exercise_name', exerciseData.exercise_name);
  f// Ensure `audio_file` is appended as a `File` object
  if (exerciseData.audio_file && exerciseData.audio_file.uri) {
    const file = {
      uri: exerciseData.audio_file.uri,
      name: exerciseData.audio_file.name,
      type: exerciseData.audio_file.type,
    };
    formData.append('audio_file', file);
  }
  console.log(file)
  formData.append('description', exerciseData.description);
  
  // Adding foreign key: landmark_id from the landmarks table
  formData.append('landmark_id', exerciseData.landmark_id);

  try {
    const response = await axiosInstance.put('exercise/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response; // Return the updated exercise
  } catch (error) {
    throw error; // Throw error to be handled in the calling function
  }
};

// Function to delete an exercise (no need for FormData)
export const deleteExercise = async (id) => {
  try {
    const response = await axiosInstance.delete(`exercise/delete/${id}`);
    return response; // Return the deleted exercise
  } catch (error) {
    throw error; // Throw error to be handled in the calling function
  }
};
