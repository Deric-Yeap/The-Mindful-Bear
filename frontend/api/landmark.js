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

export const createFavouriteLandmark = async (id) => {
    return axiosInstance.post(`favourite/create/${id}/`)
}

export const deleteFavouriteLandmark = async (id) => {
    return axiosInstance.delete(`favourite/delete/${id}/`)
}

export const getFavouriteLandmarks = async () => {
    return axiosInstance.get('favourite/list')
}

export const getUserCount = async (landmarkId) => {
    return axiosInstance.get(`landmarkUserCount/${landmarkId}`);
}

export const incrementUserCount = async (landmarkId) => {
    return axiosInstance.patch(`landmarkUserCount/${landmarkId}/increment`);
}

export const decrementUserCount = async (landmarkId) => {
    return axiosInstance.patch(`landmarkUserCount/${landmarkId}/decrement`);
}