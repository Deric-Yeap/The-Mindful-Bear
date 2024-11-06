import React from 'react'
import { View, Text } from 'react-native'
import { Image } from 'expo-image'
import CustomButton from '../customButton'
import LottieView from 'lottie-react-native'

const AchievementBadge = ({ imageSource, title, date }) => {
  return (
    <View className="w-1/3 h-1/6">
      <View className="flex-1 justify-center items-center">
        <LottieView
          source={imageSource}
          className="w-full h-1/3 xs:h-4/6 rounded-full mb-4"
          autoPlay
        />
        {title && (
          <Text className="text-lg font-urbanist-extra-bold mb-2 text-center">
            {title}
          </Text>
        )}
        {date && (
          <Text className="text-lg font-urbanist-semi-bold text-center">
            {date}
          </Text>
        )}
      </View>
    </View>
  )
}
export default AchievementBadge
