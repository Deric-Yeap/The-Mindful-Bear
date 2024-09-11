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
import * as DocumentPicker from 'expo-document-picker';

// import AWS from 'aws-sdk';
// import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_REGION_NAME , AWS_STORAGE_BUCKET_NAME } from '@env';

// import { upload_fileobj } 
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
  const [audioURL, setaudioURL] = useState("");
  const [audioFileName, setAudioFileName] = useState("");

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
        console.log("submitted data" , exerciseData)
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
    setAudioFileName('');
  };

  const truncateFileName = (fileName) => {
    const maxLength = 20;
    return fileName.length > maxLength ? `${fileName.substring(0, maxLength)}...` : fileName;
  };

 
  
      
      
  

  const handleAudioUpload = async () => {
    try {
      console.log("upload button clicked")
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      console.log("DocumentPicker result:", result);

  //     if (!result.canceled && result.assets && result.assets.length > 0) {
  //       const selectedFile = result.assets[0];
  //       setaudioURL(selectedFile.uri);
  //       setAudioFileName(truncateFileName(selectedFile.name));
  //       console.log("Selected audio file URI:", selectedFile.uri);
  //     } else {
  //       console.log("DocumentPicker result canceled or no assets found");
  //     }
  //   } catch (error) {
  //     console.error('Error picking audio file:', error);
  //   }
  // };
//   if (!result.canceled && result.uri) {
//     const selectedFile = result.uri;
//     const fileName = result.name;
//     const fileType = result.mimeType;

//     // Step 1: Get signed URL from backend
//     const response = await fetch(`https://the-mindful-bear.s3.ap-southeast-1.amazonaws.com/sign-s3?fileName=${fileName}&fileType=${fileType}`);
//     const { signedRequest, url } = await response.json();

//     // Step 2: Upload file directly to S3
//     const fileUploadResponse = await fetch(signedRequest, {
//       method: 'PUT',
//       body: await fetch(selectedFile).then(res => res.blob()),
//       headers: {
//         'Content-Type': fileType,
//       },
//     });

//     if (fileUploadResponse.ok) {
//       // Successfully uploaded file to S3
//       setaudioURL(url); // Store S3 URL
//       setAudioFileName(truncateFileName(fileName));
//       Alert.alert("File uploaded successfully");
//     } else {
//       throw new Error('Upload to S3 failed');
//     }
//   }
// } catch (error) {
//   console.error('Error uploading audio file:', error);
//   Alert.alert('Error uploading file:', error.message);
// }
// };

if (!result.canceled && result.assets && result.assets.length > 0) {
  const selectedFile = result.assets[0];
  console.log("Selected audio file:", selectedFile);

  // Log file URI and name
  console.log("File URI:", selectedFile.uri);
  console.log("File Name:", selectedFile.name);
  console.log("File Type:", selectedFile.mimeType);

  // Now upload the file to your server or S3
  const { uri, name, mimeType } = selectedFile;
  
  const formData = new FormData();
  formData.append('file', {
    uri: uri,
    name: name,
    type: mimeType,
  });

  console.log("Form data created:", formData);

  // Sending to the server
  const response = await fetch('https://the-mindful-bear.s3.ap-southeast-1.amazonaws.com/sign-s3', {
    method: 'PUT',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  console.log("Response from server:", response);

  if (response.ok) {
    const data = await response.json();
    console.log("Server response data:", data);

    // Set the audio URL to the S3 URL returned from the server
    setaudioURL(data.url);
    setAudioFileName(truncateFileName(name));

    console.log("Audio uploaded successfully, S3 URL:", data.url);
  } else {
    console.error("Server returned an error:", response.statusText);
  }
  } else {
    console.log("DocumentPicker result canceled or no assets found");
   }
  } catch (error) {
  console.error("Error picking audio file:", error);
   }
  };

//   if (!result.canceled && result.assets && result.assets.length > 0) {
//     const selectedFile = result.assets[0];
//     const fileUri = selectedFile.uri;
//     const fileName = selectedFile.name;

//     // Upload the file to S3
//     // const s3 = new AWS.S3({
//     //   accessKeyId: AWS_ACCESS_KEY_ID,
//     //   secretAccessKey: AWS_SECRET_ACCESS_KEY,
//     //   region: AWS_S3_REGION_NAME,
//     // });

//     // const response = await fetch(fileUri);
//     // console.log("response", response)
//     // const blob = await response.blob();

//     // const params = {
//     //   Bucket: AWS_STORAGE_BUCKET_NAME,
//     //   Key: fileName,
//     //   Body: blob,
//     //   ContentType: selectedFile.mimeType,
//     // };

//     // console.log("Uploading file to S3:", params);

//     const formData = new FormData();
//         formData.append('file', {
//           uri: fileUri,
//           name: fileName,
//           type: selectedFile.mimeType,
//         });

//         const response = await fetch('s3://the-mindful-bear/exercises/upload-audio/', {
//           method: 'POST',
//           body: formData,
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         });

//         const data = await response.json();
        

    
//       if (!response.ok) {
//         console.error('Error uploading file:', err);
//         Alert.alert('Error uploading file:', err.message);
//       } else {
//         console.log('File uploaded successfully:', data.Location);
//         setaudioURL(data.Location);
//         setAudioFileName(truncateFileName(fileName));
//       }
//     } else {
//       console.log("DocumentPicker result canceled or no assets found");
//     }
//   } catch (error) {
//     console.error('Error picking audio file:', error);
//   }
// };
 

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

          <View className="flex-row items-center my-4 px-4 w-full">
              <TouchableOpacity className="bg-serenity-green-50 rounded-full py-2 px-4 mr-4 shadow-lg" onPress={handleAudioUpload}>
                <Text className="text-white text-lg">Upload Audio</Text>
              </TouchableOpacity>
              <Text className="underline text-mindful-brown-100 text-lg">{audioFileName}</Text>
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
          <View className="mb-4 px-4 w-full">
            <CustomButton
              className="mt-2 w-full"
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
