import { View, Text, TouchableOpacity, Modal, Animated } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
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
  const [loading, setLoading] = useState(true)

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
      setLoading(true)
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
        } finally {
          setLoading(false)
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
        primaryEmotion: 'Happy',
        value: emotionCounts.Happy || 0,
        frontColor: colors.serenityGreen50,
      },
      {
        primaryEmotion: 'Angry',
        value: emotionCounts.Angry || 0,
        frontColor: colors.presentRed40,
      },
      {
        primaryEmotion: 'Bad',
        value: emotionCounts.Bad || 0,
        frontColor: colors.mindfulBrown60,
      },
      {
        primaryEmotion: 'Surprised',
        value: emotionCounts.Surprised || 0,
        frontColor: colors.empathyOrange40,
      },
      { primaryEmotion: 'Sad', value: emotionCounts.Sad || 0, frontColor: '#507DBC' },
      {
        primaryEmotion: 'Disgusted',
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
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true, // Use native driver for better performance
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start()
  }, [fadeAnim, scaleAnim])
  const handlePress = (startDate,endDateForAxios) => {
    router.push({
        pathname: '/(journal)/journal-history-filtered',
        params: { start: startDate, end: endDateForAxios },
    });
};


  return (
    <SafeAreaView className="bg-optimistic-gray-10 h-full p-4 space-y-4">
      <BackButton buttonStyle="mb-4" />
      <View className="flex-row items-center justify-between">
        <View>
        <View className="flex flex-row items-center">
  <Text className="font-urbanist-extra-bold text-mindful-brown-80 text-4xl mb-1">
    {title}
  </Text>
  <TouchableOpacity
    onPress={handleOnPress}
    className="w-16 h-16 rounded-full bg-empathy-orange-40 flex items-center justify-center -mt-4 ml-4" // Added ml-4 for spacing
  >
    <MaterialCommunityIcons
      name="calendar-month-outline"
      size={30}
      color="white"
    />
  </TouchableOpacity>
</View>
          <Text className="font-urbanist-light text-mindful-brown-80 text-xl">
            {startDate && endDate
              ? `Selected Range: ${startDate.toLocaleDateString('en-GB')} - ${endDate.toLocaleDateString('en-GB')}`
              : startDate
                ? `Selected Date: ${startDate.toLocaleDateString('en-GB')}`
                : subtitle}
          </Text>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false)
          setStartDate(null)
          setEndDate(null)
          setEndDateForAxios(null) 
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
            <View className="flex-row justify-center items-center">
              <View className="bg-mindful-brown-80 max-w-[550px] p-3 rounded-lg relative text">
                <Animated.Text
                  style={{
                    opacity: fadeAnim,
                    paddingTop: 5,
                    color: 'white',
                    fontSize: 16,
                  }}
                >
                  Hey! There are no journal entries for this period.
                </Animated.Text>
              </View>
            </View>

            <LottieView
              source={require('../../assets/bearSleeping.json')}
              autoPlay
              loop
              className="w-30 h-40 mt-5"
            />
          </>
        ) : !startDate ? (
          <>
            <View className="flex-row justify-center items-center">
              <View className="bg-mindful-brown-80 max-w-[250px] p-3 rounded-lg relative">
                <Animated.Text
                  style={{
                    opacity: fadeAnim,
                    paddingTop: 5,
                    color: 'white',
                    fontSize: 16,
                  }}
                >
                  Hey! Please select a date.
                </Animated.Text>
              </View>
            </View>

            <LottieView
              source={require('../../assets/bearSleeping.json')}
              autoPlay
              loop
               className="w-30 h-40 mt-5"
            />

            
          </>
          

        ) : (
          <View className="relative mt-2">
         <BarChart
        data={barData}
        height={400}
        barWidth={30}
        barBorderRadius={20}
        frontColor="lightgray"
        yAxisThickness={0} 
        xAxisThickness={0}
        isAnimated
        yAxisMaxValue={maxValue}
        stepValue={stepValue}
        noOfSections={noOfSections}
        yAxisLabelTexts={Array.from({ length: noOfSections + 1 }, (_, i) =>
          (i * stepValue).toString()
        )}
        xAxisLabelTexts={[]} 
        scrollAnimation = {true}
      />
          <View className="flex flex-row justify-between ml-3 mr-11 ">
        {barData.map((item, index) => (
          <Text
            key={index}
            className="text-center text-sm -mx-1 transform rotate-[-40deg] w-16"
          >
            {item.primaryEmotion} 
          </Text>
        ))}
      </View>
    </View>
        )}
        {startDate && (
          <CustomButton
            title="View Journal Entries"
            handlePress={(handlePress)}
            buttonStyle="w-full mt-10"
          />
        )}
      </View>
    </SafeAreaView>
  )
}

export default JournalStats
