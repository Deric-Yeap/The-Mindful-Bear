import React from 'react'
import { View, Text } from 'react-native'
import { Image } from 'expo-image'
import { confirmModal } from '../assets/image'
import CustomButton from './customButton'

const ConfirmModal = ({
  isConfirmButton,
  isCancelButton,
  confirmButtonTitle,
  cancelButtonTitle,
  imageSource,
  title,
  subTitle,
  handleConfirm,
  handleCancel,
}) => {
  return (
    <View className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50 bg-opacity-40 bg-optimistic-gray-80">
      <View className="w-3/4 h-1/2 md:h-3/4  bg-white bg-opacity-90 rounded-3xl shadow-lg flex flex-col">
        <View className=" flex-1 justify-center items-center px-4">
          <Image
            source={imageSource || confirmModal}
            className="w-full h-4/6 rounded-lg"
            contentFit="cover"
          />
          {title && (
            <Text className="text-2xl font-urbanist-extra-bold text-center mb-2">
              {title}
            </Text>
          )}
          {subTitle && (
            <Text className="text-lg font-urbanist-medium">{subTitle}</Text>
          )}
        </View>

        <View className="w-full flex flex-row justify-around px-4 pb-4">
          {isCancelButton && (
            <CustomButton
              title={cancelButtonTitle}
              handlePress={handleCancel}
              buttonStyle={`w-32 z-10 bg-red-500 rounded-full`}
              textStyle="text-white"
              isLoading={false}
            />
          )}
          {isConfirmButton && (
            <CustomButton
              title={confirmButtonTitle}
              handlePress={handleConfirm}
              buttonStyle={`z-10 ${!isCancelButton ? 'w-full' : 'w-32'}`}
              textStyle="text-white"
              isLoading={false}
            />
          )}
        </View>
      </View>
    </View>
  )
}

export default ConfirmModal
