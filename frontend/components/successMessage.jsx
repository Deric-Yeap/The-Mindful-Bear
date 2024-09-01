import React from 'react';
import { View, Text } from 'react-native';
import LottieView from 'lottie-react-native';

const SuccessMessage = ({ title }) => {
  return (
    <View className="flex-1 justify-center items-center">
      <LottieView
        source={require('../assets/bearOnWater.json')}
        autoPlay
        loop
        className="w-full h-full" // Approximately 200px
      />
    </View>
  );
};

export default SuccessMessage;