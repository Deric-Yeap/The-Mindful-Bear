import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Alert, Image} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import FormField from '../../components/formField'
import Dropdown from '../../components/dropdown'
import BrownPageTitlePortion from '../../components/brownPageTitlePortion'
import StatusBarComponent from '../../components/darkThemStatusBar'
import CustomButton from '../../components/customButton'
import { createExercise, updateExercise } from '../../api/exercise';
import { getLandmarks } from '../../api/landmark';
// import { CreateFormAndQuestion } from '../../api/form'
// import { listOptionSet } from '../../api/option-set'
import ConfirmModal from '../../components/confirmModal';
import { useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';

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
  //initialise variables for form fields 
  const [exerciseName, setExerciseName] = useState(exercise?.exercise_name || '');
  const [description, setDescription] = useState(exercise?.description || '');
  // const [audioURL, setaudioURL] = useState({uri: exercise?.audio_url || "https://cdn.builder.io/api/v1/image/assets/TEMP/4b116fb504bae4e96910a8019ffd8338d6215db8183025d8130d5d03956a6e90?apiKey=004e7e3501424a9a9c0fe2fe31f6ca4a&",
  // });
  const [audioURL, setaudioURL] = useState("https://cdn.builder.io/api/v1/image/assets/TEMP/4b116fb504bae4e96910a8019ffd8338d6215db8183025d8130d5d03956a6e90?apiKey=004e7e3501424a9a9c0fe2fe31f6ca4a&")

  //for dropdown list of landmarks and selection of landmark (if any)
  const [landmarkId, setLandmarkId] = useState(exercise?.landmark?.landmark_id || '');
  const [landmarkList, setLandmarkList] = useState([]);
  const [selectedLandmarkName, setSelectedLandmarkName] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  //fetch landmarks for dropdown
  useEffect(() => {
    const fetchLandmarks = async () => {
      try {
        const data = await getLandmarks();
        setLandmarkList(data);
        if (landmarkId) {
          const selectedLandmark = data.find(landmark => landmark.exercise_id === landmarkId);          
          setSelectedLandmarkName(prev => [...prev, selectedLandmark?.landmark_name || '']);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchLandmarks();    
  }, []);

  const handleSubmit = async () => {
    if (!exerciseName || !description|| !audioURL) {
      Alert.alert('Please fill in all fields and upload an audio file.');
      return;
    }

    const exerciseData = {
      exercise_name: exerciseName,
      description: description,
      audio_url: audioURL,
    };    
    
    try {
      if (exercise) {
        await updateExercise(exercise.exercise_id, exerciseData); 
        setShowSuccess(true); 
        setTimeout(() => {
          setShowSuccess(false);
          router.push('/exerciseManagement')  
        }, 3000);
        
        

      } else {
        await createExercise(exerciseData); 
        setShowSuccess(true); 
        setTimeout(() => {
          setShowSuccess(false);
          
        }, 3000);
        
        resetForm(); 
      }

    } catch (error) {
      console.log(error);
      Alert.alert(`Error ${exercise ? 'updating' : 'creating'} exercise:`, error.message);
    }
  };

  const resetForm = () => {
    setExerciseName('');
    setLandmarkId(null);
    setDescription('');
    setaudioURL('');
  };

  const truncateURL = (url) => {
    const maxLength = 30;
    return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
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
          handleChange={(value) => setExerciseName(value)}
          customStyles="mb-4 m-4"
        />

        

        {/* Horizontal Line */}
        <View
          style={{ height: 1, backgroundColor: '#A0A0A0', marginVertical: 10 }}
        />

          <View className="mb-2">
            <View className="flex-row justify-between items-center">
              <Text className="text-mindful-brown-80 font-urbanist-extra-bold text-lg mb-2 p-4">
                Description
              </Text>

              
            </View>

            {/* Text Input for Description */}
            <FormField
              iconName="text-box-outline"
              value={description}
              handleChange={(value) => setDescription(value)}
              customStyles="mx-4"
            />

            {/* Audio upload section */}

          <View className="flex-row justify-between items-center mb-6 mx-4">
                    <View className="flex-1 flex-row justify-center items-center bg-serenity-green-50 rounded-full py-3 mr-4 shadow-lg">
                      <Text className="text-white text-lg">Upload Audio</Text>
                    </View>
                    <Text className="text-mindful-brown-100 text-lg">{truncateURL(audioURL)}</Text>
                  </View>
      

            {/* Dropdown List for Assigned Landmark */}
          {exercise && landmarkId && (
            <Dropdown
            key={landmarkId || 'default-key'}
            title="Exercise"
            data={landmarkList.map(landmark => ({
              value: landmark.landmark_name,
              key: landmark.landmark_id
            }))}
            selectedValue={selectedLandmarkName}
            placeHolder={selectedLandmarkName}
            handleSelect={(selectedValue) => {
              const selectedLandmark = landmarkList.find(landmark => landmark.landmark_id === selectedValue);
              setLandmarkId(selectedLandmark.landmark_id);
            }              
          }
          />
          )}
          <View className="mb-4">
            <CustomButton
              className="mt-2"
              handlePress={handleSubmit}
              title={exercise ? "Update Exercise" : "Create Exercise"}
            />
          </View>
        </View>

          {/* Success Modal */}
       {showSuccess && (
        <ConfirmModal
          title="Success!"
          subTitle={`Exercise ${exercise ? 'updated' : 'created'} successfully.`}
          isConfirmButton={true}
          isCancelButton={false}
        />
      )}
       

      </ScrollView>
    </SafeAreaView>
  )
}

export default ExerciseCreator
