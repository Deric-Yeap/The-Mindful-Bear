import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/formField';
import BrownPageTitlePortion from '../../components/brownPageTitlePortion';
import StatusBarComponent from '../../components/darkThemStatusBar';
import CustomButton from '../../components/customButton';
import { createExercise, updateExercise } from '../../api/exercise';
import { getLandmarks } from '../../api/landmark';
import ConfirmModal from '../../components/confirmModal';
import { confirmModal } from '../../assets/image';
import { useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import MultiselectDropdown from '../../components/multiselectDropdown';

const ExerciseCreator = () => {
  const route = useRoute();
  const router = useRouter();
  var { exercise } = route.params || {}; 

  if (exercise) {
    try {
      exercise = JSON.parse(exercise);
    } catch (error) {
      console.error('Error parsing exercise:', error);
      exercise = null; 
    }
  }

  const [exerciseName, setExerciseName] = useState(exercise?.exercise_name || '');
  const [description, setDescription] = useState(exercise?.description || '');
  const [audioFile, setAudioFile] = useState(
    exercise ? { 
      uri: exercise.file_url, 
      name: exercise.audio_url?.split('/').pop(), 
      type: `audio/${exercise.audio_url?.split('.').pop()}` 
    } : {}
  );  
  const [landmarkList, setLandmarkList] = useState([]);
  const [selectedLandmarks, setSelectedLandmarks] = useState([]);
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [allLandmarksAssigned, setAllLandmarksAssigned] = useState(false);

  useEffect(() => {
    const fetchLandmarks = async () => {
      try {
        const data = await getLandmarks();
        const formattedData = data.map(item => ({ key: item.landmark_id, value: item.landmark_name, exercise_id: item.exercise.exercise_id })); 
        console.log('all landmarks list',formattedData)

        // Filter out landmarks that are already assigned to another exercise
        const availableLandmarks = formattedData.filter(item => !item.exercise_id || (exercise && exercise.landmarks.includes(item.key)));
        setLandmarkList(availableLandmarks);
        console.log("available landmarks",availableLandmarks)
        setAllLandmarksAssigned(availableLandmarks.length === 0);
        console.log("are all landmarks assigned?",allLandmarksAssigned);
  
        if (exercise?.landmarks) {
          setSelectedLandmarks(exercise.landmarks
            .map(key => {
              const foundLandmark = availableLandmarks.find(item => item.key === key);
              return foundLandmark ? foundLandmark.value : null;
            })
            .filter(value => value !== null)
          )
          console.log(selectedLandmarks);
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchLandmarks();    
  }, []);

  const handleSubmit = async () => {
    if (!exerciseName || !description || !audioFile?.uri) {
      Alert.alert('Please fill in all fields and upload an audio file.');
      return;
    }

    const exerciseData = {
      exercise_name: exerciseName,
      description: description,
      audio_file: audioFile,
      landmarks: selectedLandmarks.map(item => item.key),
    };    
    
    try {
      if (exercise) {
        await updateExercise(exercise.exercise_id, exerciseData); 
        setShowSuccess(true); 
      } else {
        await createExercise(exerciseData); 
        setShowSuccess(true); 
        resetForm(); 
      }
    } catch (error) {
      console.error(error);
      Alert.alert(`Error ${exercise ? 'updating' : 'creating'} exercise:`, error.message);
    }
  };

  const resetForm = () => {
    setExerciseName('');    
    setDescription('');
    setAudioFile({});
    setSelectedLandmarks([]);
  };

  const truncateFileName = (fileName) => {
    if (!fileName) return "No Audio File";
    const maxLength = 20;
    return fileName.length > maxLength ? `${fileName.substring(0, maxLength)}...` : fileName;
  };

  const handleAudioUpload = async () => {
    try {    
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });      

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedFile = result.assets[0];
  
        setAudioFile({
          uri: selectedFile.uri,    
          name: selectedFile.name,
          type: selectedFile.mimeType,
        });        
      } else {
        console.error("Server returned an error:", result.error);
      }
    } catch (error) {
      console.error("Error picking audio file:", error);
    }
  };

  const handleConfirm = () => {
    setShowSuccess(false);   
    if (exercise) {    
      router.push('/exercisemanagement');  
    }    
  };

  const handleLandmarkSelect = (newSelectedItems) => {
    setSelectedLandmarks(newSelectedItems);
  };

  return (
    <SafeAreaView className="flex-1 bg-optimistic-gray-10">
      <StatusBarComponent barStyle="light-content" backgroundColor="#251404" />
      <BrownPageTitlePortion title="Exercise Management" />
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <FormField
          title="Exercise Name"
          iconName="form-select"
          value={exerciseName}
          handleChange={setExerciseName}
          customStyles="mb-4 m-4"
        />
        <View className="flex-row justify-between items-center">
          <Text className="text-mindful-brown-80 font-urbanist-extra-bold text-lg mb-2 p-4">
            Description
          </Text>
        </View>
        <FormField
          iconName="text-box-outline"
          value={description}
          handleChange={setDescription}
          customStyles="mx-4"
        />
        <View className="flex-row items-center my-4 px-4 w-full">
          <TouchableOpacity className="bg-serenity-green-50 rounded-full py-2 px-4 mr-4 shadow-lg" onPress={handleAudioUpload}>
            <Text className="text-white text-lg">Upload Audio</Text>
          </TouchableOpacity>
          <Text className="underline text-mindful-brown-100 text-lg">{truncateFileName(audioFile.name)}</Text>
        </View>  
        <View className="flex-row items-center my-4 px-4 w-full">
          {/* <MultiselectDropdown            
            title="Assigned Landmarks"
            data={landmarkList}
            placeHolder="Select Landmarks"
            handleSelect={handleLandmarkSelect}
            selectedItems={selectedLandmarks}
            disabled={false}
          /> */}
          {allLandmarksAssigned ? (
            exercise ? (
              <Text className="text-mindful-brown-100 text-lg">All landmarks have been assigned an exercise</Text>
            ) : (
              <View style={{ height: 20 }} /> // Blank space
            )
          ) : (
            <MultiselectDropdown            
              title="Assigned Landmarks"
              data={landmarkList}
              placeHolder="Select Landmarks"
              handleSelect={handleLandmarkSelect}
              selectedItems={selectedLandmarks}
              disabled={false}
            />
          )}
        </View>
        <View className="mb-4 px-4 w-full">
          <CustomButton
            className="mt-2 w-full"
            handlePress={handleSubmit}
            title={exercise ? "Update Exercise" : "Create Exercise"}
          />
        </View>        
      </ScrollView>
      {showSuccess && (
        <ConfirmModal
          isConfirmButton={true}
          isCancelButton={false}
          imageSource={confirmModal}
          confirmButtonTitle={'Confirm'}
          title={'Success!'}
          subTitle={`Exercise ${exercise ? 'updated' : 'created'} successfully.`}
          handleConfirm={handleConfirm}
        />
      )}
    </SafeAreaView>
  );
};

export default ExerciseCreator;
