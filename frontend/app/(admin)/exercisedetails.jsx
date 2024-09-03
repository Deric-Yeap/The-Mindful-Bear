import React, { useState } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import StatusBarComponent from '../../components/darkThemStatusBar';
import BrownPageTitlePortion from '../../components/brownPageTitlePortion';
import FormField from '../../components/formField';
import MultiselectDropdown from '../../components/multiselectDropdown'; // Import your MultiselectDropdown component
import { colors } from '../../common/styles';
const ExerciseDetails = () => {
  const route = useRoute();
  const exercise = JSON.parse(route.params.exercise);

  const exerciseName = exercise.exercise_name || "";
  const description = exercise.description || "";
  const audioFileName = exercise.audio_url || "audio is empty.mp4";

  // Prepare the landmarks data for the dropdown
  const landmarks = exercise.landmarks.map((landmark) => ({
    key: landmark.landmark_id,
    value: landmark.landmark_name,
  }));

  const [selectedLandmarks, setSelectedLandmarks] = useState(
    exercise.landmarks.map((landmark) => landmark.landmark_name)
  );

  const handleLandmarkSelect = (selectedItems) => {
    setSelectedLandmarks(selectedItems);
  };

  return (
    <SafeAreaView className="flex-1 bg-optimistic-gray-10">
     <StatusBarComponent
        barStyle="light-content"
        backgroundColor={colors.mindfulBrown100}
      />
      <BrownPageTitlePortion title="Exercise Management" />

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Exercise Name Section */}
        <FormField
          title="Exercise Name"
          iconName="form-select"
          value={exerciseName}
          handleChange={(value) => {}}
          customStyles="mb-4 m-4"
          editable={false} // Non-editable
        />

        {/* Description Section */}
        <View className="mb-4 px-4">
          <FormField
            iconName="text-box-outline"
            title="Description"
            value={description}
            handleChange={(value) => {}}
            customStyles="mx-0"
            editable={false} // Non-editable
            multiline={true} // Enable multiline input
            numberOfLines={4} // Specify a default number of lines
            textAlignVertical="top" // Align text at the top
            style={{
              minHeight: 50, // Set a minimum height
              maxHeight: 200, // Set a maximum height
            }}
          />
        </View>

        {/* Upload Audio Section */}
        <View className="flex-row justify-between items-center mb-6 mx-4">
          <View className="flex-1 flex-row justify-center items-center bg-serenity-green-50 rounded-full py-3 mr-4 shadow-lg">
            <Text className="text-white text-lg">Upload Audio</Text>
          </View>
          <Text className="text-mindful-brown-100 text-lg">{audioFileName}</Text>
        </View>

        {/* Assign to Landmark Section */}
        <View className="mb-4 px-4"> 
          <MultiselectDropdown
            title="Assigned Landmarks"
            data={landmarks}
            placeHolder="Select Landmarks"
            handleSelect={handleLandmarkSelect}
            selectedItems={selectedLandmarks}
            disabled={true} // Disable selection
          />
        </View>

        {/* Buttons Container */}
        <View className="flex-row justify-between mt-10 px-4">
          {/* Change Button */}
          <View className="bg-mindful-brown-70 rounded-full py-3 flex-1 justify-center items-center shadow-lg mr-2">
            <Text className="text-optimistic-gray-10 text-lg font-bold">Change</Text>
          </View>

          {/* Delete Button */}
          <View className="bg-optimistic-gray-60 rounded-full py-3 flex-1 justify-center items-center shadow-lg ml-2">
            <Text className="text-optimistic-gray-10 text-lg font-bold">Delete</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default ExerciseDetails;
