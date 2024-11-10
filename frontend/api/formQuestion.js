import axiosInstance from '../common/axiosInstance';

export const fetchLikelihoodOfFutureUse = () => {
  return axiosInstance.get('formQuestion/likelihood_of_future_use/');
};

export const fetchOverallExperienceRating = () => {
  return axiosInstance.get('formQuestion/overall_experience_rating/');
};
