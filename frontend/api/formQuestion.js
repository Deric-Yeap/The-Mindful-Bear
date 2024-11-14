import axiosInstance from '../common/axiosInstance';

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