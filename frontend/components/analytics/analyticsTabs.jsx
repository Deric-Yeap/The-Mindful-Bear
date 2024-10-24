import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Link } from 'expo-router'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { featureFlags } from '../../common/featureFlags'
import { useSelector } from 'react-redux'

const AnalyticsTabs = () => {
  const user = useSelector((state) => state.user)
  const commonViews = [
    featureFlags.isMindfulnessExercise && (
      <Link href="/mindfulness-exercises" asChild key="mindfulness-exercises">
        <TouchableOpacity className="bg-white p-4 rounded-2xl mb-4">
          <View className="flex-row items-center justify-between">
            <View className="w-16 h-16 rounded-full bg-serenity-green-20 flex items-center justify-center">
              <MaterialCommunityIcons name="yoga" size={32} color="#5A6838" />
            </View>
            <View className="flex-1 ml-4">
              <Text className="font-urbanist-bold text-lg">
                Mindfulness Exercises
              </Text>
              <Text className="font-urbanist-regular">
                Frequency, duration, popular locations
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    ),
    featureFlags.isSurveyScores && (
      <Link href="/admin/survey-scores" asChild key="survey-scores">
        <TouchableOpacity className="bg-white p-4 rounded-2xl mb-4">
          <View className="flex-row items-center justify-between">
            <View className="w-16 h-16 rounded-full bg-zen-yellow-20 flex items-center justify-center">
              <MaterialCommunityIcons
                name="chart-bar"
                size={32}
                color="#4A2006"
              />
            </View>
            <View className="flex-1 ml-4">
              <Text className="font-urbanist-bold text-lg">Survey Scores</Text>
              <Text className="font-urbanist-regular">
                PSS, SMS, user feedback analysis
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    ),
  ]
  const staffViews = [
    <Link href={{ pathname: '/journal-analytics', query: { previousScreen: 'stats' } }} asChild key="journal-analytics">
      <TouchableOpacity className="bg-white p-4 rounded-2xl mb-4">
        <View className="flex-row items-center justify-between">
          <View className="w-16 h-16 rounded-full bg-mindful-brown-20 flex items-center justify-center">
            <MaterialCommunityIcons
              name="book-open-variant"
              size={32}
              color="#704A33"
            />
          </View>
          <View className="flex-1 ml-4">
            <Text className="font-urbanist-bold text-lg">Mindful Journal</Text>
            <Text className="font-urbanist-regular">
              Sentiment analysis, frequency of journalling
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>,
    <Link href="/mindfulness-exercises-analytics" asChild key="engagement-metrics">
      <TouchableOpacity className="bg-white p-4 rounded-2xl">
        <View className="flex-row items-center justify-between">
          <View className="w-16 h-16 rounded-full bg-empathy-orange-20 flex items-center justify-center">
            <MaterialCommunityIcons
              name="chart-timeline"
              size={32}
              color="#431407"
            />
          </View>
          <View className="flex-1 ml-4">
            <Text className="font-urbanist-bold text-lg ">
              Engagement Metrics
            </Text>
            <Text className="font-urbanist-regular">
              Session duration, app usage frequency
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>,
  ]
  const nonStaffViews = [
    <Link
      href={{
        pathname: '/journal-stats',
        params: { tabName: '(tabs)',
          screenName: 'stats'
         },
      }}
      asChild
      key="journal-stats"
    >
      <TouchableOpacity className="bg-white p-4 rounded-2xl mb-4">
        <View className="flex-row items-center justify-between">
          <View className="w-16 h-16 rounded-full bg-mindful-brown-20 flex items-center justify-center">
            <MaterialCommunityIcons
              name="book-open-variant"
              size={32}
              color="#704A33"
            />
          </View>
          <View className="flex-1 ml-4">
            <Text className="font-urbanist-bold text-lg">
              My Journal Stats
            </Text>
            <Text className="font-urbanist-regular">
              Sentiment analysis, frequency of journalling
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>,
  ]

  return (
    <View className="px-3 mt-4">
      {commonViews}
      {user.isStaff ? staffViews : nonStaffViews}
    </View>
  )
}

export default AnalyticsTabs
