// import React, { useState, useRef } from 'react'
// import {
//   View,
//   Text,
//   SafeAreaView,
//   TouchableOpacity,
//   PanResponder,
//   Animated,
//   Dimensions,
// } from 'react-native'
// import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
// import { colors } from '../common/styles'
// import { Image } from 'expo-image'
// import CustomButton from './customButton'

// const { height: screenHeight } = Dimensions.get('window')

// const BottomSheetModal = ({
//   isExercise,
//   details,
//   handleModalOpen,
//   isSessionStarted,
// }) => {
//   const landmarksData = {
//     landmark_id: 175,
//     landmark_name: 'asf',
//     landmark_image_url: 'landmark/1/2024_08_31/cOjBqzAZ_image.jpeg',
//     landmark_description:
//       'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum',
//     x_coordinates: '103.834800',
//     y_coordinates: '1.280400',
//     exercise: {
//       exercise_id: 1,
//       exercise_name: 'testExercise',
//       audio_url: '',
//       description: 'this is a test',
//     },
//     image_file_url:
//       'https://d2rg8k2o6wdh7u.cloudfront.net/landmark/1/2024_08_31/cOjBqzAZ_image.jpeg?Expires=1726070715&Signature=fVfK7DjZQsrIYe0aEwQ9lLPj1qDVz32pTPKC0FL2eZB0XeblJvDCDZjXTzv3pkJcQCNI2UiePAbIj7LNf1jYNKqcOlNXDAiiwEc1Viu1whv8vJjAuWM91T7N1s3A08z8oi1M0I6bu67RQAuqQtNrwEptyO0N~VX8uuMBKDXn4fhKDJG2MIAFY-Fy919LYvRUXgNmFPo4Udqn6CdK54KSJJu35hXMjKRUZQNAEwFmkUVyySr1C3~C~~BRmnov2nKaaN9cPWIO81iaXbgxkx~QFiKI~8yzWd3vvbUU~4uGx0Z207VpEA52UtYfHiY0X7U7FYny1xjG7ELv0X8c1-fEUg__&Key-Pair-Id=K25B8Y1CAIV7DM',
//   }

//   const landmarkDetails = [
//     {
//       icon: 'eye',
//       value: '200k',
//       color: colors.serenityGreen50,
//     },
//     {
//       icon: 'account',
//       value: '4',
//       color: colors.optimisticGray30,
//     },
//     {
//       icon: 'clock',
//       value: '4min',
//       color: '#4C72AB',
//     },
//   ]
//   const [isFavorite, setIsFavorite] = useState(false)
//   const [isExpanded, setIsExpanded] = useState(false)
//   const translateY = useRef(new Animated.Value(0)).current

//   const handleSeeMore = () => {
//     setIsExpanded(!isExpanded)
//   }

//   const handleTravel = () => {
//     console.log('travel')
//   }

//   const toggleHeartColor = () => {
//     setIsFavorite(!isFavorite)
//   }

//   const handleAnimationClose = () => {
//     Animated.timing(translateY, {
//       toValue: screenHeight,
//       duration: 300,
//       useNativeDriver: true,
//     }).start(() => handleModalOpen(false))
//   }

//   const panResponder = PanResponder.create({
//     onStartShouldSetPanResponder: () => true,
//     onPanResponderMove: (e, gestureState) => {
//       if (gestureState.dy > 0) {
//         translateY.setValue(gestureState.dy)
//       }
//     },
//     onPanResponderRelease: (e, gestureState) => {
//       if (gestureState.dy > 50) {
//         handleAnimationClose()
//       } else {
//         Animated.spring(translateY, {
//           toValue: 0,
//           tension: 1,
//           friction: 20,
//           useNativeDriver: true,
//         }).start()
//       }
//     },
//   })

//   return (
//     <Animated.View
//       {...panResponder.panHandlers}
//       style={[{ transform: [{ translateY }] }]}
//       className="absolute w-full h-full bottom-0 "
//     >
//       <SafeAreaView className="absolute flex-1 left-0 w-full h-full justify-end">
//         <View
//           className={`w-full  ${isExpanded ? 'h-full' : 'h-3/5 sm:h-[65%] md:h-4/5'} bg-mindful-brown-80 rounded-tl-lg rounded-tr-lg px-4 py-5 `}
//         >
//           <View className="flex-row items-center" id="landmark-overview-frame">
//             <Text className="text-xl font-urbanist-semibold text-white ">
//               {isExercise ? 'Exercise Overview' : 'Landmark Overview'}
//             </Text>
//           </View>
//           <View
//             className="flex-row items-center w-full mt-2"
//             id="landmark-name-frame"
//           >
//             <Text className="text-3xl font-urbanist-bold text-white mr-5">
//               {landmarksData.landmark_name}
//             </Text>
//             <TouchableOpacity onPress={toggleHeartColor}>
//               <View className="bg-mindful-brown-70 w-12 h-12 justify-center items-center rounded-full">
//                 <MaterialCommunityIcons
//                   name="heart"
//                   size={28}
//                   color={isFavorite ? 'red' : 'white'}
//                 />
//               </View>
//             </TouchableOpacity>
//           </View>
//           <View id="landmark-details-frame" className="flex-row items-center ">
//             {landmarkDetails.map((detail, index) => (
//               <View key={index} className="flex-row items-center">
//                 <MaterialCommunityIcons
//                   name={detail.icon}
//                   size={24}
//                   color={detail.color}
//                 />
//                 <Text className="font-urbanist-semi-bold text-lg text-white ml-2">
//                   {detail.value}
//                 </Text>
//                 {index < landmarkDetails.length - 1 && (
//                   <Text className="text-[#736B66] mx-2 font-urbanist-extra-bold text-2xl">
//                     •
//                   </Text>
//                 )}
//               </View>
//             ))}
//           </View>

