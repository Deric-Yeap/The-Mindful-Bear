import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { getForms } from '../../api/form';
import { ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const Questionaire = () => {
  const { sessionStarted, formData, sessionID } = useLocalSearchParams(); 
  const [sessionData, setSessionData] = useState({});
  const [forms, setForms] = useState([]);
  const router = useRouter();
  const images = [
    require('../../../frontend/assets/young-man-practicing-yoga-exercises-mental-body-health.png'),
    require('../../../frontend/assets/self-care-health-concept.png')
  ];

  useEffect(() => {
    if (formData) {
      setSessionData(JSON.parse(formData)); // Parse the formData and set it to the form state
    }
  }, [formData]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getForms();
        const filteredForms = response.filter(form => form.is_presession);
        setForms(filteredForms);
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    };

    fetchData();
  }, []);
  return (
    <ScrollView className="flex-1 bg-optimistic-gray-10">
      <View className="flex-1 p-6 bg-optimistic-gray-10">
        {/* Title */}
        <Text className="text-center text-2xl font-urbanist-bold text-mindful-brown-90">Before We Begin...</Text>
        
        {/* Subtitle */}
        <Text className="text-center text-lg font-urbanist-bold text-optimistic-gray-80 mt-4 mb-8">
          We will be assessing your mood based on the following questionnaires.
        </Text>

        {/* Dynamically display the forms */}
        <View className="space-y-4">
          {forms.map((form, index) => (
            <TouchableOpacity 
              key={form.id}
              className="bg-white p-2 rounded-3xl flex-row items-start justify-between"
              onPress={() =>  router.push({
                pathname: `/questions/${form.id}`,       
                params: { sessionStarted: true, formData: JSON.stringify(sessionData), sessionID: sessionID },          
                })
              }
            >

              <Text className="text-xl font-urbanist-bold text-mindful-brown-100 ml-4 mt-4">
                {form.form_name}
              </Text>

              <Image
                source={images[index % 2]}
                className="w-48 h-48"
                resizeMode="contain"
              />
            </TouchableOpacity>

          ))}
        </View>

        {/* Start Button */}
        <TouchableOpacity 
          className="mt-8 bg-mindful-brown-80 py-4 rounded-full items-center"
          onPress={() =>  router.push({
            pathname: '/map',
            params: { sessionStarted: true, formData: JSON.stringify(sessionData) }, 
          })}
        >
          <Text className="text-white text-lg font-urbanist-bold">Start →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
export default Questionaire;
