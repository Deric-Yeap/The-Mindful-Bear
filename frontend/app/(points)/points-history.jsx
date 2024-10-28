import React, { useEffect, useState, useRef } from 'react'
import { View, Text, StatusBar, ScrollView, Animated } from 'react-native'
import LottieView from 'lottie-react-native'
import moment from 'moment'

import Loading from '../../components/loading'
import BackButton from '../../components/backButton'
import {
  sumPoints,
  listAchievementPointRecord,
} from '../../api/achievementPoint'

const PointsHistory = () => {
  const [loading, setLoading] = useState(true)
  const [points, setPoints] = useState(0)
  const [pointsHistory, setPointsHistory] = useState([])
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pointsResponse = await sumPoints()
        setPoints(pointsResponse.total_points)
        const historyResponse = await listAchievementPointRecord()
        setPointsHistory(historyResponse)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start()
  }, [fadeAnim])

  if (loading) {
    return (
      <View className="flex-1 p-4 bg-white">
        <StatusBar barStyle="dark-content" />
        <View className="flex-1 justify-center items-center">
          <Loading />
        </View>
      </View>
    )
  }

  return (
    <View className="flex-1 p-4 bg-white">
      <View className="relative w-full flex-row items-center justify-center top-12">
        <View className="absolute left-0">
          <BackButton
            buttonStyle="float-left"
            tabName="(tabs)"
            screenName="home"
          />
        </View>
        <Text className="font-urbanist-extra-bold text-4xl text-mindful-brown-80">
          Points
        </Text>
      </View>
      <View className="pt-[7vh] items-center">
        <LottieView
          source={require('../../assets/diamond.json')}
          autoPlay
          loop
          style={{ width: 120, height: 120 }}
        />
        <Text className="font-urbanist-extra-bold text-mindful-brown-60 text-4xl">
          {points}
        </Text>
      </View>
      <Text className="font-urbanist-extra-bold text-mindful-brown-80 text-xl mt-4">
        Points History
      </Text>
      {pointsHistory.length === 0 ? (
        <View className="flex-1 pt-10 items-center">
          <View className="bg-mindful-brown-80 max-w-[400px] p-3 mt-8 rounded-lg relative">
            <Animated.Text
              style={{
                opacity: fadeAnim,
                paddingTop: 1,
                color: 'white',
                fontSize: 16,
                fontFamily: 'Urbanist',
              }}
            >
              No points history available.
            </Animated.Text>
          </View>
          <LottieView
            source={require('../../assets/bearSleeping.json')}
            autoPlay
            loop
            style={{ width: 120, height: 160, marginBottom: 10 }}
          />
        </View>
      ) : (
        <ScrollView
          className="my-4 mb-100"
          contentContainerStyle={{ paddingBottom: 1 }}
        >
          {pointsHistory.map((entry) => (
            <View
              key={entry.id}
              className="bg-optimistic-gray-10 p-4 rounded-lg mb-4"
            >
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="font-urbanist-medium text-mindful-brown-80 text-lg">
                    {entry.description}
                  </Text>
                  <Text className="font-urbanist-regular text-mindful-brown-40 text-sm">
                    {moment(entry.date).format('MMMM Do YYYY, h:mm:ss a')}
                  </Text>
                </View>
                <Text
                  className={`font-urbanist-extra-bold text-2xl ${
                    entry.points > 0
                      ? 'text-serenity-green-50'
                      : 'text-present-red-50'
                  }`}
                >
                  {entry.points > 0 ? '+' : ''}
                  {entry.points}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  )
}

export default PointsHistory
