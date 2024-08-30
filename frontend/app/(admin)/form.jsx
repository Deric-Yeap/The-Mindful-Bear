import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBrownSearchBar from '../../components/topBrownSearchBar'; 
import StatusBarComponent from '../../components/darkThemStatusBar'; 
import { Link } from 'expo-router';
import axiosInstance from '../../common/axiosInstance'; 
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the arrow icon

const Form = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [forms, setForms] = useState([]);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axiosInstance.get('form/get');
        console.log('Fetched data:', response);
        setForms(response);
      } catch (error) {
        console.error('Error fetching data:', error.response ? error.response.data : error.message);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

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
      <StatusBarComponent barStyle="light-content" backgroundColor="#251404" />
      <TopBrownSearchBar title="Form Management" />
        
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
            <Link href={`/updateform/${item.id}`} asChild>
              <TouchableOpacity className="w-full h-auto p-4 flex-row justify-between items-center bg-[#9BB167] shadow-lg mt-6 rounded-[15px]">
                <View>
                  <Text className="text-[#F7F4F2] font-bold text-lg">
                    {item.form_name}
                  </Text>
                  <Text className="text-[#F7F4F2] text-md font-bold">
                    {item.store_responses ? "Store User Response" : "Don't Store Response"}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#F7F4F2" />
              </TouchableOpacity>
            </Link>
          )}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      )}
    </SafeAreaView>
  );
};

export default Form;