import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useRoute } from '@react-navigation/native';
import BackButton from '../../components/backButton';
import Dropdown from '../../components/dropdown';
import CustomButton from '../../components/customButton';
import { createLandmark, updateLandmark } from '../../api/landmark';
import { getExercises } from '../../api/exercise';
import ConfirmModal from '../../components/confirmModal';
import { useRouter } from 'expo-router';


const LandmarkCreator = () => {
  const route = useRoute();
  const router = useRouter();
  var { landmark } = route.params || {}; 
  if (landmark) {
    try {
      landmark = JSON.parse(landmark);
    } catch (error) {
      console.error('Error parsing landmark:', error);
      landmark = null; 
    }
  }
  const [landmarkName, setLandmarkName] = useState(landmark?.landmark_name || '');
  const [exerciseId, setExerciseId] = useState(landmark?.exercise?.exercise_id || '');
  const [xCoordinates, setXCoordinates] = useState(landmark?.x_coordinates || '');
  const [yCoordinates, setYCoordinates] = useState(landmark?.y_coordinates || '');
  const [imageFile, setImageFile] = useState({
    uri: landmark?.image_file_url || "https://cdn.builder.io/api/v1/image/assets/TEMP/4b116fb504bae4e96910a8019ffd8338d6215db8183025d8130d5d03956a6e90?apiKey=004e7e3501424a9a9c0fe2fe31f6ca4a&",
    fileName: landmark?.landmark_image_url?.split('/').pop() || "image.jpeg",
    type: "image/" + landmark?.landmark_image_url?.split('.').pop() || "image/jpeg", 
  });
  const [exerciseList, setExerciseList] = useState([]);
  const [selectedExerciseName, setSelectedExerciseName] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);


  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await getExercises();
        setExerciseList(data);
        if (exerciseId) {
          const selectedExercise = data.find(exercise => exercise.exercise_id === exerciseId);          
          setSelectedExerciseName(selectedExercise?.exercise_name || '');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchExercises();    
  }, []);
  const handleChoosePhoto = () => {
    launchImageLibrary({ noData: true }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const file = response.assets[0];
        setImageFile(file);
      }
    });
  };

  const handleSubmit = async () => {
    if (!landmarkName || !exerciseId || !xCoordinates || !yCoordinates || !imageFile) {
      Alert.alert('Please fill in all fields and select an image.');
      return;
    }

    const landmarkData = {
      landmark_name: landmarkName,
      exercise: exerciseId,
      x_coordinates: xCoordinates,
      y_coordinates: yCoordinates,
      image_file: imageFile,
    };    
    
    try {
      if (landmark) {
        await updateLandmark(landmark.landmark_id, landmarkData); 
        setShowSuccess(true); 
        setTimeout(() => {
          setShowSuccess(false);
          router.push('/landmark')  
        }, 3000);
        
        

      } else {
        await createLandmark(landmarkData); 
        setShowSuccess(true); 
        setTimeout(() => {
          setShowSuccess(false);
          
        }, 3000);
        
        resetForm(); 
      }

    } catch (error) {
      console.log(error);
      Alert.alert(`Error ${landmark ? 'updating' : 'creating'} landmark:`, error.message);
    }
  };

  const resetForm = () => {
    setLandmarkName('');
    setExerciseId(null);
    setXCoordinates('');
    setYCoordinates('');
    setImageFile({
      uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/4b116fb504bae4e96910a8019ffd8338d6215db8183025d8130d5d03956a6e90?apiKey=004e7e3501424a9a9c0fe2fe31f6ca4a&",
      fileName: "image.jpeg",
      type: "image/jpeg",
    });
  };

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
      <View className="flex flex-col bg-stone-100 ">
        <View className="bg-mindful-brown-100 p-4 rounded-b-3xl">
          <BackButton title={landmark ? "Modify Landmark" : "Create Landmark"} />
        </View>
        <View className="flex relative flex-col pb-2 w-full aspect-[1.011]">
          <Image
            source={{ uri: imageFile.uri }}
            className="object-cover absolute inset-0 w-full h-full"
          />
          <View className="absolute bottom-0 left-0 w-full p-4 flex-row items-center justify-start">
            <TouchableOpacity onPress={handleChoosePhoto} className="px-3.5 py-1 tracking-normal rounded-3xl bg-mindful-brown-80">
              <Text className="text-white text-base font-bold">Upload Image</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="px-4 mt-4 w-full text-base font-bold tracking-normal">
          <View className="flex-row justify-start w-full mb-4">
            <Text className="self-start text-mindful-brown-80 text-lg font-urbanist-extra-bold">Landmark Name</Text>
          </View>
          <TextInput
            className="px-4 py-3 text-black rounded-3xl bg-zinc-300 w-[95%] mb-4"
            placeholder="Landmark Name"
            value={landmarkName}
            onChangeText={setLandmarkName}
          />
          <View className="flex-row gap-3.5 items-start w-full justify-center mb-4">
            <View className="flex flex-col w-[45%]">
              <Text className="self-start text-mindful-brown-80 text-lg font-urbanist-extra-bold">Coordinate-x</Text>
              <TextInput
                className="mt-4 text-black rounded-3xl bg-zinc-300 px-4 pt-2.5 pb-2.5 h-[41px]"
                placeholder="Coordinate-x"
                value={xCoordinates}
                onChangeText={setXCoordinates}
              />
            </View>
            <View className="flex flex-col w-[45%]">
              <Text className="self-start text-mindful-brown-80 text-lg font-urbanist-extra-bold">Coordinate-y</Text>
              <TextInput
                className="mt-4 text-black rounded-3xl bg-zinc-300 px-4 pt-2.5 pb-2.5 h-[41px]"
                placeholder="Coordinate-y"
                value={yCoordinates}
                onChangeText={setYCoordinates}
              />
            </View>
          </View>
          <View className="mb-4">
            <Dropdown
              key={exerciseId || 'default-key'}
              title="Exercise"
              data={exerciseList.map(exercise => ({
                value: exercise.exercise_name,
                key: exercise.exercise_id
              }))}
              selectedValue={selectedExerciseName}
              placeHolder={selectedExerciseName}
              handleSelect={(selectedValue) => {
                const selectedExercise = exerciseList.find(exercise => exercise.exercise_id === selectedValue);
                setExerciseId(selectedExercise.exercise_id);
              }              
            }
            />
          </View>
          <View className="mb-4">
            <CustomButton
              className="mt-2"
              handlePress={handleSubmit}
              title={landmark ? "Update Landmark" : "Create Landmark"}
            />
          </View>
        </View>
      </View>
       {/* Success Modal */}
       {showSuccess && (
        <ConfirmModal
          title="Success!"
          subTitle={`Landmark ${landmark ? 'updated' : 'created'} successfully.`}
          isConfirmButton={true}
          isCancelButton={false}
        />
      )}
    </ScrollView>
  );
};

export default LandmarkCreator;
