import { View, Text, TouchableOpacity, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BarChart } from 'react-native-gifted-charts'
import { colors } from '../../common/styles'
import BackButton from '../../components/backButton'
import CustomButton from '../../components/customButton'
import { router } from 'expo-router'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Calendar } from 'react-native-calendars'
import { journalEntriesByPeriod } from '../../api/journal'
import LottieView from 'lottie-react-native'

const JournalStats = ({
  title = 'Journal Stats',
  subtitle = 'Please Select a date range',
}) => {
  const today = new Date()
  const [modalVisible, setModalVisible] = useState(false)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [endDateForAxios, setEndDateForAxios] = useState(null)
  const [journals, setJournals] = useState([])

  const handleOnPress = () => {
    setModalVisible(true)
  }

  const handleDayPress = (day) => {
    const selectedDate = new Date(day.timestamp)
    if (!startDate || (startDate && endDate)) {
      // Selecting a new start date
      setStartDate(selectedDate)
      setEndDate(null)
      setEndDateForAxios(null)
    } else if (selectedDate < startDate) {
      // If selected date is before start date, update the start date
      setStartDate(selectedDate)
      setEndDate(null)
      setEndDateForAxios(null)
    } else {
      // Set as end date or select single date
      if (
        selectedDate.toISOString().split('T')[0] ===
        startDate.toISOString().split('T')[0]
      ) {
        // If the selected date is the same as the start date, clear the selection
        setStartDate(null)
        setEndDate(null)
        setEndDateForAxios(null)
      } else {
        // Set as end date
        setEndDate(selectedDate)
        setEndDateForAxios(selectedDate)
      }
    }
  }

  const getMarkedDates = () => {
    const marked = {}
    if (startDate && endDate) {
      const startKey = startDate.toISOString().split('T')[0]
      const endKey = endDate.toISOString().split('T')[0]

      marked[startKey] = {
        selected: true,
        startingDay: true,
        color: '#005700',
        textColor: 'white',
        customStyles: {
          container: {
            borderTopLeftRadius: 50,
            borderBottomLeftRadius: 50,
            overflow: 'hidden',
          },
        },
      }
      marked[endKey] = {
        selected: true,
        endingDay: true,
        color: '#005700',
        textColor: 'white',
        customStyles: {
          container: {
            borderTopRightRadius: 50,
            borderBottomRightRadius: 50,
            overflow: 'hidden',
          },
        },
      }

      let currentDate = new Date(startDate)
      while (currentDate <= endDate) {
        marked[currentDate.toISOString().split('T')[0]] = {
          color: '#add8e6',
        }
        currentDate.setDate(currentDate.getDate() + 1)
      }
    } else if (startDate) {
      const startKey = startDate.toISOString().split('T')[0]
      marked[startKey] = {
        selected: true,
        color: '#005700',
        textColor: 'white',
      }
    }
    return marked
  }

  useEffect(() => {
    const fetchData = async () => {
      if (startDate) {
        const end = endDateForAxios || startDate // Use startDate if endDateForAxios is not set
        try {
          const response = await journalEntriesByPeriod({
            start_date: startDate.toISOString().split('T')[0], // Convert to 'YYYY-MM-DD'
            end_date: end.toISOString().split('T')[0],
          })
          setJournals(response)
          console.log(response)
        } catch (error) {
          console.error(error)
        }
      }
    }

    fetchData()
  }, [startDate, endDateForAxios])

  const innerEmotionsArray = Object.entries(journals || {}).flatMap(
    ([date, entries]) =>
      entries.flatMap((entry) =>
        entry.emotion_id
          .filter((emotion) => emotion.level === 'Inner')
          .map((emotion) => emotion.name)
      )
  )

  console.log('hi', journals)

  console.log('inner', innerEmotionsArray)
  // Function to count occurrences of each emotion
  const countEmotions = (emotions) => {
    return emotions.reduce((acc, emotion) => {
      acc[emotion] = (acc[emotion] || 0) + 1
      return acc
    }, {})
  }

  // Convert the counts into the desired barData format
  const createBarData = (emotionCounts) => {
    return [
      {
        label: 'Happy',
        value: emotionCounts.Happy || 0,
        frontColor: colors.serenityGreen50,
      },
      {
        label: 'Angry',
        value: emotionCounts.Angry || 0,
        frontColor: colors.presentRed40,
      },
      {
        label: 'Bad',
        value: emotionCounts.Bad || 0,
        frontColor: colors.mindfulBrown60,
      },
      {
        label: 'Surprised',
        value: emotionCounts.Surprised || 0,
        frontColor: colors.empathyOrange40,
      },
      { label: 'Sad', value: emotionCounts.Sad || 0, frontColor: '#507DBC' },
      {
        label: 'Disgusted',
        value: emotionCounts.Disgusted || 0,
        frontColor: colors.kindPurple40,
      },
    ]
  }

  const emotionCounts = countEmotions(innerEmotionsArray)

  const barData = createBarData(emotionCounts)

  const maxValue = Math.max(...barData.map((item) => item.value))
  const noOfSections = 4
  const stepValue = Math.ceil(maxValue / noOfSections)

  return (
    <SafeAreaView className="bg-optimistic-gray-10 h-full p-4 space-y-4">
      <BackButton buttonStyle="mb-4" />
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="font-urbanist-extra-bold text-mindful-brown-80 text-4xl mb-1">
            {title}
          </Text>
          <Text className="font-urbanist-light text-mindful-brown-80 text-xl">
            {startDate && endDate
              ? `Selected Range: ${startDate.toLocaleDateString('en-GB')} - ${endDate.toLocaleDateString('en-GB')}`
              : startDate
                ? `Selected Date: ${startDate.toLocaleDateString('en-GB')}`
                : subtitle}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleOnPress}
          className="w-16 h-16 rounded-full bg-empathy-orange-40 flex items-center justify-center -mt-4"
        >
          <MaterialCommunityIcons
            name="calendar-month-outline"
            size={30}
            color="white"
          />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false)
          setStartDate(null)
          setEndDate(null)
          setEndDateForAxios(null) // Reset dates when closing modal
        }}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded-lg w-80 p-4 shadow-lg">
            <Calendar
              style={{
                borderWidth: 1,
                borderColor: 'gray',
                height: 350,
                borderRadius: 10,
                overflow: 'hidden',
              }}
              current={today.toISOString().split('T')[0]}
              onDayPress={handleDayPress}
              markingType={'period'}
              markedDates={getMarkedDates()}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="mt-4 p-2 bg-empathy-orange-40 rounded-md flex items-center justify-center"
            >
              <Text className="text-white font-bold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View className="pb-20">
        {startDate && innerEmotionsArray.length === 0 ? ( // Check if emotions array is empty
          <>
            <View className="flex-row my-3">
              <View className="bg-mindful-brown-80 max-w-[250px] p-3 rounded-lg relative text">
                <Text className="pt-1 text-white">
                  Hey! There are no journal entries for this period.
                </Text>
              </View>
            </View>

            <LottieView
              source={require('../../assets/bearSleeping.json')}
              autoPlay
              loop
              className="w-30 h-40 mb-10"
            />
          </>
        ) : !startDate ? (
          <>
            <View className="flex-row my-3">
              <View className="bg-mindful-brown-80 max-w-[250px] p-3 rounded-lg relative">
                <Text className="pt-1 text-white">
                  Hey! Please select a date.
                </Text>
              </View>
            </View>

            <LottieView
              source={require('../../assets/bearSleeping.json')}
              autoPlay
              loop
              className="w-30 h-40 mb-10"
            />
          </>
        ) : (
          <BarChart
            height={400}
            barWidth={30}
            barBorderRadius={20}
            frontColor="lightgray"
            data={barData}
            yAxisThickness={0}
            xAxisThickness={0}
            borderSkipped={false}
            isAnimated
            yAxisMaxValue={maxValue}
            stepValue={stepValue}
            noOfSections={noOfSections}
            yAxisLabelTexts={Array.from({ length: noOfSections + 1 }, (_, i) =>
              (i * stepValue).toString()
            )}
          />
        )}
        <CustomButton
          title="See All Journal Entries"
          handlePress={() => router.push('/(journal)/journal-history')}
          buttonStyle="w-full mt-10"
        />
      </View>
    </SafeAreaView>
  )
}

export default JournalStats
