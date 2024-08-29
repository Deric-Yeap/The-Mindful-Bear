import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import TopBrownSearchBar from '../../components/topBrownSearchBar'; 
import StatusBarComponent from '../../components/darkThemStatusBar'; 

const Landmark = () => {
  return (
    <SafeAreaView className="flex-1 bg-optimistic-gray-10">
      <StatusBarComponent barStyle="light-content" backgroundColor="#251404" />
    <TopBrownSearchBar title="Landmark Management" />
      <ScrollView className="px-4 mt-4">
        <Text className="text-mindful-brown-80 font-bold text-3xl mb-4">Create New Landmark</Text>
        <View className="flex-wrap flex-row justify-between">
          {['Landmark 1', 'Landmark 2', 'Landmark 3', 'Landmark 4'].map((landmark, index) => (
            <View key={index} className="bg-mindful-brown-20 rounded-2xl w-[48%] mb-4">
              <Image
                source={{ uri: 'https://path-to-image' }}  // Replace with your image path
                className="h-40 w-full rounded-t-2xl"
                resizeMode="cover"
              />
              <View className="p-3">
                <Text className="text-mindful-brown-100 font-urbanist-bold">{landmark}</Text>
                <View className="flex-row justify-between mt-2">
                  <TouchableOpacity className="bg-mindful-brown-50 px-3 py-1 rounded-full">
                    <Text className="text-white font-urbanist-bold">Modify</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="bg-mindful-brown-50 px-3 py-1 rounded-full">
                    <Text className="text-white font-urbanist-bold">Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Landmark;
