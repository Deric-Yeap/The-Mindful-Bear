import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Link, router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { journalCalendarSumary, journalCountByYear } from '../../api/journal'
import { monthNames, daysOfWeek } from '../../common/constants'
import Loading from '../../components/loading'
import LottieView from 'lottie-react-native'
import BackButton from '../../components/backButton'
import { colors } from '../../common/styles'

const JournalHome = () => {
  const [calendarData, setCalendarData] = useState([])
  const [journalCount, setJournalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  useEffect(() => {
    const fetchData = async () => {
      try {
        const journalCountResponse = await journalCountByYear({
          year: currentYear,
        })
        setJournalCount(journalCountResponse.count)
        const response = await journalCalendarSumary({
          year: currentYear,
          month: currentMonth,
        })
        setCalendarData(response.weeks)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentMonth])

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

  const getColor = (sentiment) => {
    if (sentiment === 'Positive') return 'bg-serenity-green-40'
    if (sentiment === 'Negative') return 'bg-empathy-orange-40'
    if (sentiment === 'Neutral') return 'bg-zen-yellow-20'
    return 'bg-mindful-brown-20'
  }

  let dayCounter = 1

  if (loading) {
    return (
      <SafeAreaView className="flex-1 p-4 bg-white">
        <StatusBar barStyle="dark-content" />
        <View className="flex-1 justify-center items-center">
          <Loading />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <ScrollView>
      <View>
        <View className="bg-mindful-brown-60 h-[45vh] relative">
          <BackButton buttonStyle=" left-4 top-12 z-10" className="absolute" tabName="(tabs)" screenName="home" />

          <View className="flex items-center justify-center mt-[5vh] space-y-2">
            <Text className="font-urbanist-extra-bold text-white text-6xl">
              {journalCount}
            </Text>

            <Text className="font-urbanist-semi-bold text-white text-3xl">
              Journals this year.
            </Text>

            <LottieView
              source={require('../../assets/animatedBearBee.json')}
              autoPlay
              loop
              className="w-60 h-60 mb-40"
            />
          </View>
        </View>

        <View className="bg-optimistic-gray-10 p-3 h-full items-center -mt-10 rounded-t-full w-[250vw] -left-[75vw]">
          <TouchableOpacity
            className="-mt-10 mb-3"
            onPress={() => router.push('/(journal)/journal-type-select')}
          >
            <View className="rounded-full h-20 w-20 bg-mindful-brown-80 items-center justify-center shadow-mindful-brown-50">
              <MaterialCommunityIcons name="plus" size={30} color={'white'} />
            </View>
          </TouchableOpacity>

          <View className="flex-row justify-between items-center px-4 w-[100vw]">
            <TouchableOpacity onPress={handlePreviousMonth} className="">
              <Text className="font-urbanist-bold text-zen-yellow-50">
                Previous
              </Text>
            </TouchableOpacity>
            <View className="flex-row items-center">
              <Text className="font-urbanist-extra-bold text-black text-2xl">
                {monthNames[currentMonth - 1]} {currentYear}
              </Text>
              <Link
                href="/(journal)/journal-stats"
                className="font-urbanist-semi-bold ml-2"
              >
                <MaterialCommunityIcons name="chart-bar" size={30} color={colors.serenityGreen60} />
              </Link>
              <Link
                href="/(journal)/journal-history"
                className="font-urbanist-semi-bold ml-2"
              >
                <MaterialCommunityIcons name="book-account" size={30} color={colors.mindfulBrown60} />
              </Link>
              

            </View>
            <TouchableOpacity onPress={handleNextMonth}>
              <Text className="font-urbanist-bold text-zen-yellow-50">
                Next
              </Text>
            </TouchableOpacity>
          </View>
          <View className="w-[100vw] px-4">
            <View className="flex flex-row justify-between mb-4">
              {daysOfWeek.map((day) => (
                <Text
                  key={day}
                  className="font-urbanist-semi-bold text-black text-lg w-[10vw] text-center"
                >
                  {day}
                </Text>
              ))}
            </View>
            {calendarData.map((week, weekIndex) => (
              <View key={weekIndex} className="flex flex-row mb-2">
                {week.map((day, dayIndex) => {
                  const date = day ? dayCounter++ : null
                  return (
                    <View
                      key={dayIndex}
                      className={`h-[12vw] w-[12vw] rounded-full items-center justify-center mx-[0.8vw] ${
                        day
                          ? getColor(day.sentiment_analysis_result)
                          : 'transparent'
                      }`}
                    >
                      {date && (
                        <Text className="text-mindful-brown-100">{date}</Text>
                      )}
                    </View>
                  )
                })}
              </View>
            ))}
          </View>

          <View className="flex flex-row justify-center items-center mt-4 px-4">
            <View className="flex flex-row items-center mx-1">
              <View className="h-4 w-4 bg-mindful-brown-20 rounded-full mr-2"></View>
              <Text className="font-urbanist-semi-bold text-black text-lg">
                Skipped
              </Text>
            </View>

            <View className="flex flex-row items-center mx-1">
              <View className="h-4 w-4 bg-serenity-green-40 rounded-full mr-2"></View>
              <Text className="font-urbanist-semi-bold text-black text-lg">
                Positive
              </Text>
            </View>

            <View className="flex flex-row items-center mx-1">
              <View className="h-4 w-4 bg-zen-yellow-30 rounded-full mr-2"></View>
              <Text className="font-urbanist-semi-bold text-black text-lg">
                Neutral
              </Text>
            </View>

            <View className="flex flex-row items-center mx-1">
              <View className="h-4 w-4 bg-empathy-orange-40 rounded-full mr-2"></View>
              <Text className="font-urbanist-semi-bold text-black text-lg">
                Negative
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default JournalHome
