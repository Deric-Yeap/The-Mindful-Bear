import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router'
import { Image } from 'expo-image'
import { useSelector } from 'react-redux'
import { featureFlags } from '../../common/featureFlags'
import TopBrownSearchBar from '../../components/topBrownSearchBar'
import MetricCard from '../../components/metricCard'
import { colors } from '../../common/styles'
import StatusBarComponent from '../../components/darkThemStatusBar'
import { getMe } from '../../api/user'
import Loading from '../../components/loading'
import { journalStreak } from '../../api/journal'

const Home = () => {
  const user = useSelector((state) => state.user)
  const [loading, setLoading] = useState(false)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await journalStreak()
        setStreak(response.streak)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <SafeAreaView className="flex-1 p-4 bg-white">
        <StatusBarComponent
          barStyle="light-content"
          backgroundColor="#251404"
        />
        <View className="flex-1 justify-center items-center">
          <Loading />
        </View>
      </SafeAreaView>
    )
  }
  return (
    <SafeAreaView className="flex-1 bg-optimistic-gray-10">
      <ScrollView className="mb-12">
        <StatusBarComponent
          barStyle="light-content"
          backgroundColor="#251404"
        />
        <TopBrownSearchBar title={`Welcome, ${user.name}!`} />
        <View className="bg-optimistic-gray-10 p-4 rounded-lg mb-4">
          <Link href="/map" asChild>
            <Pressable
              className="relative w-full rounded-xl mb-4"
              style={{ aspectRatio: 1.5 }}
            >
              <Image
                source={require('../../assets/start.svg')}
                className="w-full h-full rounded-xl"
              />
              <Text className="absolute text-white font-urbanist-black text-3xl mt-4 ml-5">
                Explore
              </Text>
            </Pressable>
          </Link>

          <Text className="text-mindful-brown-100 font-urbanist-extra-bold text-xl mb-4">
            Mindfulness Tracker
          </Text>
          <MetricCard
            route="/(journal)/journal-home"
            iconName="book-plus-outline"
            iconColor={colors.empathyOrange40}
            circleStyle="bg-empathy-orange-10"
            title="Mindful Journal"
            rightImage={require('../../assets/mindfulJournalMetricCard.png')}
          >
            <Text className="font-urbanist-semi-bold text-mindful-brown-80 text-lg">
              {streak} {streak <= 1 ? 'Day' : 'Days'} Streak
            </Text>
          </MetricCard>
          {featureFlags.isDiscoverArticles && (
            <>
              <Text className="text-mindful-brown-100 font-urbanist-extra-bold text-xl mb-4">
                Discover Articles
              </Text>
              <MetricCard
                route="/(article)/article-discovery"
                iconName="book-plus-outline"
                iconColor={colors.kindPurple50}
                circleStyle="bg-kind-purple-10"
                title="Article Discovery Made Easy"
              >
                <Text className="font-urbanist-semi-bold text-mindful-brown-80 text-lg">
                  Effortlessly search and find articles that inspire and inform.
                </Text>
              </MetricCard>
            </>
          )}
          {featureFlags.isFavouriteLandmarks && (
            <>
              <Text className="text-mindful-brown-100 font-urbanist-extra-bold text-xl mb-4">
                Favourite Landmarks
              </Text>
              <MetricCard
                route="/favourite"
                iconName="book-plus-outline"
                iconColor={colors.empathyOrange40}
                circleStyle="bg-empathy-orange-10"
                title="Favourite Landmarks"
                rightImage={require('../../assets/mindfulJournalMetricCard.png')}
              >
                <Text className="font-urbanist-semi-bold text-mindful-brown-80 text-lg">
                  View your favourite landmarks here.
                </Text>
              </MetricCard>
            </>
          )}
          <Text className="text-mindful-brown-100 font-urbanist-extra-bold text-xl mb-4">
            Achievement
          </Text>
          <MetricCard
            route="/(points)/points-history"
            iconName="diamond-stone"
            iconColor={colors.empathyOrange40}
            circleStyle="bg-empathy-orange-10"
            title="Points Earned"
            rightImage={require('../../assets/mindfulJournalMetricCard.png')}
          >
            <Text className="font-urbanist-semi-bold text-mindful-brown-80 text-lg">
              View your points history.
            </Text>
          </MetricCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Home
