import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBrownSearchBar from '../../components/topBrownSearchBar'; 
import { Link } from 'expo-router';
import axiosInstance from '../../common/axiosInstance'; 

const Form = () => {
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [forms, setForms] = useState([]); // State to hold fetched forms

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axiosInstance.get('form/get'); // Use axiosInstance
        console.log('Fetched data:', response);
        setForms(response); // Set the fetched data to state
      } catch (error) {
        console.error('Error fetching data:', error.response ? error.response.data : error.message);
        setError(error); // Set error if fetching fails
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchForms(); // Call the fetch function
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-optimistic-gray-10 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-optimistic-gray-10 justify-center items-center">
        <Text>Error fetching data: {error.message}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-optimistic-gray-10">
      <TopBrownSearchBar title="Form Management" />
        
      <View className="flex-row justify-between items-center pt-4 pb-0 px-4">
        <Text className="text-mindful-brown-80 font-bold text-3xl">Form</Text>
        <Link href="/create-form" asChild>
          <TouchableOpacity className="bg-mindful-brown-80 px-4 py-1 rounded-full">
            <Text className="text-white font-bold text-base">Create Form</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <FlatList
        data={forms}
        renderItem={({ item }) => (
          <View className="w-full h-16 p-4 items-start bg-[#9BB167] shadow-lg mt-6 rounded-[15px]">
            <Text className="text-[#F7F4F2] font-bold text-lg">
              {item.form_name}
            </Text>
          </View>
        )}
        keyExtractor={item => item.id.toString()} // Ensure unique key extraction
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </SafeAreaView>
  );
};

export default Form;