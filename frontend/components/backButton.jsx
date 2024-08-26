import React from 'react';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

const BackButton = ({ title })  => {
    const navigation = useNavigation();

    return (
      <View className="flex-row items-center p-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-3 bg-mindful-brown-80 rounded-full mr-2"
        >
          <MaterialIcons name="arrow-back" size={24} color="#F7F4F2" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white">{title}</Text>
      </View>
    );
};

export default BackButton;
