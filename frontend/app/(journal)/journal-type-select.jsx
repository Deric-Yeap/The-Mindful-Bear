import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { router } from 'expo-router'

import { colors } from '../../common/styles'
import BackButton from '../../components/backButton'

const JournalTypeSelect = () => {
  return (
    <SafeAreaView className="bg-optimistic-gray-10 h-full p-4 space-y-4">
      <BackButton buttonStyle="mb-4" />
      <View className="">
        <Text className="font-urbanist-extra-bold text-mindful-brown-80 text-4xl mb-1">
          New Mental
        </Text>
        <Text className="font-urbanist-extra-bold text-mindful-brown-80 text-4xl">
          Health Journal
        </Text>
      </View>

      <TouchableOpacity className="bg-white h-[25vh] p-4 rounded-3xl shadow-2xl mb-4 justify-center">
        <View className="flex flex-row justify-between items-center">
          <View>
            <View
              className={`w-16 h-16 rounded-full bg-serenity-green-40 flex items-center justify-center -mt-4`}
            >
              <MaterialCommunityIcons
                name="microphone"
                size={30}
                color={'white'}
              />
            </View>

            <View className="mt-6">
              <Text className="font-urbanist-extra-bold text-mindful-brown-80 text-xl">
                Voice Journal
              </Text>
              <Text className="font-urbanist-regular text-mindful-brown-80 text-xl">
                Automatically create health journal by Voice & Face detection
                with AI
              </Text>
            </View>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={30}
            color={colors.mindfulBrown80}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-white h-[25vh] p-4 rounded-3xl shadow-2xl mb-4 justify-center"
        onPress={() => router.push('/(journal)/text-journal')}
      >
        <View className="flex flex-row justify-between items-center">
          <View>
            <View
              className={`w-16 h-16 rounded-full bg-empathy-orange-40 flex items-center justify-center -mt-4`}
            >
              <MaterialCommunityIcons
                name="notebook-outline"
                size={30}
                color={'white'}
              />
            </View>

            <View className="mt-6">
              <Text className="font-urbanist-extra-bold text-mindful-brown-80 text-xl">
                Text Journal
              </Text>
              <Text className="font-urbanist-regular text-mindful-brown-80 text-xl">
                Set up manual text journal based on your current mood &
                conditions
              </Text>
            </View>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={30}
            color={colors.mindfulBrown80}
          />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default JournalTypeSelect
