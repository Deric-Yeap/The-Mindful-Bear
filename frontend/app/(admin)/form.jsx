import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import BackButton from '../../components/backButton';

const User = () => {
  const [userState, setUserState] = useState([
    { name: 'Shaun', key: '1' },
    { name: 'Yoshi', key: '2' },
    { name: 'Mario', key: '3' },
    { name: 'Luigi', key: '4' },
  ]);

  return (
    <SafeAreaView className="flex-1 bg-optimistic-gray-10">
      <View className="bg-mindful-brown-100 p-4 rounded-b-3xl w-full">
        <BackButton title="Form Management" />
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

      <FlatList
        data={userState}
        renderItem={({ item }) => (
          <View className="w-full h-16 p-4 items-start bg-[#9BB167] shadow-lg mt-6 rounded-[15px]">
            <Text className="text-[#F7F4F2] font-bold text-lg">
              {item.name}
            </Text>
          </View>
        )}
        keyExtractor={item => item.key}
        contentContainerStyle={{ paddingHorizontal: 16 }} // Optional: Add horizontal padding to the FlatList
      />
    </SafeAreaView>
  );
};

export default User;