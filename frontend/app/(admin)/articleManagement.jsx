import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import TopBrownSearchBar from '../../components/topBrownSearchBar'
import axiosInstance from '../../common/axiosInstance'
import { router } from 'expo-router' // Import router from expo-router
import { Link } from 'expo-router'
import StatusBarComponent from '../../components/darkThemStatusBar'
import { colors } from '../../common/styles'
import Loading from '../../components/loading'
import Icon from 'react-native-vector-icons/FontAwesome'
import ArticleCard from '../../components/articleCard'

const ArticleManagement = () => {
  const [loading, setLoading] = useState(true) // Loading state
  const [error, setError] = useState(null) // Error state
  const [articles, setArticles] = useState([]) // State to hold fetched exercises  

  return (
    <SafeAreaView className="flex-1 bg-optimistic-gray-10">
      <StatusBarComponent
        barStyle="light-content"
        backgroundColor={colors.mindfulBrown100}
      />
      <ScrollView className="flex-1 bg-optimistic-gray-10">
        <TopBrownSearchBar title="Exercise Management" />

        <View className="flex-1 px-4 mt-5">
          <View className="flex-row justify-between items-center pt-4 pb-0 px-4 ">
            <Text className="text-mindful-brown-80 font-bold text-3xl">
              Articles
            </Text>
            <Link href="/articleCreator" asChild>
              <TouchableOpacity className="bg-mindful-brown-80 px-4 py-1 rounded-full">
                <Text className="text-white font-bold text-base">
                  Create Articles
                </Text>
              </TouchableOpacity>
            </Link>
          </View>

         
        </View>
        <View className="bg-optimistic-gray-10 p-4 rounded-lg mb-2">
          <TouchableOpacity>
            <ArticleCard
              title="Mindful Journal"
              imageSource={{
                uri: 'https://i.pinimg.com/enabled_lo/564x/5c/c7/4b/5cc74b542c4315e3bc2cb6288007001b.jpg',
              }} // External image source
            />
          </TouchableOpacity>
          <ArticleCard
            title="Mindful Journal"
            imageSource={{
              uri: 'https://www.helpguide.org/wp-content/uploads/2023/02/Coping-with-Depression-scaled.jpeg',
            }} // External image source
          />
          <ArticleCard
            title="Mindful Journal"
            imageSource={{
              uri: 'https://www.helpguide.org/wp-content/uploads/2023/02/Coping-with-Depression-scaled.jpeg',
            }} // External image source
          />
          <ArticleCard
            title="Mindful Journal"
            imageSource={{
              uri: 'https://www.helpguide.org/wp-content/uploads/2023/02/Coping-with-Depression-scaled.jpeg',
            }} // External image source
          />
          <ArticleCard
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

export default ArticleManagement
