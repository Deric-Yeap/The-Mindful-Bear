import React from 'react'
import { View, Text } from 'react-native'
import LottieView from 'lottie-react-native'

const Loading = ({ title }) => {
  return (
    <View className="flex-1 justify-center items-center">
      <LottieView
        source={require('../assets/animatedBear.json')}
        autoPlay
        loop
        className="w-60 h-60" // Approximately 200px
      />
      <View className="flex flex-row items-center mt-[-80]">
        <Text className="text-lg font-bold mr-[-20]">Loading</Text>
        <LottieView
          source={require('../assets/loadingDots.json')}
          autoPlay
          loop
          className="w-24 h-24" // Approximately 100px
        />
      </View>
    </View>
  )
}

export default Loading
