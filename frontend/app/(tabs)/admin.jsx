import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { colors } from '../../common/styles'; 

export default function Admin() {  
  return (
    <ScrollView className="flex-1 bg-optimistic-gray-10 p-4">
      <Text className="text-mindful-brown-100 font-urbanist-bold text-xl mb-4">Management</Text>
      <View className="flex-row justify-between mb-4">
        <Link href="/admin/user" asChild>
          <TouchableOpacity className="flex-1 bg-mindful-brown-30 p-2 rounded-2xl mr-2">
            <View className="items-start">
              <Text className="text-white font-urbanist-bold text-lg">User</Text>
            </View>
            <View className="items-center justify-center mt-2">
              <MaterialCommunityIcons name="account" size={128} color={colors.mindfulBrown10} /> 
            </View>
          </TouchableOpacity>
        </Link>
        <Link href="/landmark" asChild>
          <TouchableOpacity className="flex-1 bg-mindful-brown-70 p-2 rounded-2xl ml-2">
            <View className="items-start">
              <Text className="text-mindful-brown-20 font-urbanist-bold text-lg">Landmark</Text>
            </View>
            <View className="items-center justify-center mt-2">
              <MaterialCommunityIcons name="map-marker" size={128} color={colors.mindfulBrown20} />
            </View>
          </TouchableOpacity>
        </Link>
      </View>

      <View className="flex-row justify-between mb-4">
        <Link href="/admin/exercise" asChild>
          <TouchableOpacity className="flex-1 bg-serenity-green-50 p-2 rounded-2xl mr-2">
            <View className="items-start">
              <Text className="text-serenity-green-10 font-urbanist-bold text-lg">Exercise</Text>
            </View>
            <View className="items-center justify-center mt-2">
              <MaterialCommunityIcons name="meditation" size={128} color={colors.serenityGreen20} /> 
            </View>
          </TouchableOpacity>
        </Link>
        <Link href="/admin/form" asChild>
          <TouchableOpacity className="flex-1 bg-empathy-orange-40 p-2 rounded-2xl ml-2">
            <View className="items-start">
              <Text className="text-empathy-orange-10 font-urbanist-bold text-lg">Form</Text>
            </View>
            <View className="items-center justify-center mt-2">
              <MaterialCommunityIcons name="form-select" size={128} color={colors.empathyOrange20} /> 
            </View>
          </TouchableOpacity>
        </Link>
      </View>

      <Text className="text-mindful-brown-100 font-urbanist-bold text-xl mb-4">Demographic</Text>
      <View className="flex-row justify-between mb-4">
        <Link href="/admin/age" asChild>
          <TouchableOpacity className="flex-1 bg-empathy-orange-40 p-2 rounded-2xl mr-2">
            <View className="items-start">
            <Text className="text-empathy-orange-10 font-urbanist-bold text-lg">Age</Text>
              <Text className="text-empathy-orange-10 font-urbanist-bold mt-1">35% of users are between ages 30-40</Text>
            </View>
            <View className="items-center justify-center mt-2">
              <MaterialCommunityIcons name="chart-bar" size={128} color={colors.empathyOrange20} />
            </View>
          </TouchableOpacity>
        </Link>
        <Link href="/admin/department" asChild>
          <TouchableOpacity className="flex-1 bg-kind-purple-30 p-2 rounded-2xl ml-2">
            <View className="items-start">
            <Text className="text-white font-urbanist-bold text-lg">Department</Text>
              <Text className="text-white font-urbanist-bold mt-1">69% users are from the Office of Well Being</Text>
            </View>
            <View className="items-center justify-center mt-2">
              <MaterialCommunityIcons name="office-building" size={128} color={colors.kindPurple10} />
            </View>
          </TouchableOpacity>
        </Link>
      </View>
      <View className="bg-optimistic-gray-10 p-4 rounded-lg mb-4">
      <Text className="text-mindful-brown-100 font-urbanist-bold text-xl mb-4">Mindfulness Tracker</Text>
      <View>
        <Link href="/admin/mindfulness-exercises" asChild>
          <TouchableOpacity className="bg-white p-4 rounded-2xl mb-4">
            <View className="flex-row items-center justify-between">
              <View className="w-16 h-16 rounded-full bg-serenity-green-20 flex items-center justify-center">
                <MaterialCommunityIcons name="yoga" size={32} color="#5A6838" />
              </View>
              <View className="flex-1 ml-4">
                <Text className="font-urbanist-bold text-lg">Mindfulness Exercises</Text>
                <Text className="font-urbanist-regular">Frequency, duration, popular locations</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Link>
        <Link href="/admin/mindful-journal" asChild>
          <TouchableOpacity className="bg-white p-4 rounded-2xl mb-4">
            <View className="flex-row items-center justify-between">
              <View className="w-16 h-16 rounded-full bg-mindful-brown-20 flex items-center justify-center">
                <MaterialCommunityIcons name="book-open-variant" size={32} color="#704A33" />
              </View>
              <View className="flex-1 ml-4">
                <Text className="font-urbanist-bold text-lg">Mindful Journal</Text>
                <Text className="font-urbanist-regular">Sentiment analysis, frequency of journalling</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Link>
        <Link href="/admin/survey-scores" asChild>
          <TouchableOpacity className="bg-white p-4 rounded-2xl mb-4">
            <View className="flex-row items-center justify-between">
              <View className="w-16 h-16 rounded-full bg-zen-yellow-20 flex items-center justify-center">
                <MaterialCommunityIcons name="chart-bar" size={32} color="#4A2006" />
              </View>
              <View className="flex-1 ml-4">
                <Text className="font-urbanist-bold text-lg">Survey Scores</Text>
                <Text className="font-urbanist-regular">PSS, SMS, user feedback analysis</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Link>
        <Link href="/admin/engagement-metrics" asChild>
          <TouchableOpacity className="bg-white p-4 rounded-2xl">
            <View className="flex-row items-center justify-between">
              <View className="w-16 h-16 rounded-full bg-empathy-orange-20 flex items-center justify-center">
                <MaterialCommunityIcons name="chart-timeline" size={32} color="#431407" />
              </View>
              <View className="flex-1 ml-4">
                <Text className="font-urbanist-bold text-lg ">Engagement Metrics</Text>
                <Text className="font-urbanist-regular">Session duration, app usage frequency</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Link>
      </View>
    </View>


      
    </ScrollView>
  );
}
