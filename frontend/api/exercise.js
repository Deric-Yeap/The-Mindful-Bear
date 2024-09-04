import axiosInstance from '../common/axiosInstance'

export const getExercises = async (data) => {
  return axiosInstance.get('exercise/get', data)
}

export const createExercise = async (exerciseData) => {
  const formData = new FormData();
  formData.append('exercise_name', exerciseData.exercise_name);
  formData.append('description', exerciseData.exercise);
  formData.append('audio_url', exerciseData.audio_url);
 

  try {
      const response = await axiosInstance.post('exercise/create', formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      });
      return response;
  } catch (error) {
      console.log('Error Description:', error.response?.data?.error_description || error.response?.data || error.message);
      throw error;
  }
};

export const updateexercise = async (exerciseId, exerciseData) => {
  const formData = new FormData();
  formData.append('exercise_name', exerciseData.exercise_name);
  formData.append('description', exerciseData.exercise);
  formData.append('audio_url', exerciseData.audio_url);

  try {
      const response = await axiosInstance.put(`exercise/update/${exerciseId}`, formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      });
      return response;
  } catch (error) {
      console.log('Error Description:', error.response?.data?.error_description || error.response?.data || error.message);
      throw error;
  }
};


export const deleteexercise = async (id) => {
  return axiosInstance.delete(`exercise/delete/${id}`);  
}    