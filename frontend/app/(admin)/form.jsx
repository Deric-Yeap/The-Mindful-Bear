import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBrownSearchBar from '../../components/topBrownSearchBar'; 


const User = () => {
  const [userState, setUserState] = useState([
    { name: 'Shaun', key: '1' },
    { name: 'Yoshi', key: '2' },
    { name: 'Mario', key: '3' },
    { name: 'Luigi', key: '4' },
  ]);

  return (
    <SafeAreaView className="flex-1 bg-optimistic-gray-10">
      <TopBrownSearchBar title="Form Management" />
        
     {/* New Row with Text and Button */}
    <View className="flex-row justify-between items-center pt-4 pb-6">
    <Text className="text-mindful-brown-80 font-bold text-3xl">Form</Text>
    <TouchableOpacity className="bg-mindful-brown-80 px-4 py-1 rounded-full">
        <Text className="text-white font-bold text-base">Create Form</Text>
    </TouchableOpacity>
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