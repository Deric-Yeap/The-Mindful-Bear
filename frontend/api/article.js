import axiosInstance from '../common/axiosInstance'
export const getArticles = async () => {
    return axiosInstance.get('article/get')
}

export const createArticle = async (articleData) => {
    return axiosInstance.post('article/create', articleData)
}

// export const updateArticle = async (id, articleData) => {
//     return axiosInstance.put(`article/${id}`, articleData)
// }

// export const deleteArticle = async (id) => {
//     return axiosInstance.delete(`article/${id}`)
// }