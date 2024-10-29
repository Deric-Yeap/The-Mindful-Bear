import React from 'react'
import { View, Pressable } from 'react-native'

const CustomRadioButton = ({ selected, onPress, map }) => {
  return (
    <Pressable
      className={`h-6 w-6 rounded-full justify-center items-center ${
        map
          ? 'border-white'
          : selected
            ? 'border-white'
            : 'border-mindful-brown-100'
      } border-2`}
      onPress={onPress}
    >
      {selected && <View className="h-3 w-3 rounded-full bg-white" />}
    </Pressable>
  )
}
export default CustomRadioButton
