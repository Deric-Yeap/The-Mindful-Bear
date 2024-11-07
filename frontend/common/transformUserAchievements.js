export const transformAchievementData = (apiData) => {
  const userAchievements = Array.isArray(apiData.user_achievements)
    ? apiData.user_achievements.map((userAchievement) => {
        const { achievement, date_obtained } = userAchievement

        if (
          achievement &&
          typeof achievement === 'object' &&
          achievement.achievement_id &&
          achievement.description
        ) {
          return {
            achievement: {
              achievement_id: achievement.achievement_id,
              description: achievement.description,
              streak_count: achievement.streak_count || 0,
              achievement_badge_url: achievement.achievement_badge_url || '',
            },
            date_obtained: date_obtained,
          }
        }

        return {
          achievement: {
            achievement_id: null,
            description: 'Unknown Achievement',
            streak_count: 0,
            achievement_badge_url: '',
          },
          date_obtained: date_obtained,
        }
      })
    : []

  const newlyAttainedAchievements = apiData.newly_created_achievements || []

  return {
    userAchievements,
    newlyAttainedAchievements,
  }
}
