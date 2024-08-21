import { TouchableOpacity, Text } from 'react-native'
import React from 'react'

const CustomButton = ({title, handlePress, buttonStyle, textStyle, isLoading}) => {
  return (
    <TouchableOpacity
      className={`bg-amber-300 rounded-xl min-h-[50px] justify-center items-center ${buttonStyle} ${isLoading ? 'opacity-50' : ''}`}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Text className={`font-urbanist-semi-bold text-lg ${textStyle}`}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton
