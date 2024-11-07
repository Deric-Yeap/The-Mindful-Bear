import axiosInstance from '../common/axiosInstance'

export const getNewAchievements = async () => {
  return axiosInstance.get('userAchievement/obtainAchievements')
}

export const getAchievementsByUserId = (id) => {
  return axiosInstance.get(`userAchievement/getUserAchievementByUserId/${id}`)
}
