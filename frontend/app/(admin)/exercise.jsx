import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import TopBrownSearchBar from '../../components/topBrownSearchBar'
import StatusBarComponent from '../../components/darkThemStatusBar'
import Toggle from '../../components/toggle'
import { Link } from 'expo-router'
import axiosInstance from '../../common/axiosInstance'
import { colors } from '../../common/styles'

const Exercise = () => {
  const [loading, setLoading] = useState(true) // Loading state
  const [error, setError] = useState(null) // Error state
  const [exercises, setExercises] = useState([]) // State to hold fetched exercises
  const onSelectSwitch = (index) => {
    alert('Selected index: ' + index)
  }
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axiosInstance.get('exercise/get') // Use axiosInstance
        console.log('Fetched data:', response.data)
        setExercises(response.data) // Set the fetched data to state
      } catch (error) {
        console.error(
          'Error fetching data:',
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
      <SafeAreaView className="flex-1 bg-optimistic-gray-10 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-optimistic-gray-10 justify-center items-center">
        <Text>Error fetching data: {error.message}</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-optimistic-gray-10">
      <StatusBarComponent barStyle="light-content" backgroundColor="#251404" />
      <TopBrownSearchBar title="Exercise Management" />
      <View style={{ alignItems: 'center', margin: 20 }}>
        <Toggle
          selectionMode={1}
          roundCorner={true}
          option1={'Form Set'}
          option2={'Option Set'}
          onSelectSwitch={onSelectSwitch}
          selectionColor={colors.mindfulBrown80}
        />
      </View>
      <View className="flex-row justify-between items-center pt-4 pb-0 px-4">
        <Text className="text-mindful-brown-80 font-bold text-3xl">Exercises</Text>
        <Link href="/exerciseCreator" asChild>
          <TouchableOpacity className="bg-mindful-brown-80 px-4 py-1 rounded-full">
            <Text className="text-white font-bold text-base">Create Exercise</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {exercises && exercises.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-mindful-brown-80 font-bold text-lg">
            No exercises found
          </Text>
        </View>
      ) : (
        <FlatList
          data={exercises}
          renderItem={({ item }) => (
            <Link href={`/exerciseDetail/${item.exercise_id}`} asChild>
              <TouchableOpacity className="w-full h-auto p-4 items-start bg-[#9BB167] shadow-lg mt-6 rounded-[15px]">
                <Text className="text-[#F7F4F2] font-bold text-lg">
                  {item.exercise_name}
                </Text>
                <Text className="text-[#F7F4F2] text-md">
                  {item.description}
                </Text>
                <Text className="text-[#F7F4F2] text-sm">
                  {item.audio_url}
                </Text>
              </TouchableOpacity>
            </Link>
          )}
          keyExtractor={(item) => item.exercise_id.toString()} // Ensure unique key extraction
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      )}
    </SafeAreaView>
  )
}

export default Exercise
