import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import TopBrownSearchBar from '../../components/topBrownSearchBar'
import ArticleCard from '../../components/articleCard' // Ensure you import MetricCard correctly
import { colors } from '../../common/styles'
import StatusBarComponent from '../../components/darkThemStatusBar'
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
        <TopBrownSearchBar title={`Article Finder`} />
        <View className="bg-optimistic-gray-10 p-4 rounded-lg mb-4">
          <ArticleCard
            route="/(journal)/journal-details" // Your desired route
            title="Mindful Journal"
            imageSource={{
              uri: 'https://i.pinimg.com/enabled_lo/564x/5c/c7/4b/5cc74b542c4315e3bc2cb6288007001b.jpg',
            }} // External image source
            
          />
           <ArticleCard
            route="/(journal)/journal-details" // Your desired route
            title="Mindful Journal"
            imageSource={{
              uri: 'https://www.helpguide.org/wp-content/uploads/2023/02/Coping-with-Depression-scaled.jpeg',
            }} // External image source
          />
           <ArticleCard
            route="/(journal)/journal-details" // Your desired route
            title="Mindful Journal"
            imageSource={{
              uri: 'https://www.helpguide.org/wp-content/uploads/2023/02/Coping-with-Depression-scaled.jpeg',
            }} // External image source
          />
           <ArticleCard
            route="/(journal)/journal-details" // Your desired route
            title="Mindful Journal"
            imageSource={{
              uri: 'https://www.helpguide.org/wp-content/uploads/2023/02/Coping-with-Depression-scaled.jpeg',
            }} // External image source
          />
           <ArticleCard
            route="/(journal)/journal-details" // Your desired route
            title="Mindful Journal"
            imageSource={{
              uri: 'https://www.helpguide.org/wp-content/uploads/2023/02/Coping-with-Depression-scaled.jpeg',
            }} // External image source
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Home
