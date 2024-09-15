import React, { useState, useRef, useMemo } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { colors } from '../common/styles'
import { Image } from 'expo-image'
import CustomButton from './customButton'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { Audio } from 'expo-av'

const BottomSheetModal = ({ handleModalOpen, landmarkData }) => {
  const landmarkIcons = [
    {
      icon: 'eye',
      value: '200k',
      color: colors.serenityGreen50,
    },
    {
      icon: 'account',
      value: '4',
      color: colors.optimisticGray30,
    },
    {
      icon: 'clock',
      value: '4min',
      color: '#4C72AB',
    },
  ]
  const exerciseIcons = [
    {
      icon: 'star',
      value: '4.5',
      color: colors.zenYellow40,
    },
    {
      icon: 'account',
      value: '4',
      color: colors.optimisticGray30,
    },
    {
      icon: 'clock',
      value: '10min',
      color: '#4C72AB',
    },
  ]
  const [sound, setSound] = useState();
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const data = landmarkData?.properties;

  const playAudio = async () => {
    if (!data?.exercise_audio_url) {
      console.error('No audio URL provided');
      return;
    }

    setIsLoading(true); // Start loading

    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: data.exercise_audio_url },
        { shouldPlay: true } // Auto-play when loaded
      );
      setSound(sound);

      // Play the sound
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // Unload the audio when the component is unmounted to prevent memory leaks
  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const bottomSheetRef = useRef(null)
  const snapPoints = useMemo(() => ['60%', '100%'], [])
  const [currentSnapIndex, setCurrentSnapIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isExercise, setIsExercise] = useState(false)

  const handleClose = () => {
    setIsExercise(false)
    handleModalOpen(false)
  }
  const handleSheetChange = (index) => {
    setCurrentSnapIndex(index)
    if (index === 0) {
      setIsExercise(false)
    }
  }
  const toggleHeartColor = () => {
    setIsFavorite(!isFavorite)
  }
  const handleExerciseButton = () => {
    if (isExercise) {
      setIsExercise(false)
    } else {
      setIsExercise(true)
    }
  }
  if (!data) {
    return <Text>Loading...</Text>; // Fallback for missing data
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onClose={handleClose}
      enablePanDownToClose={true}
      onChange={handleSheetChange}
      backgroundStyle={styles.container}
      handleIndicatorStyle={{ backgroundColor: 'white' }}
    >
      <BottomSheetView style={styles.container}>
        <View className="flex-row items-center" id="landmark-overview-frame">
          {isExercise && (
            <TouchableOpacity onPress={handleExerciseButton}>
              <View className="bg-mindful-brown-70 w-10 h-10 mr-3 justify-center items-center rounded-full">
                <MaterialCommunityIcons
                  name="arrow-left"
                  size={28}
                  color={'white'}
                />
              </View>
            </TouchableOpacity>
          )}

          <Text className={`text-xl font-urbanist-semibold text-white `}>
            {isExercise ? 'Exercise Overview' : 'Landmark Overview'}
          </Text>
        </View>
        <View
          className="flex-row items-center w-full mt-2"
          id="landmark-name-frame"
        >
          <Text className="text-3xl font-urbanist-bold text-white mr-5">
            {isExercise ? data.exercise_name : data.landmark_name}
          </Text>
          <TouchableOpacity onPress={toggleHeartColor}>
            <View className="bg-mindful-brown-70 w-12 h-12 justify-center items-center rounded-full">
              <MaterialCommunityIcons
                name="heart"
                size={28}
                color={isFavorite ? 'red' : 'white'}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View id="landmark-details-frame" className="flex-row items-center ">
          {(isExercise ? exerciseIcons : landmarkIcons).map((detail, index) => (
            <View key={index} className="flex-row items-center">
              <MaterialCommunityIcons
                name={detail.icon}
                size={24}
                color={detail.color}
              />
              <Text className="font-urbanist-semi-bold text-lg text-white ml-2">
                {detail.value}
              </Text>
              {index <
                (isExercise ? exerciseIcons : landmarkIcons).length - 1 && (
                <Text className="text-[#736B66] mx-2 font-urbanist-extra-bold text-2xl">
                  •
                </Text>
              )}
            </View>
          ))}
        </View>
        {isExercise ? (
          // Show audio player button for exercise
          <TouchableOpacity onPress={playAudio}>
            <View className="bg-serenity-green-50 w-full rounded-lg mt-2 py-4 items-center justify-center">
              <Text className="text-white font-urbanist-bold">Play Audio</Text>
            </View>
          </TouchableOpacity>
        ) : (
          // Show image for landmarks
          <Image
            id="landmark-image-frame"
            source={{ uri: data.landmark_image_url }}
            className={`w-full h-[32%] rounded-lg mt-2`}
            contentFit="cover"
          />
        )}

        {currentSnapIndex === 1 && (
          <View
            id="landmark-description-frame"
            className="mt-3 justify-center items-start"
          >
            <Text className="text-xl text-white font-urbanist-semi-bold">
              Description
            </Text>
            <Text className="text-lg text-white font-urbanist-regular">
              {isExercise
                ? data.exercise_description
                : data.landmark_description}
            </Text>
          </View>
        )}
        <View
          id="landmark-button-frame"
          className="flex-row mt-3  justify-between"
        >
          {currentSnapIndex === 0 && (
            <CustomButton
              title={'Travel'}
              handlePress={() => console.log('Travel')}
              buttonStyle={`w-full z-10 bg-[#24211E] rounded-full items-center`}
              textStyle="text-white mr-0"
            />
          )}
          {currentSnapIndex === 1 && isExercise ? (
            <CustomButton
              title={'Start Exercise'}
              handlePress={() => console.log('Start Exercise')}
              buttonStyle={`w-full z-10 bg-[#24211E] rounded-full items-center`}
              textStyle="text-white mr-0"
            />
          ) : currentSnapIndex === 1 && !isExercise ? (
            <CustomButton
              title={'View Exercise'}
              handlePress={handleExerciseButton}
              buttonStyle={`w-full z-10 bg-[#24211E] rounded-full items-center`}
              textStyle="text-white mr-0"
            />
          ) : null}
        </View>
      </BottomSheetView>
    </BottomSheet>
  )
}

export default BottomSheetModal
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: colors.mindfulBrown80,
  },
})
