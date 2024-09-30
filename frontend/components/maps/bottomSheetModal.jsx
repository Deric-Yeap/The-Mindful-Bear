import React, { useState, useRef, useMemo, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { colors } from '../../common/styles'
import { Image } from 'expo-image'
import CustomButton from '../customButton'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import AudioPlayer from './audioPlayer'
import { useDispatch, useSelector } from 'react-redux'
import {
  setIsShownNav,
  clearIsShownNav,
} from '../../redux/slices/isShownNavSlice'

const BottomSheetModal = ({
  handleModalOpen,
  landmarkData,
  openCompletedModal,
  handleTravel,
  hasArrived,
  setHasArrived,
  distanceTimeEst,
}) => {
  const landmarkDistancesMap = {}
  distanceTimeEst.forEach((item) => {
    const { landmark_id, exercise_id } = item
    landmarkDistancesMap[landmark_id] = item
  })

  const landmarkId = landmarkData.properties.landmark_id.toString()

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
      value: landmarkDistancesMap[landmarkId]?.estimatedTime
        ? `${landmarkDistancesMap[landmarkId]?.estimatedTime.toFixed(0)}s`
        : '0min',
      color: '#4C72AB',
    },
    {
      icon: 'map-marker-distance',
      value: landmarkDistancesMap[landmarkId]?.distance
        ? `${landmarkDistancesMap[landmarkId]?.distance.toFixed(0)}m`
        : 'N/A',
      color: colors.distanceColor || 'red',
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
      value: landmarkDistancesMap[landmarkId]?.estimatedTime
        ? `${landmarkDistancesMap[landmarkId]?.estimatedTime.toFixed(0)}s`
        : '0min',
      color: '#4C72AB',
    },
    {
      icon: 'map-marker-distance',
      value: landmarkDistancesMap[landmarkId]?.distance
        ? `${landmarkDistancesMap[landmarkId]?.distance.toFixed(0)}m`
        : 'N/A',
    },
  ]

  const isShownNav = useSelector((state) => state.isShownNav).isShownNav
  const darkerHex = 'white'
  const lighterHex = 'white'
  const [isSoundLoaded, setIsSoundLoaded] = useState(false)
  const [isReached, setIsReached] = useState(false)
  const [sound, setSound] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const data = landmarkData?.properties
  const [isPlaying, setIsPlaying] = useState(false)
  const bottomSheetRef = useRef(null)
  const snapPoints = useMemo(() => ['60%', '100%'], [])
  const [currentSnapIndex, setCurrentSnapIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isExercise, setIsExercise] = useState(false)
  const [position, setPosition] = useState(0)
  const [duration, setDuration] = useState(0)
  const dispatch = useDispatch()

  const handleClose = () => {
    if (!isShownNav) {
      dispatch(clearIsShownNav())
    }
    setIsExercise(false)
    handleModalOpen(false)
  }
  const handleSheetChange = (index) => {
    if (index >= 0 && index < snapPoints.length) {
      setCurrentSnapIndex(index)
      setIsExercise(index === 1)
    } else {
      setCurrentSnapIndex(0)
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

  useEffect(() => {
    if (hasArrived && bottomSheetRef.current) {
      setIsExercise(true)
      handleSheetChange(1)
    }
  }, [hasArrived])

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={currentSnapIndex}
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
          <View className="relative w-full h-48 justify-center items-center">
            <AudioPlayer
              audioUri={data.exercise_audio_url}
              imageUrl={data.landmark_image_url}
              toPlay={hasArrived}
              setIsExercise={setIsExercise}
              handleSheetChange={handleSheetChange}
              setHasArrived={setHasArrived}
              handleClose={handleClose}
              openCompletedModal={openCompletedModal}
            />
          </View>
        ) : (
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
              handlePress={handleTravel}
              buttonStyle={`w-full z-10 bg-[#24211E] rounded-full items-center`}
              textStyle="text-white mr-0"
            />
          )}
          {currentSnapIndex === 1 && !hasArrived && isExercise ? (
            <CustomButton
              title={'Start Exercise'}
              handlePress={() => console.log('Start Exercise')}
              buttonStyle={`w-full z-10 bg-[#24211E] rounded-full items-center`}
              textStyle="text-white mr-0"
            />
          ) : currentSnapIndex === 1 && !hasArrived && !isExercise ? (
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
