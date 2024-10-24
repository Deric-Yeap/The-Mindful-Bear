import React from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native'
import { Link } from 'expo-router'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { colors } from '../../../common/styles'
import TopBrownSearchBar from '../../../components/topBrownSearchBar'
import StatusBarComponent from '../../../components/darkThemStatusBar'
import AnalyticsTabs from '../../../components/analytics/analyticsTabs'

export default function Admin() {
  return (
    <SafeAreaView
      className="flex-1 bg-optimistic-gray-10"
      backgroundColor="#251404"
    >
      <StatusBarComponent
        barStyle="light-content"
        backgroundColor={colors.mindfulBrown100}
      />
      <ScrollView className="flex-1 bg-optimistic-gray-10 mb-16 mt-12">
        <TopBrownSearchBar title="Hi Admin!" />
        <View className="p-4">
          <Text className="text-mindful-brown-100 font-urbanist-bold text-xl mb-4">
            Management
          </Text>
          <View className="flex-row justify-between mb-4">
            <Link href="/admin/user" asChild>
              <TouchableOpacity className="flex-1 bg-mindful-brown-30 p-2 rounded-2xl mr-2">
                <View className="items-start">
                  <Text className="text-white font-urbanist-bold text-lg">
                    User
                  </Text>
                </View>
                <View className="items-center justify-center mt-2">
                  <MaterialCommunityIcons
                    name="account"
                    size={128}
                    color={colors.mindfulBrown10}
                  />
                </View>
              </TouchableOpacity>
            </Link>
            <Link href="/landmark" asChild>
              <TouchableOpacity className="flex-1 bg-mindful-brown-70 p-2 rounded-2xl ml-2">
                <View className="items-start">
                  <Text className="text-mindful-brown-20 font-urbanist-bold text-lg">
                    Landmark
                  </Text>
                </View>
                <View className="items-center justify-center mt-2">
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={128}
                    color={colors.mindfulBrown20}
                  />
                </View>
              </TouchableOpacity>
            </Link>
          </View>

          <View className="flex-row justify-between mb-4">
            <Link href="/exercisemanagement" asChild>
              <TouchableOpacity className="flex-1 bg-serenity-green-50 p-2 rounded-2xl mr-2">
                <View className="items-start">
                  <Text className="text-serenity-green-10 font-urbanist-bold text-lg">
                    Exercise
                  </Text>
                </View>
                <View className="items-center justify-center mt-2">
                  <MaterialCommunityIcons
                    name="meditation"
                    size={128}
                    color={colors.serenityGreen20}
                  />
                </View>
              </TouchableOpacity>
            </Link>
            <Link href="/form" asChild>
              <TouchableOpacity className="flex-1 bg-empathy-orange-40 p-2 rounded-2xl ml-2">
                <View className="items-start">
                  <Text className="text-empathy-orange-10 font-urbanist-bold text-lg">
                    Form
                  </Text>
                </View>
                <View className="items-center justify-center mt-2">
                  <MaterialCommunityIcons
                    name="form-select"
                    size={128}
                    color={colors.empathyOrange20}
                  />
                </View>
              </TouchableOpacity>
            </Link>
          </View>

          <Text className="text-mindful-brown-100 font-urbanist-bold text-xl mb-4">
            Demographic
          </Text>
          <View className="flex-row justify-between mb-4">
            <Link href="/admin/age" asChild>
              <TouchableOpacity className="flex-1 bg-empathy-orange-40 p-2 rounded-2xl mr-2">
                <View className="items-start">
                  <Text className="text-empathy-orange-10 font-urbanist-bold text-lg">
                    Age
                  </Text>
                  <Text className="text-empathy-orange-10 font-urbanist-bold mt-1">
                    35% of users are between ages 30-40
                  </Text>
                </View>
                <View className="items-center justify-center mt-2">
                  <MaterialCommunityIcons
                    name="chart-bar"
                    size={128}
                    color={colors.empathyOrange20}
                  />
                </View>
              </TouchableOpacity>
            </Link>
            <Link href="/admin/department" asChild>
              <TouchableOpacity className="flex-1 bg-kind-purple-30 p-2 rounded-2xl ml-2">
                <View className="items-start">
                  <Text className="text-white font-urbanist-bold text-lg">
                    Department
                  </Text>
                  <Text className="text-white font-urbanist-bold mt-1">
                    69% users are from the Office of Well Being
                  </Text>
                </View>
                <View className="items-center justify-center mt-2">
                  <MaterialCommunityIcons
                    name="office-building"
                    size={128}
                    color={colors.kindPurple10}
                  />
                </View>
              </TouchableOpacity>
            </Link>
          </View>
          <View className="bg-optimistic-gray-10 p-4 rounded-lg mb-4">
            <Text className="text-mindful-brown-100 font-urbanist-bold text-xl mb-4">
              Mindfulness Tracker
            </Text>
            <AnalyticsTabs />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
