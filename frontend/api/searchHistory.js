import axiosInstance from '../common/axiosInstance'

export const recordSearch = async (query) => {
    return axiosInstance.post('searchHistory/record_search/', {
        query
    })
}

export const recordClick = async (params) => {
  try {
      const response = await axiosInstance.post('searchHistory/record_click/', {
          query: params.query,
          articleID: params.articleID,
          rankPosition: params.rankPosition
      });
      return response.data;
  } catch (error) {
      throw error;
  }
}

export const getPopularSearches = async () => {
    return axiosInstance.get('searchHistory/popular_searches/')
}