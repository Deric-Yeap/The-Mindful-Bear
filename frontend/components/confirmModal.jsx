import React from 'react'
import { View, Text } from 'react-native'
import { Image } from 'expo-image'
import CustomButton from './customButton'
import confirmModal from '../assets/confirmModalImage.png'

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
    <View className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50 bg-black/70 ">
      <View className="w-11/12 h-1/2 md:h-3/5  bg-white bg-opacity-90 rounded-3xl shadow-lg flex flex-col">
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
              buttonStyle={`${!isConfirmButton ? 'w-full' : 'w-32'} z-10  mr-0`}
              textStyle="text-white mr-0"
            />
          )}
          {isConfirmButton && (
            <CustomButton
              title={confirmButtonTitle}
              handlePress={handleConfirm}
              buttonStyle={`z-10 bg-red-500 mr-0 rounded-full w-32`}
              textStyle="text-white mr-0"
            />
          )}
        </View>
      </View>
    </View>
  )
}

export default ConfirmModal