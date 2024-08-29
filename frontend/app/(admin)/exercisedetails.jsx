import React from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { colors } from '../../common/styles';
import TopBrownSearchBar from '../../components/topBrownSearchBar';

const ExerciseDetails = () => {

  const route = useRoute();
  console.log('Route Params:', route.params); // Log route params to inspect the content

  const exercise = JSON.parse(route.params.exercise); // Parse the string back to an object
  console.log('Exercise received:', exercise);

  const exerciseName = exercise.exercise_name || "dd"; // Fallback to empty string if description is missing
  const description = exercise.description || "ii";
  const audioFileName = exercise.audio_url || "audio is empty.mp4"; // Fallback if audio_url is empty
  console.log('Exercise ID:', exerciseName);
  
  const error = null;  // No error handling needed since editing is removed

  return (
    <SafeAreaView className="flex-1 bg-optimistic-gray-10">
      <ScrollView className="flex-1 bg-optimistic-gray-10">
        <TopBrownSearchBar title="Exercise Management" />
        
        <View className="px-4 pt-5 pb-10">
          {/* Exercise Name Section */}
          <Text className="text-mindful-brown-80 text-lg mb-3">Exercise Name</Text>
          <View className="bg-optimistic-gray-20 rounded-3xl px-4 py-3 mb-6">
            <TextInput
              value={exerciseName}
              editable={false}  // Non-editable
              placeholder="Enter exercise name"  // Clear placeholder for better visibility
              className="text-mindful-brown-80"
              placeholderTextColor={colors.optimisticGray100}
              style={{ backgroundColor: 'transparent' }}
            />
          </View>

          {/* Description Section */}
          <Text className="text-mindful-brown-80 text-lg mb-3">Description</Text>
          <View className="bg-optimistic-gray-30 rounded-[32px] p-3 mb-6">
            <View className="bg-optimistic-gray-20 border-optimistic-gray-30 rounded-2xl border px-4 py-3">
              <TextInput
                value={description}
                editable={false}  // Non-editable
                multiline
                placeholder="Enter description here"  // Clear placeholder for better visibility
                className="text-mindful-brown-100"
                placeholderTextColor={colors.optimisticGray50}
                style={{ backgroundColor: 'transparent' }}
              />
            </View>
          </View>

          {/* Error Message */}
          {error && (
            <Text className="text-present-red-50 mb-3">{error}</Text>
          )}

          {/* Upload Audio Section */}
          <View className="flex-row justify-between items-center mb-6">
            <View className="flex-1 flex-row justify-center items-center bg-serenity-green-50 rounded-full py-3 mr-4 shadow-lg">
              <Text className="text-white text-lg">Upload Audio</Text>
            </View>
            <Text className="text-mindful-brown-100 text-lg">{audioFileName}</Text> 
          </View>

          {/* Assign to Landmark Section */}
          <Text className="text-mindful-brown-100 text-lg mb-3">Assign to which landmark?</Text>
          <View className="w-[187px] flex-row justify-between items-center bg-serenity-green-50 rounded-lg px-4 py-3 mb-12 shadow-lg">
            <Text className="text-white text-lg">Select Landmark</Text>
          </View>

          {/* Change Button */}
          <View className="bg-mindful-brown-80 rounded-full py-4 w-2/3 self-center flex-row justify-center items-center shadow-lg">
            <Text className="text-optimistic-gray-10 text-lg font-bold">Change</Text>
          </View>

           {/* Add margin here */}
           <View className="my-2"></View>

          {/* Delete Button */}
          <View className="bg-optimistic-gray-80 rounded-full py-4 w-2/3 self-center flex-row justify-center items-center shadow-lg">
            <Text className="text-optimistic-gray-10 text-lg font-bold">Delete</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExerciseDetails;
