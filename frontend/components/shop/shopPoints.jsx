import { Image } from 'expo-image'
import React from 'react'
import { View, Text } from 'react-native'
import { pointsVector } from '../../assets/image'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { colors } from '../../common/styles'

const ShopPoints = ({ userFragmentQuantity, noOfFragmentsRequired }) => {
  return (
    <View className="flex flex-row items-center space-x-1 mb-3">
      <MaterialCommunityIcons
        name="star-four-points-outline"
        size={20}
        color={colors.mindfulBrown80}
      />
      <Text className="font-urbanist-semi-bold">
        {userFragmentQuantity}/{noOfFragmentsRequired} fragments
      </Text>
    </View>
  )
}

export default ShopPoints
