import React, { useState, useRef, useMemo, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { colors } from '../../common/styles'
import { Image } from 'expo-image'
import CustomButton from '../customButton'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import AudioPlayer from './audioPlayer'
import { useDispatch, useSelector } from 'react-redux'
import { clearIsShownNav } from '../../redux/slices/isShownNavSlice'
import {
  createFavouriteLandmark,
  deleteFavouriteLandmark,
} from '../../api/landmark'

import StatusBarComponent from '../darkThemStatusBar'

const THRESHOLD = [3, 5, 10]

const getUserCountColor = (userCount) => {
  if (userCount < THRESHOLD[0]) {
    return colors.serenityGreen50 // Green for less crowded
  } else if (userCount < THRESHOLD[1]) {
    return colors.empathyOrange50 // Orange for medium crowd
  } else {
    return colors.presentRed50 // Red for crowded
  }
}

const { width } = Dimensions.get('window')
const getIconSize = (icon, width) => {
  const sizes = {
    heart: { small: 24, medium: 28 },
    default: { small: 20, medium: 24 },
  }
  if (width < 365) {
    return icon === 'heart' ? sizes.heart.small : sizes.default.small
  } else {
    return icon === 'heart' ? sizes.heart.medium : sizes.default.medium
  }
}

const BottomSheetModal = ({
  handleModalOpen,
  landmarkData,
  openCompletedModal,
  handleTravel,
  hasArrived,
  setHasArrived,
  isPlayAudio,
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
      value: landmarkData ? landmarkData.properties.landmark_user_count : 0,
      color: getUserCountColor(landmarkData.properties.landmark_user_count),
    },
    {
      icon: 'clock',
      value: landmarkDistancesMap[landmarkId]?.estimatedTime
        ? `${landmarkDistancesMap[landmarkId]?.estimatedTime.toFixed(0)}min`
        : '0min',
      color: '#4C72AB',
    },
    {
      icon: 'map-marker-distance',
      value: landmarkDistancesMap[landmarkId]?.distance
        ? landmarkDistancesMap[landmarkId]?.distance >= 1000
          ? `${(landmarkDistancesMap[landmarkId]?.distance / 1000).toFixed(2)} km`
          : `${landmarkDistancesMap[landmarkId]?.distance.toFixed(0)} m`
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
        ? `${landmarkDistancesMap[landmarkId]?.estimatedTime.toFixed(0)}min`
        : '0min',
      color: '#4C72AB',
    },
    {
      icon: 'map-marker-distance',
      value: landmarkDistancesMap[landmarkId]?.distance
        ? landmarkDistancesMap[landmarkId]?.distance >= 1000
          ? `${(landmarkDistancesMap[landmarkId]?.distance / 1000).toFixed(2)} km`
          : `${landmarkDistancesMap[landmarkId]?.distance.toFixed(0)} m`
        : 'N/A',
    },
  ]

  const isShownNav = useSelector((state) => state.isShownNav).isShownNav
  const data = landmarkData?.properties
  const bottomSheetRef = useRef(null)
  const snapPoints = useMemo(() => ['60%', '95%'], [])
  const [currentSnapIndex, setCurrentSnapIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(data.is_favorite || false)
  const [isExercise, setIsExercise] = useState(false)
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
      if (index === 0) {
        setIsExercise(false)
      }
    } else {
      setCurrentSnapIndex(0)
      setIsExercise(false)
    }
  }

  const toggleHeartColor = async () => {
    try {
      if (isFavorite) {
        await deleteFavouriteLandmark(landmarkId)
      } else {
        await createFavouriteLandmark(landmarkId)
      }
      setIsFavorite(!isFavorite)
    } catch (error) {
      console.error('Error while toggling favourite:', error)
    }
  }

  const handleViewExerciseButton = () => {
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
            <TouchableOpacity onPress={handleViewExerciseButton}>
              <View className="bg-mindful-brown-70 w-10 h-10 mr-3 justify-center items-center rounded-full">
                <MaterialCommunityIcons
                  name="arrow-left"
                  size={28}
                  color={'white'}
                />
              </View>
            </TouchableOpacity>
          )}

          <Text
            className={` text-lg xs:text-xl font-urbanist-semibold text-white `}
          >
            {isExercise ? 'Exercise Overview' : 'Landmark Overview'}
          </Text>
        </View>
        <View
          className="flex-row items-center w-full  xs:mt-2"
          id="landmark-name-frame"
        >
          <Text className="text-2xl xs:text-3xl font-urbanist-bold text-white mr-5 max-w-[80%]">
            {isExercise ? data.exercise_name : data.landmark_name}
          </Text>
          <TouchableOpacity onPress={toggleHeartColor}>
            <View className="bg-mindful-brown-70 w-10 h-10 xs:w-12 xs:h-12 justify-center items-center rounded-full">
              <MaterialCommunityIcons
                name="heart"
                size={getIconSize('heart', width)}
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
                size={getIconSize('detail', width)}
                color={detail.color}
              />
              <Text className="font-urbanist-semi-bold text-md xs:text-lg text-white ml-1 xs:ml-2">
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
              toPlay={isPlayAudio}
              setIsExercise={setIsExercise}
              handleSheetChange={handleSheetChange}
              setHasArrived={setHasArrived}
              handleClose={handleClose}
              openCompletedModal={openCompletedModal}
              landmarkId={landmarkId}
            />
          </View>
        ) : (
          <Image
            id="landmark-image-frame"
            source={{ uri: data.landmark_image_url }}
            className={`w-full h-1/4 xs:h-[32%] rounded-lg mt-2`}
            contentFit="cover"
          />
        )}

        {currentSnapIndex === 1 && (
          <View
            id="landmark-description-frame"
            className="mt-3 justify-center items-start"
          >
            <Text className=" text-md xs:text-xl text-white font-urbanist-semi-bold">
              Description
            </Text>
            <Text className="text-md xs:text-lg text-white font-urbanist-regular">
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
              handlePress={handleTravel}
              buttonStyle={`w-full z-10 bg-[#24211E] rounded-full items-center`}
              textStyle="text-white mr-0"
            />
          ) : currentSnapIndex === 1 && !hasArrived && !isExercise ? (
            <CustomButton
              title={'View Exercise'}
              handlePress={handleViewExerciseButton}
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
