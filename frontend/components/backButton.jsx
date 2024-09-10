import React from 'react';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import {colors} from '../common/styles';
const BackButton = ({ title, buttonStyle })  => {
    const navigation = useNavigation();

    return (
      <View className={`flex-row items-center ${buttonStyle}`}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-3 bg-mindful-brown-20 rounded-full mr-4"
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.mindfulBrown80} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white">{title}</Text>
      </View>
    );
};

export default BackButton;
