import React, { useState, useEffect } from 'react'
import { useFocusEffect } from 'expo-router'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import TopBrownSearchBar from '../../components/topBrownSearchBar'
import { router } from 'expo-router'
import { Link } from 'expo-router'
import StatusBarComponent from '../../components/darkThemStatusBar'
import { colors } from '../../common/styles'
import Loading from '../../components/loading'
import Icon from 'react-native-vector-icons/FontAwesome'
import ArticleCard from '../../components/articleCard'
import { getArticles } from '../../api/article'
import Dropdown from '../../components/dropdown'

const SORT_OPTIONS = [
  { key: 'newest', value: 'Newest First' },
  { key: 'oldest', value: 'Oldest First' },
  { key: 'title_asc', value: 'Title (A-Z)' },
  { key: 'title_desc', value: 'Title (Z-A)' },
  { key: 'topic_asc', value: 'Topic (A-Z)' },
  { key: 'topic_desc', value: 'Topic (Z-A)' },
]

const INITIAL_FILTER_STATE = {
  searchQuery: '',
  sortOption: 'newest',
  selectedTopic: '',
  isSearching: false
}

const ArticleManagement = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [articles, setArticles] = useState([])
  const [filteredArticles, setFilteredArticles] = useState([])
  const [searchQuery, setSearchQuery] = useState(INITIAL_FILTER_STATE.searchQuery)
  const [isSearching, setIsSearching] = useState(INITIAL_FILTER_STATE.isSearching)
  const [sortOption, setSortOption] = useState(INITIAL_FILTER_STATE.sortOption)
  const [selectedTopic, setSelectedTopic] = useState(INITIAL_FILTER_STATE.selectedTopic)
  const [topicOptions, setTopicOptions] = useState([])

  const handleArticlePress = (article) => {
    router.push({
      pathname: '/article-detail',
      params: { id: article.id },
    })
  }

  // Reset function to handle resetting all filter states
  const resetFilters = () => {
    setSearchQuery(INITIAL_FILTER_STATE.searchQuery)
    setSortOption(INITIAL_FILTER_STATE.sortOption)
    setSelectedTopic(INITIAL_FILTER_STATE.selectedTopic)
    setIsSearching(INITIAL_FILTER_STATE.isSearching)
  }

  // Use useFocusEffect to reset filters whenever the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      resetFilters()
      // If you have articles loaded, reapply the default filters
      if (articles.length > 0) {
        filterAndSortArticles(
          INITIAL_FILTER_STATE.selectedTopic, 
          INITIAL_FILTER_STATE.sortOption, 
          articles
        )
      }
    }, [articles])
  )

  // Extract unique topics from articles and format for dropdown
  const getUniqueTopics = (articlesList) => {
    const topics = new Set(articlesList.map(article => article.topic).filter(Boolean))
    const formattedTopics = Array.from(topics).sort().map(topic => ({
      key: topic,
      value: topic
    }))
    return [{ key: '', value: 'All Topics' }, ...formattedTopics]
  }

  const handleSortChange = (value) => {
    setSortOption(value)
  }

  const handleTopicChange = (value) => {
    setSelectedTopic(value)
    filterAndSortArticles(value, sortOption, articles)
  }

  const sortArticles = (articlesToSort, option) => {
    switch (option) {
      case 'newest':
        return [...articlesToSort].sort((a, b) => b.id - a.id)
      case 'oldest':
        return [...articlesToSort].sort((a, b) => a.id - b.id)
      case 'title_asc':
        return [...articlesToSort].sort((a, b) => a.title.localeCompare(b.title))
      case 'title_desc':
        return [...articlesToSort].sort((a, b) => b.title.localeCompare(a.title))
      case 'topic_asc':
        return [...articlesToSort].sort((a, b) => (a.topic || '').localeCompare(b.topic || ''))
      case 'topic_desc':
        return [...articlesToSort].sort((a, b) => (b.topic || '').localeCompare(a.topic || ''))
      default:
        return articlesToSort
    }
  }

  const filterAndSortArticles = (topic, sort, articlesList) => {
    let filtered = [...articlesList]
    
    // Apply topic filter
    if (topic) {
      filtered = filtered.filter(article => article.topic === topic)
    }
    
    // Apply search filter if exists
    if (searchQuery) {
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.topic?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Apply sort
    const sorted = sortArticles(filtered, sort)
    setFilteredArticles(sorted)
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
          topic: article.topic,
          displayId: `#${article.article_id}`
        }))
        
        // Get unique topics for dropdown
        const topics = getUniqueTopics(formattedArticles)
        setTopicOptions(topics)
        
        setArticles(formattedArticles)
        filterAndSortArticles('', sortOption, formattedArticles)
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

  // Re-filter and sort when either sort option or topic changes
  useEffect(() => {
    filterAndSortArticles(selectedTopic, sortOption, articles)
  }, [sortOption])

  const handleSearch = (searchTerm) => {
    setIsSearching(Boolean(searchTerm.trim()))
    setSearchQuery(searchTerm)
    filterAndSortArticles(selectedTopic, sortOption, articles)
  }

  const handleSearchChange = (text) => {
    setSearchQuery(text)
    if (!text.trim()) {
      setIsSearching(false)
      filterAndSortArticles(selectedTopic, sortOption, articles)
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
          {/* Filter and Sort Controls */}
          <View className="mt-4 px-4 flex-row space-x-4">
            <View className="flex-1">
              <Dropdown
                title="Filter by Topic"
                data={topicOptions}
                placeHolder="Select topic"
                handleSelect={handleTopicChange}
                selectedValue={selectedTopic}
                customStyles="mb-4"
                notFoundText="No topics available"
              />
            </View>
            <View className="flex-1">
              <Dropdown
                title="Sort By"
                data={SORT_OPTIONS}
                placeHolder="Select sorting option"
                handleSelect={handleSortChange}
                selectedValue={sortOption}
                customStyles="mb-4"
                notFoundText="No sorting options available"
              />
            </View>
          </View>
        </View>

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
                  articleId={article.displayId}
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