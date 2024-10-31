import axiosInstance from '../common/axiosInstance'
export const getArticles = async () => {
    return axiosInstance.get('article/get')
}