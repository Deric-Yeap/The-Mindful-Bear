import axios from 'axios';
import axiosInstance from '../common/axiosInstance'

export const getLandmarks = () => {
    return axiosInstance.get('landmark/get')
}

export const createLandmark = async (landmarkData) => {
    const formData = new FormData();    
    Object.entries(landmarkData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {            
            if (key === 'image_file' && value.uri) {
                formData.append('landmark_image_url', {
                    uri: value.uri,
                    name: value.fileName,
                    type: value.type,
                });
            } else if (key === 'x_coordinates' || key === 'y_coordinates') {                
                formData.append(key, parseFloat(value));
            } else {                
                formData.append(key, value);
            }
        }
    });
    try {
        const response = await axiosInstance.post('landmark/create', formData, {
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


export const updateLandmark = async (landmarkId, landmarkData) => {
    const formData = new FormData();
    formData.append('landmark_name', landmarkData.landmark_name);
    formData.append('landmark_description', landmarkData.landmark_description);
    formData.append('landmark_image_url', {
        uri: landmarkData.image_file.uri,
        name: landmarkData.image_file.fileName,
        type: landmarkData.image_file.type,
    }); 
    formData.append('exercise', landmarkData.exercise);
    formData.append('x_coordinates', parseFloat(landmarkData.x_coordinates));
    formData.append('y_coordinates', parseFloat(landmarkData.y_coordinates));

    try {
        const response = await axiosInstance.put(`landmark/update/${landmarkId}`, formData, {
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


export const deleteLandmark = async (id) => {
    return axiosInstance.delete(`landmark/delete/${id}`);             
};
