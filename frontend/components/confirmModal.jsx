import React from 'react'
import { View, Text } from 'react-native'
import CustomButton from './customButton'

const ConfirmModal = ({
  isConfirmButton,
  isCancelButton,
  title,
  subTitle,
  handleConfirm,
  handleCancel,
}) => {
  return (
    <View className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50 bg-opacity-40 bg-optimistic-gray-80">
      <View className="w-3/4 h-1/2 bg-white bg-opacity-90 rounded-3xl shadow-lg flex flex-col">
        <View className="flex-1 justify-center items-center p-4">
          {title && <Text className="text-lg font-bold mb-2">{title}</Text>}
          {subTitle && (
            <Text className="text-sm text-gray-600 mb-4">{subTitle}</Text>
          )}
        </View>

        <View className="w-full flex flex-row justify-around p-4">
          {isCancelButton && (
            <CustomButton
              title={'Cancel'}
              handlePress={handleCancel}
              buttonStyle={`w-32 z-10 bg-red-500 rounded-full`}
              textStyle="text-white"
              isLoading={false}
            />
          )}
          {isConfirmButton && (
            <CustomButton
              title={'Confirm'}
              handlePress={handleConfirm}
              buttonStyle={`w-32 z-10 `}
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
