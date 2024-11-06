import React from 'react'
import { View, Text } from 'react-native'
import { Image } from 'expo-image'
import CustomButton from '../customButton'
import LottieView from 'lottie-react-native'

const AvatarCard = ({
  isPurchaseButton,
  imageSource,
  title,
  points,
  handleConfirm,
  isSelected,
}) => {
  return (
    <View className="w-11/12 h-72 bg-white  rounded-[30px] shadow-lg">
      <View className="flex-1 justify-center items-center">
        <LottieView
          source={imageSource}
          className="w-full h-1/3 xs:h-4/6 rounded-full"
          autoPlay
        />
        {title && (
          <Text className="text-md xs:text-lg font-urbanist-extra-bold mb-2">
            {title}
          </Text>
        )}
        {points && points}
      </View>

      <View className="w-full flex flex-row justify-around px-4 pb-4">
        <CustomButton
          title={
            isPurchaseButton ? 'Purchase' : isSelected ? 'Equipped' : 'Equip'
          }
          handlePress={handleConfirm}
          buttonStyle={`w-full z-10 mr-0 rounded-full ${isSelected ? 'bg-optimistic-gray-30' : 'bg-[#FB8728]'}`}
          textStyle="text-white mr-0"
          disabled={isSelected}
        />
      </View>
    </View>
  )
}
export default AvatarCard
