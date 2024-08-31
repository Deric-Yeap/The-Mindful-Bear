import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // Importing AntDesign for the arrow

const AssignedExercise = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState('Select Exercise');

  const exercises = [
    { id: '1', name: 'Exercise 1' },
    { id: '2', name: 'Exercise 2' },
    { id: '3', name: 'Exercise 3' },
  ];

  return (
    <View className="px-4 mt-6 w-full text-base font-bold tracking-normal">
      <View className="flex-row justify-start w-[45%]">
        {/* Title */}
        <Text className="self-start text-mindful-brown-80 text-base font-bold">Assigned Exercise</Text>
      </View>

      <View className="flex-row gap-3.5 items-start mt-2 w-full justify-center">
        <View className="relative flex flex-col w-[45%]">
          {/* Dropdown Button */}
          <TouchableOpacity
            onPress={() => setIsVisible(!isVisible)}
            className="relative px-4 py-3 rounded-md bg-serenity-green-30 border border-gray-300"
          >
            <Text className="text-black">{selectedItem}</Text>
            <AntDesign name="down" size={16} color="black" className="absolute right-4 top-1/2 transform -translate-y-1/2" />
          </TouchableOpacity>

          {/* Dropdown Menu */}
          {isVisible && (
            <View className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
              <FlatList
                data={exercises}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedItem(item.name);
                      setIsVisible(false);
                    }}
                    className="p-4 border-b border-gray-200"
                  >
                    <Text>{item.name}</Text>
                  </TouchableOpacity>
                )}
                contentContainerStyle={{ flexGrow: 1 }}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default AssignedExercise;
