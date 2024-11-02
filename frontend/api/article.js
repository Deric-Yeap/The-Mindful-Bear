import axiosInstance from '../common/axiosInstance'
export const getArticles = async () => {
    return axiosInstance.get('article/get')
}

export const createArticle = async (articleData) => {
    return axiosInstance.post('article/create', articleData)
}


export const deleteArticle = async (id) => {
    return axiosInstance.delete(`article/delete/${id}`)
}

export const semanticSearch = async (searchQuery) => {
    return axiosInstance.post('article/semantic-search/', {
        query: searchQuery,
        top_k: 5  
    })
}

