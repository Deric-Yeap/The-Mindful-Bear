import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../../components/backButton';
import SearchBar from '../../components/searchBar';
import { getLandmarks, deleteLandmark } from '../../api/landmark';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link } from 'expo-router';
import TopBrownSearchBar from '../../components/topBrownSearchBar'; 
import StatusBarComponent from '../../components/darkThemStatusBar'; 
import CustomButton from '../../components/customButton';
import SuccessMessage from '../../components/successMessage';
import ConfirmModal from '../../components/confirmModal';
import { colors } from '../../common/styles';

const Landmark = () => {  
  const [landmarks, setLandmarks] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  
  useEffect(() => {
    const fetchLandmarks = async () => {
      try {
        const data = await getLandmarks();        
        setLandmarks(data);        
      } catch (error) {
        console.error(error);
      }
    };

    fetchLandmarks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteLandmark(id);   
      setLandmarks((prevLandmarks) => prevLandmarks.filter((landmark) => landmark.landmark_id !== id));
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      
    } catch (error) {
        console.error('Error:', error.message);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-optimistic-gray-10">
      <StatusBarComponent barStyle="light-content" backgroundColor={colors.mindfulBrown100} />
    <TopBrownSearchBar title="Landmark Management" />
    {showSuccess && (
        <ConfirmModal
          title="Success!"
          subTitle="Landmark deleted successfully."
          isConfirmButton={true}
          isCancelButton={false}
        />
      )}

      <ScrollView className="px-4 mt-4">
        <Link href="/landmarkCreator" asChild>
          <TouchableOpacity className="mb-4">
            <Text className="text-serenity-green-70 font-urbanist-bold text-lg mb-4">Create New Landmark</Text>
          </TouchableOpacity>
        </Link>
        
        <View className="flex-wrap flex-row justify-between">
          {landmarks.map((landmark, index) => (
            
            <View key={index} className="bg-mindful-brown-20 rounded-2xl w-[48%] mb-4">
              <Image
                
                source={{ uri: landmark.image_file_url }} 
                className="h-40 w-full rounded-t-2xl"                
                resizeMode="cover"
                onError={(e) => console.log('Image failed to load', e.nativeEvent.error)}
              />
              <View className="p-3 rounded-b-2xl bg-mindful-brown-60">
                <Text className="text-white font-urbanist-bold text-lg">{landmark.landmark_name}</Text>
                <View className="flex-row justify-between mt-2">
                  <Link href={`/landmarkCreator?landmark=${encodeURIComponent(JSON.stringify(landmark))}`} asChild>
                    <TouchableOpacity className="bg-mindful-brown-50 px-3 py-1 rounded-full">
                      <Text className="text-mindful-brown-100 font-urbanist-bold">Modify</Text>
                    </TouchableOpacity>
                  </Link>
                  <TouchableOpacity
                    onPress={() => handleDelete(landmark.landmark_id)}
                    className="bg-mindful-brown-50 px-3 py-1 rounded-full"
                  >
                    <Text className="text-mindful-brown-100 font-urbanist-bold">Delete</Text>
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
