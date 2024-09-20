import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BarChart } from 'react-native-gifted-charts'
import { colors } from '../../common/styles'
import BackButton from '../../components/backButton'
import CustomButton from '../../components/customButton'
import { router } from 'expo-router'

const JournalStats = () => {
  const barData = [
    { value: 5, label: 'Happy', frontColor: colors.serenityGreen50 },
    { value: 11, label: 'Angry', frontColor: colors.presentRed40 },
    { value: 8, label: 'Bad', frontColor: colors.mindfulBrown60 },
    { value: 1, label: 'Surprised', frontColor: colors.empathyOrange40 },
    { value: 4, label: 'Sad', frontColor: '#507DBC' },
    { value: 1, label: 'Disgusted', frontColor: colors.kindPurple40 },
  ]
  const maxValue = Math.max(...barData.map((item) => item.value))
  return (
    <SafeAreaView className="bg-optimistic-gray-10 h-full p-4 space-y-4">
      <BackButton buttonStyle="mb-4" />
      <View className="">
        <Text className="font-urbanist-extra-bold text-mindful-brown-80 text-4xl mb-1">
          Journal Stats
        </Text>
        <Text className="font-urbanist-light text-mindful-brown-80 text-2xl">
          Your Journal Stats for Feb 2025
        </Text>
      </View>
      <View  className = "pb-20">
        <BarChart
          height={400}
          barWidth={30}
          barBorderRadius={20}
          frontColor="lightgray"
          data={barData}
          yAxisThickness={0}
          xAxisThickness={0}
          borderSkipped={false}
          xAxisLabelsVerticalShift={10}
          yAxisMaxValue={maxValue}
        />
      </View>
      <CustomButton
     
        title="See All Journal Entries"
        handlePress={() => router.push('/(journal)/journal-history')}
        buttonStyle="w-full mb-10"
      />
    </SafeAreaView>
  )
}

export default JournalStats
