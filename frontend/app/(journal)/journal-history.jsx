import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import BackButton from '../../components/backButton'
import { journalEntriesByDate } from '../../api/journal'
import { monthNames, daysOfWeek } from '../../common/constants'
import { adjustHexColor } from '../../common/hexColor'
import Loading from '../../components/loading'

const JournalHistory = () => {
  const [journals, setJournals] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await journalEntriesByDate({
          year: currentYear,
          month: currentMonth,
        })
        setJournals(response)
        setSelectedDate(new Date().toISOString().split('T')[0])
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
          My Journals 
        </Text>
        <ScrollView
          horizontal={true}
          className="flex-row py-1 h-[8vh] space-x-4"
        >
          {journals &&
            Object.keys(journals).map((key) => {
              const date = new Date(key)
              const dayOfWeek = daysOfWeek[(date.getDay() + 6) % 7]
              const dayOfMonth = date.getDate()
              const isSelected = selectedDate === key
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => setSelectedDate(key)}
                  className={`h-full w-[5vh] rounded-t-full rounded-b-full items-center justify-center ${isSelected ? 'bg-white' : 'bg-mindful-brown-30'}`}
                >
                  <Text
                    className={`font-urbanist-extra-bold ${isSelected ? 'text-mindful-brown-80' : 'text-optimistic-gray-60'}`}
                  >
                    {dayOfWeek}
                  </Text>
                  <Text
                    className={`font-urbanist-extra-bold text-lg ${isSelected ? 'text-mindful-brown-80' : 'text-optimistic-gray-60'}`}
                  >
                    {dayOfMonth}
                  </Text>
                </TouchableOpacity>
              )
            })}
        </ScrollView>
        <View className="flex-row justify-between items-center">
          <TouchableOpacity onPress={handlePreviousMonth}>
            <Text className="font-urbanist-semi-bold text-zen-yellow-30">
              Previous
            </Text>
          </TouchableOpacity>
          <Text className="font-urbanist-extra-bold text-white text-2xl">
            {monthNames[currentMonth - 1]} {currentYear}
          </Text>
          <TouchableOpacity onPress={handleNextMonth}>
            <Text className="font-urbanist-semi-bold text-zen-yellow-30">
              Next
            </Text>
          </TouchableOpacity>
        </View>
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
                <Text className="font-urbanist-semi-bold text-lg text-optimistic-gray-60">
                  No journals for the selected day.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default JournalHistory