//           <Image
//             id="landmark-image-frame"
//             source={landmarksData.image_file_url}
//             className={`w-full ${isExpanded ? 'h-1/4' : 'h-[45%]'} rounded-lg mt-2`}
//             contentFit="cover"
//           />
//           {isExpanded && (
//             <View
//               id="landmark-description-frame"
//               className="mt-3 justify-center items-start"
//             >
//               <Text className="text-xl text-white font-urbanist-semi-bold">
//                 Description
//               </Text>
//               <Text className="text-lg text-white font-urbanist-regular">
//                 {landmarksData.landmark_description}
//               </Text>
//             </View>
//           )}
//           <View
//             id="landmark-button-frame"
//             className="absolute bottom-20 left-2 right-2 flex-row mt-3 mb-1 justify-between"
//           >
//             <CustomButton
//               title={'Travel'}
//               handlePress={handleTravel}
//               buttonStyle={`w-[48%] z-10 bg-[#24211E] rounded-full items-center`}
//               textStyle="text-white"
//             />
//             <CustomButton
//               title={isExpanded ? 'Minimise' : 'See More'}
//               handlePress={handleSeeMore}
//               buttonStyle={`w-[48%] z-10 bg-[#24211E] rounded-full items-center`}
//               textStyle="text-white mr-0"
//             />
//           </View>
//         </View>
//       </SafeAreaView>
//     </Animated.View>
//   )
// }
// export default BottomSheetModal
import React, { useState, useRef, useMemo } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { colors } from '../common/styles'
import { Image } from 'expo-image'
import CustomButton from './customButton'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'

const { height: screenHeight } = Dimensions.get('window')

const BottomSheetModal = ({ isExercise, handleModalOpen }) => {
  const landmarksData = {
    landmark_id: 175,
    landmark_name: 'asf',
    landmark_description:
      'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum',
    image_file_url:
      'https://d2rg8k2o6wdh7u.cloudfront.net/landmark/1/2024_08_31/cOjBqzAZ_image.jpeg?Expires=1726070715&Signature=fVfK7DjZQsrIYe0aEwQ9lLPj1qDVz32pTPKC0FL2eZB0XeblJvDCDZjXTzv3pkJcQCNI2UiePAbIj7LNf1jYNKqcOlNXDAiiwEc1Viu1whv8vJjAuWM91T7N1s3A08z8oi1M0I6bu67RQAuqQtNrwEptyO0N~VX8uuMBKDXn4fhKDJG2MIAFY-Fy919LYvRUXgNmFPo4Udqn6CdK54KSJJu35hXMjKRUZQNAEwFmkUVyySr1C3~C~~BRmnov2nKaaN9cPWIO81iaXbgxkx~QFiKI~8yzWd3vvbUU~4uGx0Z207VpEA52UtYfHiY0X7U7FYny1xjG7ELv0X8c1-fEUg__&Key-Pair-Id=K25B8Y1CAIV7DM',
  }

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
  const snapPoints = useMemo(() => ['67%', '100%'], [])
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
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onClose={handleClose}
      enablePanDownToClose={true}
      onChange={handleSheetChange}
      backgroundStyle={styles.container}
      style={styles.bottomSheet}
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
            {landmarksData.landmark_name}
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
          source={landmarksData.image_file_url}
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
              {landmarksData.landmark_description}
            </Text>
          </View>
        )}
        <View
          id="landmark-button-frame"
          className="flex-row mt-3  justify-between"
        >
          <CustomButton
            title={'Travel'}
            handlePress={() => console.log('Travel')}
            buttonStyle={`w-full z-10 bg-[#24211E] rounded-full items-center`}
            textStyle="text-white mr-0"
          />
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
  bottomSheet: {
    position: 'absolute',
    zIndex: 1000, // High value to overlay the tab bar
  },
})
