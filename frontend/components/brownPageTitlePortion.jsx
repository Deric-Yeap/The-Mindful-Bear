import React from 'react';
import { View } from 'react-native';
import BackButton from './backButton'; // Ensure this path is correct
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const BrownPageTitlePortion = ({ title, tabName, screenName }) => {
  const navigation = useNavigation(); // Initialize navigation

  return (
    <View className="bg-mindful-brown-100 p-4 rounded-b-3xl h-36 flex justify-center">
      <BackButton title={title} tabName={tabName} screenName={screenName} />
    </View>
  );
};

export default BrownPageTitlePortion;