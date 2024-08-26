import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBrownSearchBar from '../../components/topBrownSearchBar'; 
import { Link } from 'expo-router';

const Form = () => {
  const [userState, setUserState] = useState([
    { name: 'Shaun', key: '1' },
    { name: 'Yoshi', key: '2' },
    { name: 'Mario', key: '3' },
    { name: 'Luigi', key: '4' },
    { name: 'Hui Min', key: '5' },
  ]);

  return (
    <SafeAreaView className="flex-1 bg-optimistic-gray-10">
      <TopBrownSearchBar title="Form Management" />
        
      {/* New Row with Text and Button */}
      <View className="flex-row justify-between items-center pt-4 pb-0 px-4">
        <Text className="text-mindful-brown-80 font-bold text-3xl">Form</Text>
        <Link href="/create-form" asChild>
        <TouchableOpacity className="bg-mindful-brown-80 px-4 py-1 rounded-full">
          <Text className="text-white font-bold text-base">Create Form</Text>
        </TouchableOpacity>
        </Link>
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
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </SafeAreaView>
  );
};

export default Form;