import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import LottieView from 'lottie-react-native'
import BackButton from '../../components/backButton'
import { journalEntriesByDate } from '../../api/journal'
import { monthNames, daysOfWeek } from '../../common/constants'
import { adjustHexColor } from '../../common/hexColor'
import Loading from '../../components/loading'

const JournalHistoryFiltered = () => {
  const [journals, setJournals] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const router = useRouter()
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

  const getDatesBetween = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);


    while (currentDate <= end) {
        dates.push(currentDate.toISOString().split('T')[0]); // Push the date in YYYY-MM-DD format
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
};

  const startDate = '2024-10-1'
  const endDate = '2024-10-2'

  const dateRange = getDatesBetween(startDate, endDate);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await journalEntriesByDate({
          year: currentYear,
          month: currentMonth,
        })
        setJournals(response)
         // Set the first date as selected
         if (dateRange.length > 0) {
          setSelectedDate(dateRange[0]); 
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentMonth, currentYear])

  const getEmotionIcon = (sentiment) => {
    if (sentiment === 'Positive') return 'emoticon-happy'
    if (sentiment === 'Negative') return 'emoticon-sad'
    return 'emoticon-neutral'
  }

  const handlePreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 p-4 bg-optimistic-gray-10">
        <StatusBar barStyle="dark-content" />
        <View className="flex-1 justify-center items-center">
          <Loading />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <View className="flex-1">
      <StatusBar barStyle="light-content" />
      <View className="min-h-[10vh] bg-mindful-brown-70 justify-center p-4 pt-10">
        <BackButton buttonStyle="mb-4" />
        <Text className="font-urbanist-extra-bold text-3xl text-white">
          My {currentYear} Journals
        </Text>
        <ScrollView
          horizontal={true}
          className="flex-row py-1 h-[8vh] space-x-4"
        >
          {dateRange.map((date) => {
                const journalsForDate = journals[date] || []; // Get journals for the current date
                const journalCount = journalsForDate.length;

                const journalDate = new Date(date);
                const dayOfWeek = daysOfWeek[(journalDate.getDay() + 6) % 7];
                const dayOfMonth = journalDate.getDate();
                const isSelected = selectedDate === date; // Check if the date is selected

                return (
                    <TouchableOpacity
                        key={date} // Use date as a unique identifier
                        onPress={() => setSelectedDate(date)} // Set the selected date
                        className={`h-full w-[5vh] rounded-t-full rounded-b-full items-center justify-center ${isSelected ? 'bg-white' : 'bg-mindful-brown-30'}`}
                    >
                        <Text
                            className={`font-urbanist-extra-bold ${isSelected ? 'text-mindful-brown-80' : 'text-optimistic-gray-60'}`}
                        >
                            {monthNames[currentMonth - 1].substring(0, 3)}
                        </Text>
                        <Text
                            className={`font-urbanist-extra-bold text-lg ${isSelected ? 'text-mindful-brown-80' : 'text-optimistic-gray-60'}`}
                        >
                            {dayOfMonth} 
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
      </View>
      <ScrollView className="p-4 flex-1 py-5">
        <Text className="font-urbanist-extra-bold text-xl text-mindful-brown-80">
          Timeline
        </Text>
        <View className="flex-row">
          <View className="w-full space-y-4 pb-10">
            {journals[selectedDate] && journals[selectedDate].length > 0 ? (
              journals[selectedDate].map((journal) => {
                const innerEmotion = journal.emotion_id.find(
                  (emotion) => emotion.level === 'Inner'
                )
                const color = innerEmotion
                  ? innerEmotion.colorID.hexcode
                  : 'black'
                const darkerHex = innerEmotion
                  ? adjustHexColor(color, -0.5)
                  : 'black'
                const lighterHex = innerEmotion
                  ? adjustHexColor(color, 0.8)
                  : 'black'

                const time = new Date(journal.upload_date).toLocaleTimeString(
                  [],
                  {
                    hour: '2-digit',
                    minute: '2-digit',
                  }
                )

                return (
                  <View key={journal.id} className="flex-row items-center my-1">
                    {/* time */}
                    <View className="mr-4 items-center justify-center p-2 rounded-3xl h-[8vh] w-[8vh] space-y-2 bg-mindful-brown-80">
                      <MaterialCommunityIcons
                        name="clock"
                        size={24}
                        color="white"
                      />
                      <Text className="font-urbanist-bold text-white">
                        {time}
                      </Text>
                    </View>

                    {/* journal */}
                    <TouchableOpacity
                      className="flex-1"
                      onPress={() => router.push(`/(journal)/${journal.id}`)}
                    >
                      <View
                        className="bg-white rounded-3xl min-h-[15vh] flex-1 p-4 border"
                        style={{ borderColor: color }}
                      >
                        <View className="flex-row justify-between pb-4">
                          <View
                            className="h-14 w-14 rounded-full items-center justify-center"
                            style={{ backgroundColor: darkerHex }}
                          >
                            <MaterialCommunityIcons
                              name={getEmotionIcon(
                                journal.sentiment_analysis_result
                              )}
                              size={30}
                              color="white"
                            />
                          </View>
                          <View
                            className="item-center justify-center min-w-[15vw] py-1 px-3 rounded-full"
                            style={{ backgroundColor: lighterHex }}
                          >
                            <Text
                              className="font-urbanist-bold text-md text-center"
                              style={{ color: darkerHex }}
                            >
                              {innerEmotion && innerEmotion.name}
                            </Text>
                          </View>
                        </View>

                        <Text className="font-urbanist-extra-bold text-xl text-mindful-brown-90 pb-1">
                          {journal.title}
                        </Text>
                        <Text
                          className="font-urbanist-semi-bold text-lg text-optimistic-gray-60"
                          numberOfLines={10}
                        >
                          {journal.journal_text}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )
              })
            ) : (
              <View className="flex-1 justify-center items-center">
              <View className=" bg-mindful-brown-80 max-w-[400px] p-3 mt-8 rounded-lg relative">
              <Animated.Text 
                style={{
                  opacity: fadeAnim,
                  paddingTop: 1,
                  color: 'white',
                  fontSize: 16,
                fontFamily: 'Urbanist'
                }}
              >
               No journals for the selected day.
              </Animated.Text>
            </View>
              <LottieView
                source={require('../../assets/bearSleeping.json')}
                autoPlay
                loop
                style={{ width: 120, height: 160, marginBottom: 10 }} // Use style instead of className for LottieView
              />
            </View>
              
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default JournalHistoryFiltered
