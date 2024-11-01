import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import TopBrownSearchBar from '../../components/topBrownSearchBar'
import axiosInstance from '../../common/axiosInstance'
import { router } from 'expo-router'
import { Link } from 'expo-router'
import StatusBarComponent from '../../components/darkThemStatusBar'
import { colors } from '../../common/styles'
import Loading from '../../components/loading'
import Icon from 'react-native-vector-icons/FontAwesome'
import ArticleCard from '../../components/articleCard'
import { getArticles } from '../../api/article'

const ArticleManagement = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [articles, setArticles] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredArticles, setFilteredArticles] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  const handleArticlePress = (article) => {
    router.push({
      pathname: '/article-detail',
      params: { id: article.id },
    })
  }

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true)
      try {
        const response = await getArticles()
        const formattedArticles = response.map(article => ({
          id: article.article_id,
          title: article.title,
          imageUrl: article.article_image_url,
          content: article.processed_contents,
          pdfUrl: article.article_pdf_url,
          topic: article.topic
        }))
        setArticles(formattedArticles)
        setFilteredArticles(formattedArticles)
      } catch (err) {
        setError(
          err.response?.data || err.request
            ? 'No response received from the server.'
            : err.message
        )
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  const handleSearch = (searchTerm) => {
    setIsSearching(true)
    if (!searchTerm.trim()) {
      setFilteredArticles(articles)
    } else {
      const filtered = articles.filter(article => 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.topic?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredArticles(filtered)
    }
  }

  const handleSearchChange = (text) => {
    setSearchQuery(text)
    if (!text.trim()) {
      setFilteredArticles(articles)
      setIsSearching(false)
    }
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-optimistic-gray-10">
        <Loading />
      </View>
    )
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-optimistic-gray-10 justify-center items-center">
        <Text>Error fetching data: {error}</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-optimistic-gray-10">
      <StatusBarComponent
        barStyle="light-content"
        backgroundColor={colors.mindfulBrown100}
      />
      <ScrollView className="flex-1 bg-optimistic-gray-10">
        <TopBrownSearchBar 
          title="Articles Management"
          value={searchQuery}
          onChangeText={handleSearchChange}
          onSearch={handleSearch}
        />

        <View className="flex-1 px-4 mt-5">
          <View className="flex-row justify-between items-center pt-4 pb-0 px-4">
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
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <TouchableOpacity
                key={article.id}
                onPress={() => handleArticlePress(article)}
              >
                <ArticleCard
                  title={article.title}
                  imageSource={{ uri: article.imageUrl }}
                  category={article.topic}
                />
              </TouchableOpacity>
            ))
          ) : (
            <View className="flex-1 justify-center items-center py-8">
              <Text className="text-mindful-brown-80 text-lg">
                {isSearching ? "No articles found matching your search" : "No articles available"}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ArticleManagement