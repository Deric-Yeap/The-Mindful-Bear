import React from 'react'
import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import BackButton from '../../../components/backButton'
import { useSelector } from 'react-redux'
import AchievementBadge from '../../../components/achievements/achievementBadge'

const Achievement = () => {
  const userAchievements = useSelector(
    (state) => state.achievements.userAchievements
  )

  return (
    <SafeAreaView className="flex-1 p-4 bg-mindful-brown-10 mt-14">
      <View id="title-row" className="flex flex-row items-center mb-8  ">
        <BackButton buttonStyle="mr-2" tabName="(tabs)" screenName="home" />
      </View>
      <Text className="text-3xl font-urbanist-extra-bold text-mindful-brown-80 text-center">
        My Achievements
      </Text>
      <View className="my-4">
        <Text className="text-lg font-urbanist-medium text-mindful-brown-80 text-center">
          You currently have {userAchievements.length} achievements
        </Text>
        {userAchievements.length === 0 ? (
          <Text className="text-lg font-urbanist-medium text-mindful-brown-80 text-center">
            Let's do more for our mental health journey!
          </Text>
        ) : (
          <Text className="text-lg font-urbanist-medium text-mindful-brown-80 text-center">
            Congratulations on your mental health journey!
          </Text>
        )}
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 flex-row justify-start mt-10">
          {userAchievements.map((item, index) => (
            <AchievementBadge
              key={item.achievement.achievement_id || index}
              imageSource={{ uri: item.achievement.achievement_badge_url }}
              title={item.achievement.description}
              date={new Date(item.date_obtained).toLocaleDateString()}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Achievement
