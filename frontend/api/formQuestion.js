import axiosInstance from '../common/axiosInstance'


export const generalScoreSession = async ({ period = 'daily', year, month } = {}) => {
  try {
    // Construct the URL based on the provided parameters
    let url = `formSQession/gen-score//?period=${period}`

    // Append year and month to the URL if they are provided
    if (year) url += `&year=${year}`
    if (month) url += `&month=${month}`

    // Make the API request
    const response = await axiosInstance.get(url)


    // Return the response data
    return response
  } catch (error) {
    console.error('Error fetching session split data:', error)
    throw error
  }
}



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
