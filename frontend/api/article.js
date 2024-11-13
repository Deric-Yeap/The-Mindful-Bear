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
    }, {
        // Additional config specific to semantic search
        
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        onDownloadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Search Progress: ${percentCompleted}%`);
        }
    });
}

