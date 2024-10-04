import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import BrownPageTitlePortion from '../../components/brownPageTitlePortion'
import StatusBarComponent from '../../components/darkThemStatusBar'
import { colors } from '../../common/styles'
import { listEmotion } from '../../api/emotion'
import { LineChart } from 'react-native-gifted-charts'
import PositiveBear from '../../assets/positiveBear.png'
import NeutralBear from '../../assets/neutralBear.png'
import NegativeBear from '../../assets/negativeBear.png'
import Toggle from '../../components/toggle'

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

const JournalAnalytics = () => {
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

  const chartWidth = lineData.length * 100

  const [selectedOption, setSelectedOption] = useState('Daily')

  const onSelectSwitch = (option) => {
    setSelectedOption(option)
    console.log(`Selected option: ${option}`)
  }

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
          marginLeft: 12,
        }}
      >
        Filter
      </Text>
      <Text
        style={{
          color: colors['mindful-brown-80'],
          fontSize: 16,
          marginBottom: 16,
          marginLeft: 12,
        }}
      >
        Choose which date component
      </Text>
      <View style={{ alignItems: 'center', margin: 10 }}>
        <Toggle
          style={{ alignItems: 'center' }}
          selectionMode={selectedOption}
          roundCorner={true}
          option1="Daily"
          option2="Weekly"
          option3="Monthly"
          onSelectSwitch={onSelectSwitch}
          selectionColor={colors.mindfulBrown80}
        />
      </View>
      <Text
        style={{
          color: colors['mindful-brown-80'],
          fontWeight: 'bold',
          fontSize: 18,
          marginTop: 16,
          marginLeft: 12,
        }}
      >
        Primary Emotions
      </Text>
      <Text
        style={{
          color: colors['mindful-brown-80'],
          fontSize: 16,
          marginBottom: 16,
          marginLeft: 12,
        }}
      >
        Choose which sentiment
      </Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          marginVertical: 16,
        }}
      >
        {/* Positive Bear */}
        <TouchableOpacity
          onPress={() => handlePress('Positive')}
          style={{ alignItems: 'center' }}
        >
          <Image
            source={PositiveBear}
            style={{ width: 80, height: 80 }}
            resizeMode="contain"
          />
          <Text style={{ marginTop: 5, fontSize: 14, color: '#333' }}>
            Positive
          </Text>
        </TouchableOpacity>

        {/* Neutral Bear */}
        <TouchableOpacity
          onPress={() => handlePress('Neutral')}
          style={{ alignItems: 'center' }}
        >
          <Image
            source={NeutralBear}
            style={{ width: 80, height: 80 }}
            resizeMode="contain"
          />
          <Text style={{ marginTop: 5, fontSize: 14, color: '#333' }}>
            Neutral
          </Text>
        </TouchableOpacity>

        {/* Negative Bear */}
        <TouchableOpacity
          onPress={() => handlePress('Negative')}
          style={{ alignItems: 'center' }}
        >
          <Image
            source={NegativeBear}
            style={{ width: 80, height: 80 }}
            resizeMode="contain"
          />
          <Text style={{ marginTop: 5, fontSize: 14, color: '#333' }}>
            Negative
          </Text>
        </TouchableOpacity>
      </View>
      <Text
        style={{
          color: colors['mindful-brown-80'],
          fontWeight: 'bold',
          fontSize: 18,
          marginTop: 16,
          marginBottom: 16,
          marginLeft: 12,
        }}
      >
        No. of journal entries based on sentiment
      </Text>
      <ScrollView
        horizontal={true}
        className="flex-row py-1 h-[8vh] space-x-4 left-2"
      >
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

export default JournalAnalytics
