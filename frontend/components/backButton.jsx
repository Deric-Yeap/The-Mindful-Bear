import React from 'react'
import { useNavigation } from '@react-navigation/native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { View, Text, TouchableOpacity } from 'react-native'
import { colors } from '../common/styles'

const BackButton = ({ title, buttonStyle, tabName, screenName }) => {
  const navigation = useNavigation()

  const handlePress = () => {
    if (tabName && screenName) {
      navigation.navigate(tabName, { screen: screenName })
    } else {
      navigation.goBack()
    }
  }

  return (
    <View className={`flex-row items-center ${buttonStyle}`}>
      <TouchableOpacity
        onPress={handlePress}
        className="p-3 bg-mindful-brown-20 rounded-full mr-4"
      >
        <MaterialIcons
          name="arrow-back"
          size={24}
          color={colors.mindfulBrown80}
        />
      </TouchableOpacity>
      <Text className="text-xl font-bold text-white">{title}</Text>
    </View>
  )
}

export default BackButton
