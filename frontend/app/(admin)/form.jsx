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

const Form = () => {
  const [loading, setLoading] = useState(true) // Loading state
  const [error, setError] = useState(null) // Error state
  const [forms, setForms] = useState([]) // State to hold fetched forms
  const onSelectSwitch = (index) => {
    alert('Selected index: ' + index)
  }
  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axiosInstance.get('form/get') // Use axiosInstance
        console.log('Fetched data:', response)
        setForms(response) // Set the fetched data to state
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

    fetchForms() // Call the fetch function
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
      <TopBrownSearchBar title="Form Management" />
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
        <Text className="text-mindful-brown-80 font-bold text-3xl">Form</Text>
        <Link href="/create-form" asChild>
          <TouchableOpacity className="bg-mindful-brown-80 px-4 py-1 rounded-full">
            <Text className="text-white font-bold text-base">Create Form</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {forms.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-mindful-brown-80 font-bold text-lg">
            No forms available
          </Text>
        </View>
      ) : (
        <FlatList
          data={forms}
          renderItem={({ item }) => (
            <Link href="/updateform/{id:1}" asChild>
              <TouchableOpacity className="w-full h-auto p-4 items-start bg-[#9BB167] shadow-lg mt-6 rounded-[15px]">
                <Text className="text-[#F7F4F2] font-bold text-lg">
                  {item.form_name}
                </Text>
                <Text className="text-[#F7F4F2] text-md font-bold">
                  {item.store_responses
                    ? 'Store User Response'
                    : "Don't Store Response"}
                </Text>
              </TouchableOpacity>
            </Link>
          )}
          keyExtractor={(item) => item.id.toString()} // Ensure unique key extraction
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      )}
    </SafeAreaView>
  )
}

export default Form
