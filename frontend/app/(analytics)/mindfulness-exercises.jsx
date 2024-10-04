import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import BrownPageTitlePortion from '../../components/brownPageTitlePortion'
import StatusBarComponent from '../../components/darkThemStatusBar'
import { colors } from '../../common/styles'
import { listEmotion } from '../../api/emotion'
import { LineChart } from 'react-native-gifted-charts'

const lineData = [
  { value: 0, label: '23/9' },
  { value: 10, label: '24/9' },
  { value: 8, label: '25/9' },
  { value: 58, label: '26/9' },
  { value: 56, label: '27/9' },
  { value: 78, label: '28/9' },
  { value: 74, label: '29/9' },
  { value: 98, label: '30/9' },
  { value: 0, label: '23/9' },
  { value: 10, label: '24/9' },
  { value: 8, label: '25/9' },
  { value: 58, label: '26/9' },
  { value: 56, label: '27/9' },
  { value: 78, label: '28/9' },
  { value: 74, label: '29/9' },
  { value: 98, label: '30/9' },
  { value: 0, label: '23/9' },
  { value: 10, label: '24/9' },
  { value: 8, label: '25/9' },
  { value: 58, label: '26/9' },
  { value: 56, label: '27/9' },
  { value: 78, label: '28/9' },
  { value: 74, label: '29/9' },
  { value: 98, label: '30/9' },
  { value: 0, label: '23/9' },
  { value: 10, label: '24/9' },
  { value: 8, label: '25/9' },
  { value: 58, label: '26/9' },
  { value: 56, label: '27/9' },
  { value: 78, label: '28/9' },
  { value: 74, label: '29/9' },
  { value: 98, label: '30/9' },
]

const MindfulnessExercises = () => {
  const [emotions, setEmotions] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const emotionResponse = await listEmotion()
        setEmotions(emotionResponse)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  // Calculate the width for the LineChart based on the number of data points
  const chartWidth = lineData.length * 100 // Adjust based on your design

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors['optimistic-gray-10'] }}
    >
      <StatusBarComponent
        barStyle="light-content"
        backgroundColor={colors.mindfulBrown100}
      />
      <BrownPageTitlePortion title="Mindful Journal Analytics" />
      <Text
        style={{
          color: colors['mindful-brown-80'],
          fontWeight: 'bold',
          fontSize: 18,
          marginTop: 16,
          marginBottom: 16,
        }}
      >
        Primary Emotions
      </Text>
      {/* {emotions
        .filter((emotion) => emotion.level === 'Inner')
        .map((emotion, index) => (
          <Text key={index} style={{ fontWeight: '600', color: colors['mindful-brown-80'] }}>
            {emotion.name}
          </Text>
        ))} */}
      <Text
        style={{
          color: colors['mindful-brown-80'],
          fontWeight: 'bold',
          fontSize: 18,
          marginTop: 16,
          marginBottom: 16,
        }}
      >
        No. of journal entries based on sentiment
      </Text>
      <ScrollView horizontal={true} className="flex-row py-1 h-[8vh] space-x-4">
        <LineChart
          areaChart
          curved
          data={lineData}
          height={250}
          showVerticalLines
          spacing={44}
          initialSpacing={0}
          color1={colors.mindfulBrown100}
          textColor1="green"
          hideDataPoints
          dataPointsColor1={colors.mindfulBrown100}
          startFillColor1={colors.mindfulBrown50}
          startOpacity={0.8}
          endOpacity={0.3}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default MindfulnessExercises
