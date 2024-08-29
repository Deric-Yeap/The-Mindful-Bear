import axiosInstance from '../common/axiosInstance'

export const getLandmarks = () => {
    return axiosInstance.get('landmark/get')
}

export const createLandmark = async (landmarkData) => {
    const formData = new FormData();
    formData.append('landmark_name', landmarkData.landmark_name);
    formData.append('image_file', landmarkData.image_file);  // Assuming 'landmark_image_url' is the file input
    formData.append('exercise', landmarkData.exercise);
    formData.append('x_coordinates', landmarkData.x_coordinates);
    formData.append('y_coordinates', landmarkData.y_coordinates);

    try {
        const response = await fetch('landmark/create', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Landmark created successfully:', data);
        return data;

    } catch (error) {
        console.error('Error creating landmark:', error);
    }
};