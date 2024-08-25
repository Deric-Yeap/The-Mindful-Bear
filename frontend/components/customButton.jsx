import { TouchableOpacity, Text, View } from 'react-native'
import React from 'react'

const CustomButton = ({
  title,
  handlePress,
  buttonStyle,
  textStyle,
  isLoading,
}) => {
  return (
    <View className={buttonStyle}>
      <TouchableOpacity
        className={`bg-mindful-brown-80 rounded-full min-h-[50px] justify-center items-center ${buttonStyle} ${isLoading ? 'opacity-50' : ''}`}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Text
          className={`font-urbanist-semi-bold text-lg text-white ${textStyle}`}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default CustomButton
