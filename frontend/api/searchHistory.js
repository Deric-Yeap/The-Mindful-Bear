import axiosInstance from '../common/axiosInstance'

export const recordSearch = async (query) => {
    return axiosInstance.post('searchHistory/record_search/', {
        query
    })
}

export const recordClick = async (params) => {
  console.log('recordClick called with params:', params); // Debug log
  try {
      const response = await axiosInstance.post('searchHistory/record_click/', {
          query: params.query,
          articleID: params.articleID,
          rankPosition: params.rankPosition
      });
      console.log('recordClick response:', response); // Debug log
      return response.data;
  } catch (error) {
      console.error('recordClick error:', error); // Debug log
      throw error;
  }
}

export const getPopularSearches = async () => {
    return axiosInstance.get('searchHistory/popular_searches/')
}