import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import BackButton from './backButton'; // Ensure this path is correct
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const BrownPageTitlePortion = ({ title }) => {
  const navigation = useNavigation(); // Initialize navigation

  return (
    <View className="bg-mindful-brown-100 p-4 rounded-b-[32] h-[140]">
    <BackButton title={title} />
  </View>
  );
};

export default BrownPageTitlePortion;