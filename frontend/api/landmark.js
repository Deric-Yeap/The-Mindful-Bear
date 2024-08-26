import axios from 'axios';

const createLandmark = async (landmarkData) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/landmark/create', landmarkData);
    console.log('Landmark created:', response.data);
  } catch (error) {
    console.error('Error creating landmark:', error);
  }
};