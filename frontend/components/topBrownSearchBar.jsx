import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import BackButton from '../components/backButton'; // Ensure this path is correct
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const TopBrownSearchBar = ({ title }) => {
  const navigation = useNavigation(); // Initialize navigation

  return (
    <View className="bg-mindful-brown-100 p-4 pt-20 rounded-b-[32]">
      {/* Ensure the title is rendered with a Text component */}
      <BackButton title={title} />
      <View className="flex-row items-center mt-4">
        <TextInput
          placeholder="Search anything..."
          placeholderTextColor="#F7F4F2"
          className="flex-1 bg-mindful-brown-70 p-3 rounded-full text-white"
        />
        <TouchableOpacity className="ml-2 p-3 bg-mindful-brown-80 rounded-full">
          <MaterialIcons name="search" size={24} color="#F7F4F2" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TopBrownSearchBar;