import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { colors } from '../common/styles'
import { useRouter } from 'expo-router' // Import useRouter for navigation

const SettingsItem = ({
  title,
  iconName,
  badgeCount = null,
  href,
  setIsShowLogoutModal,
}) => {
  const router = useRouter() // Initialize the router for navigation

  const handlePress = () => {
    if (href) {
      if (href == 'logout') {
        setIsShowLogoutModal(true)
      } else {
        router.push(href) // Navigate to the specified route
      }
    }
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`flex-row justify-between items-center px-4 py-3 bg-white rounded-3xl mb-3`}
    >
      <View className="flex-row items-center space-x-4">
        {/* Icon with Border */}
        <View className="p-2 rounded-3xl bg-optimistic-gray-10">
          <MaterialCommunityIcons
            name={iconName}
            size={24}
            color={colors.serenityGreen80}
          />
        </View>

        {/* Text Content */}
        <Text className="text-mindful-brown-100 font-urbanist-bold text-base">
          {title}
        </Text>

        {badgeCount && (
          <View className="ml-2 px-2 py-1 rounded-full bg-mindful-brown-30">
            <Text className="text-white font-urbanist-bold text-sm">
              {badgeCount}+
            </Text>
          </View>
        )}
      </View>
      <Text className="text-mindful-brown-100 font-urbanist-bold text-xl">
        {' '}
        &#41;{' '}
      </Text>
    </TouchableOpacity>
  )
}

export default SettingsItem
