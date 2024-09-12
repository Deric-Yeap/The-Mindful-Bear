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

const BottomSheetModal = ({ isExercise, handleModalOpen, landmarkData }) => {
  const landmarkDetails = [
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

  const bottomSheetRef = useRef(null)
  const snapPoints = useMemo(() => ['60%', '100%'], [])
  const [currentSnapIndex, setCurrentSnapIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  const handleClose = () => {
    handleModalOpen(false)
  }
  const handleSheetChange = (index) => {
    setCurrentSnapIndex(index)
  }

  const toggleHeartColor = () => {
    setIsFavorite(!isFavorite)
  }
  const data = landmarkData.properties

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
          <Text className="text-xl font-urbanist-semibold text-white ">
            {isExercise ? 'Exercise Overview' : 'Landmark Overview'}
          </Text>
        </View>
        <View
          className="flex-row items-center w-full mt-2"
          id="landmark-name-frame"
        >
          <Text className="text-3xl font-urbanist-bold text-white mr-5">
            {data.landmark_name}
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
          {landmarkDetails.map((detail, index) => (
            <View key={index} className="flex-row items-center">
              <MaterialCommunityIcons
                name={detail.icon}
                size={24}
                color={detail.color}
              />
              <Text className="font-urbanist-semi-bold text-lg text-white ml-2">
                {detail.value}
              </Text>
              {index < landmarkDetails.length - 1 && (
                <Text className="text-[#736B66] mx-2 font-urbanist-extra-bold text-2xl">
                  •
                </Text>
              )}
            </View>
          ))}
        </View>

        <Image
          id="landmark-image-frame"
          source={data.landmark_image_url}
          className={`w-full h-[32%] rounded-lg mt-2`}
          contentFit="cover"
        />

        {currentSnapIndex === 1 && (
          <View
            id="landmark-description-frame"
            className="mt-3 justify-center items-start"
          >
            <Text className="text-xl text-white font-urbanist-semi-bold">
              Description
            </Text>
            <Text className="text-lg text-white font-urbanist-regular">
              {data.landmark_description}
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
          {currentSnapIndex === 1 && (
            <CustomButton
              title={'View Exercise'}
              handlePress={() => console.log('View Exercise')}
              buttonStyle={`w-full z-10 bg-[#24211E] rounded-full items-center`}
              textStyle="text-white mr-0"
            />
          )}
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
