import axiosInstance from '../common/axiosInstance'

export const listAchievementPointRecord = () => {
  return axiosInstance.get('achievementPoint/')
}

export const sumPoints = () => {
  return axiosInstance.get('achievementPoint/sum-points/')

}
export const collectedLogin = () => {
  return axiosInstance.get('achievementPoint/check-login-points')
}

export const postPoints = (data) => {
  return axiosInstance.post('achievementPoint/', data)
}
