import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { router } from 'expo-router'

import { colors } from '../../common/styles'
import BackButton from '../../components/backButton'

const JournalStats = () => {
  return (
   <SafeAreaView className="bg-optimistic-gray-10 h-full p-4 space-y-4">
      <BackButton buttonStyle="mb-4" />
      <View className="">
        <Text className="font-urbanist-extra-bold text-mindful-brown-80 text-4xl mb-1">
         Journal Stats
        </Text>
        <Text className="font-urbanist-light text-mindful-brown-80 text-2xl">
        Your Journal Stats for Feb 2025
        </Text>
      </View>

      
    </SafeAreaView>
  )
}

export default JournalStats;
