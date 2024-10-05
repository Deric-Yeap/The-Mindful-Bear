import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import { getFavouriteLandmarks } from '../api/landmark';

const Favourite = () => {
  const [landmarks, setLandmarks] = useState([]);

  useEffect(() => {
    // Fetch favourite landmarks
    const fetchFavourites = async () => {
      try {
        const response = await getFavouriteLandmarks();
        setLandmarks(response);
      } catch (error) {
        console.error("Failed to fetch landmarks", error);
      }
    };

    fetchFavourites();
  }, []);

  return (
    <ScrollView className="flex-1 p-6 bg-optimistic-gray-10 mt-4">
      <Text className="text-2xl font-urbanist-black text-empathy-orange-100 mb-6">Favourite Landmarks</Text>
      {landmarks.length === 0 ? (
        <Text className="font-urbanist-bold text-optimistic-gray-80">No favourite landmarks available.</Text>
      ) : (
        landmarks.map((landmark) => (
          <View key={landmark.landmark_id} className="mb-6 rounded-xl overflow-hidden border border-mindful-brown-30 shadow-lg">
            <ImageBackground
              source={{ uri: landmark.image_file_url }}
              style={{ width: '100%', height: 200, justifyContent: 'flex-end' }}
              className="rounded-lg"
            >
              <View className="p-4 bg-black/50 h-full flex justify-between">
                <View>
                  <Text numberOfLines={1} className="text-lg font-urbanist-black text-white">
                    {landmark.landmark_name}
                  </Text>
                  <Text numberOfLines={2} className="font-urbanist-bold text-white">
                    {landmark.landmark_description}
                  </Text>
                </View>
                <TouchableOpacity className="bg-empathy-orange-50 p-2 rounded-lg mt-4">
                  <Text className="text-white font-urbanist-bold text-center">View Details</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default Favourite;
