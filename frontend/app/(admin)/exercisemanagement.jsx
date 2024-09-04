import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import TopBrownSearchBar from '../../components/topBrownSearchBar'
import axiosInstance from '../../common/axiosInstance'
import { router } from 'expo-router' // Import router from expo-router
import { Link } from 'expo-router'
import StatusBarComponent from '../../components/darkThemStatusBar'
import { colors } from '../../common/styles'
import Loading from '../../components/loading'; 

const ExerciseManagement = () => {
  const [loading, setLoading] = useState(true) // Loading state
  const [error, setError] = useState(null) // Error state
  const [exercises, setExercises] = useState([]) // State to hold fetched exercises

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axiosInstance.get('exercise/get')
        console.log('Full response:', response)
        setExercises(response) // Directly set the response since it's already an array
      } catch (error) {
        console.error(
          'Error fetching exercises:',
          error.response ? error.response.data : error.message
        )
        setError(error) // Set error if fetching fails
      } finally {
        setLoading(false) // Set loading to false after fetching
      }
    }

    fetchExercises() // Call the fetch function
  }, []) // Empty dependency array means this runs once on mount

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.optimisticGray10 }}>
        <Loading /> 
      </View>
    );
  }


  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-optimistic-gray-10 justify-center items-center">
        <Text>Error fetching exercises: {error.message}</Text>
      </SafeAreaView>
    )
  }

  const handleExercisePress = (exercise) => {
    console.log(`Navigating to exercise details:`, exercise)
    router.push({
      pathname: '/exercisedetails',
      params: { exercise: JSON.stringify(exercise) },
    })
  }

  return (
    <SafeAreaView className="flex-1 bg-optimistic-gray-10">
    <StatusBarComponent
      barStyle="light-content"
      backgroundColor={colors.mindfulBrown100}
    />
      <ScrollView className="flex-1 bg-optimistic-gray-10">
        <TopBrownSearchBar title="Exercise Management" />

        <View className="flex-1 px-4 mt-5">
          <View className="flex-row justify-between items-center pt-4 pb-0 px-4 mb-4">
            <Text className="text-mindful-brown-80 font-bold text-3xl">
              Exercises
            </Text>
            <Link href="/" asChild>
              <TouchableOpacity className="bg-mindful-brown-80 px-4 py-1 rounded-full">
                <Text className="text-white font-bold text-base">
                  Create Exercises
                </Text>
              </TouchableOpacity>
            </Link>
          </View>

          {exercises.map((exercise, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center justify-between bg-serenity-green-50 rounded-[15px] py-4 px-4 mb-6"
              onPress={() => handleExercisePress(exercise)}
            >
              <Text className="text-mindful-brown-10 text-base mr-1">
                {exercise.description}
              </Text>
              <MaterialIcons name="chevron-right" size={24} color="#9BB167" />
            </TouchableOpacity>
          ))}
        </View>

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  )
}

export default ExerciseManagement
