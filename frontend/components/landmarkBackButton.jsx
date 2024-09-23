import React from 'react';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import {colors} from '../common/styles';
import { useRouter } from 'expo-router'; // Import the useRouter hook
const LandmarkBackButton = ({ title, buttonStyle, route})  => {

    const router = useRouter(); // Initialize the router    
    return ( 
      <View className={`flex-row items-center ${buttonStyle}`}>
        <TouchableOpacity
          onPress={() => router.push(route)}
          className="p-3 bg-mindful-brown-20 rounded-full mr-4"
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.mindfulBrown80} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white">{title}</Text>
      </View>
    );
};

export default LandmarkBackButton;
