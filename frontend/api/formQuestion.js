import axiosInstance from '../common/axiosInstance'


export const fetchLikelihoodOfFutureUse = () => {
  return axiosInstance.get('formQuestion/likelihood_of_future_use/');
};

export const fetchOverallExperienceRating = () => {
  return axiosInstance.get('formQuestion/overall_experience_rating/');
};

export const fetchRatingDistribution = () => {
  return axiosInstance.get('formQuestion/rating_distribution/');

};

// New fetch function for "Suggestion on Landmark"
export const fetchSuggestionOnLandmark = () => {
  return axiosInstance.get('formQuestion/suggestion_on_landmark/');
};

// New fetch function for "Improvements to App"
export const fetchImprovementsToApp = () => {
  return axiosInstance.get('formQuestion/improvements_to_app/');
};

export const genScoreSession = async ({ year, month } = {}) => {
    try {
      // Construct the URL based on the provided parameters
      let url = `formQuestion/gen-score/`

      // Append year and month to the URL if they are provided
      const params = [];
      if (year) params.push(`year=${year}`);
      if (month) params.push(`month=${month}`);

      // Make the API request
      const response = await axiosInstance.get(url)
      console.log("gen",response)

      // Return the response data
      return response
    } catch (error) {
      console.error('Error fetching session split data:', error)
      throw error
    }
  }



