import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { colors } from '../../common/styles';
import TopBrownSearchBar from '../../components/topBrownSearchBar';

const ExerciseDetails = () => {
  const route = useRoute();
  const { exercise } = route.params;

  const [isEditing, setIsEditing] = useState(false);
  const [exerciseName, setExerciseName] = useState(exercise.description); // Use exercise.description for the name as placeholder
  const [description, setDescription] = useState(exercise.description);
  const [error, setError] = useState(null);  // Initialize the error state

  const handleSave = () => {
    if (!exerciseName.trim()) {
      setError('Exercise name cannot be empty.');
      return;
    }
    // Reset error and set to non-editable mode
    setError(null);
    setIsEditing(false);
    // API call or further processing for saving changes can be done here
    console.log('Saved:', { exerciseName, description });
  };

  return (
    <SafeAreaView className="flex-1 bg-optimistic-gray-10">
      <ScrollView className="flex-1 bg-optimistic-gray-10 rounded-[40px]">
        <TopBrownSearchBar title="Exercise Management" />
        
        <View className="px-4 pt-5 pb-10">
          {/* Exercise Name Section */}
          <Text className="text-mindful-brown-100 text-lg mb-3">Exercise Name</Text>
          <View className="bg-gray-300 rounded-3xl px-4 py-3 mb-6">
            <TextInput
              value={exerciseName}
              editable={isEditing}
              onChangeText={setExerciseName}
              placeholder={exercise.description}  // Placeholder from API
              className="text-mindful-brown-100"
              placeholderTextColor={colors.optimisticGr}
              style={{ backgroundColor: isEditing ? colors.optimisticGray20 : 'transparent' }}
            />
          </View>

          {/* Description Section */}
          <Text className="text-mindful-brown-100 text-lg mb-3">Description</Text>
          <View className="bg-white rounded-[32px] p-4 mb-6">
            <View className="bg-optimistic-gray-10 border-mindful-brown-100 rounded-2xl border px-4 py-3">
              <TextInput
                value={description}
                editable={isEditing}
                onChangeText={setDescription}
                multiline
                placeholder={exercise.description}  // Placeholder from API
                className="text-mindful-brown-100"
                placeholderTextColor={colors.optimisticGray50}
                style={{ backgroundColor: isEditing ? colors.optimisticGray20 : 'transparent' }}
              />
            </View>
          </View>

          {/* Error Message */}
          {error && (
            <Text className="text-red-500 mb-3">{error}</Text>
          )}

          {/* Upload Audio Section */}
          <View className="flex-row justify-between items-center mb-6">
            <TouchableOpacity className="w-1/2 flex-row justify-center items-center bg-serenity-green-50 rounded-full py-3 mr-4 shadow-lg">
              <Text className="text-white text-lg">Upload Audio</Text>
            </TouchableOpacity>
            <Text className="text-mindful-brown-100 text-lg">123.mp4</Text>
          </View>

          {/* Assign to Landmark Section */}
          <Text className="text-mindful-brown-100 text-lg mb-3">Assign to which landmark?</Text>
          <TouchableOpacity className="w-[187px] flex-row justify-between items-center bg-serenity-green-50 rounded-lg px-4 py-3 mb-12 shadow-lg">
            <Text className="text-white text-lg">Select Landmark</Text>
          </TouchableOpacity>

          {/* Save/Change Button */}
          <TouchableOpacity
            onPress={isEditing ? handleSave : () => setIsEditing(true)}
            className="bg-mindful-brown-100 rounded-full py-5 flex-row justify-center items-center shadow-lg"
          >
            <Text className="text-white text-lg">{isEditing ? 'Save' : 'Change'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExerciseDetails;
