import React from 'react'
import { View, Text } from 'react-native'
import { Image } from 'expo-image'
import CustomButton from '../customButton'
import LottieView from 'lottie-react-native'

const AchievementBadge = ({ imageSource, title, date }) => {
  const isLottieFile =
    (typeof imageSource === 'string' && imageSource.includes('.json')) ||
    (typeof imageSource === 'object' &&
      imageSource.uri &&
      imageSource.uri.includes('.json'))

  return (
    <View className="w-1/3 h-1/5">
      <View className="flex-1 justify-center items-center">
        <View className="w-3/5 h-3/5 rounded-full bg-mindful-brown-20 justify-center items-center">
          {isLottieFile ? (
            <LottieView
              source={imageSource}
              className="w-20 h-20 rounded-full"
              autoPlay
            />
          ) : (
            <Image
              source={imageSource}
              className="w-20 h-20 rounded-full"
              contentFit="contain"
            />
          )}
        </View>
        <View className="h-10 justify-center">
          {title && (
            <Text
              className="text-md font-urbanist-extra-bold text-center"
              numberOfLines={1}
            >
              {title}
            </Text>
          )}
        </View>
        {date && (
          <Text className="text-md font-urbanist-semi-bold text-center">
            {date}
          </Text>
        )}
      </View>
    </View>
  )
}

export default AchievementBadge
