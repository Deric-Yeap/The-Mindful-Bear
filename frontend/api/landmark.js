import axiosInstance from '../common/axiosInstance'

export const getLandmarks = () => {
    return axiosInstance.get('landmark/get')
}