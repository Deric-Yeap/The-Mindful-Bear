import React, { useState, useEffect } from 'react'
import { useFocusEffect } from 'expo-router'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Swipeable } from 'react-native-gesture-handler'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import TopBrownSearchBar from '../../components/topBrownSearchBar'
import { router } from 'expo-router'
import { Link } from 'expo-router'
import StatusBarComponent from '../../components/darkThemStatusBar'
import { colors } from '../../common/styles'
import Loading from '../../components/loading'
import Icon from 'react-native-vector-icons/FontAwesome'
import ArticleCard from '../../components/articleCard'
import { getArticles, deleteArticle } from '../../api/article'
import Dropdown from '../../components/dropdown'
import ConfirmModal from '../../components/confirmModal'

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
  // State declarations
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [articles, setArticles] = useState([])
  const [filteredArticles, setFilteredArticles] = useState([])
  const [searchInput, setSearchInput] = useState(INITIAL_FILTER_STATE.searchQuery)
  const [searchQuery, setSearchQuery] = useState(INITIAL_FILTER_STATE.searchQuery)
  const [isSearching, setIsSearching] = useState(INITIAL_FILTER_STATE.isSearching)
  const [sortOption, setSortOption] = useState(INITIAL_FILTER_STATE.sortOption)
  const [selectedTopic, setSelectedTopic] = useState(INITIAL_FILTER_STATE.selectedTopic)
  const [topicOptions, setTopicOptions] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [articleToDelete, setArticleToDelete] = useState(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)

  // Handler Functions
  const handleDelete = async (articleId) => {
    setArticleToDelete(articleId)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = () => {
    setShowDeleteModal(false)
    setArticleToDelete(articleId => {
      if (articleId) {
        performDelete(articleId)
      }
      return null
    })
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
    setArticleToDelete(null)
  }

  const performDelete = async (articleId) => {
    try {
      await deleteArticle(articleId)
      const updatedArticles = articles.filter(article => article.id !== articleId)
      setArticles(updatedArticles)
      filterAndSortArticles(selectedTopic, sortOption, updatedArticles)
      setShowSuccessModal(true)
    } catch (error) {
      console.error("Delete error:", error)
      setShowErrorModal(true)
    }
  }

  const handleArticlePress = (article) => {
    router.push({
      pathname: '/article-detail',
      params: { id: article.id },
    })
  }

  const handleSearch = () => {
    const trimmedSearch = searchInput.trim()
    setIsSearching(Boolean(trimmedSearch))
    setSearchQuery(trimmedSearch)
    filterAndSortArticles(selectedTopic, sortOption, articles, trimmedSearch)
  }

  const handleSearchChange = (text) => {
    setSearchInput(text)
  }

  const handleSortChange = (value) => {
    setSortOption(value)
    filterAndSortArticles(selectedTopic, value, articles, searchQuery)
  }

  const handleTopicChange = (value) => {
    setSelectedTopic(value)
    filterAndSortArticles(value, sortOption, articles, searchQuery)
  }

  // Helper Functions
  const resetFilters = () => {
    setSearchInput(INITIAL_FILTER_STATE.searchQuery)
    setSearchQuery(INITIAL_FILTER_STATE.searchQuery)
    setSortOption(INITIAL_FILTER_STATE.sortOption)
    setSelectedTopic(INITIAL_FILTER_STATE.selectedTopic)
    setIsSearching(INITIAL_FILTER_STATE.isSearching)
  }

  const getUniqueTopics = (articlesList) => {
    const topics = new Set(articlesList.map(article => article.topic).filter(Boolean))
    const formattedTopics = Array.from(topics).sort().map(topic => ({
      key: topic,
      value: topic
    }))
    return [{ key: '', value: 'All Topics' }, ...formattedTopics]
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

  const filterAndSortArticles = (topic, sort, articlesList, search = searchQuery) => {
    let filtered = [...articlesList]
    
    // Apply topic filter
    if (topic) {
      filtered = filtered.filter(article => article.topic === topic)
    }
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchLower) ||
        article.topic?.toLowerCase().includes(searchLower)
      )
    }
    
    // Apply sort
    const sorted = sortArticles(filtered, sort)
    setFilteredArticles(sorted)
  }

  // Swipeable Components
  const renderRightActions = (progress, dragX, article) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    })

    return (
      <View className="flex-row">
        <TouchableOpacity 
          className="justify-center items-center w-24"
          onPress={() => handleDelete(article.id)}
        >
          <Animated.View style={{ transform: [{ scale }] }}>
            <MaterialIcons name="delete" size={50} color="red" />
          </Animated.View>
        </TouchableOpacity>
      </View>
    )
  }

  const SwipeableArticleCard = ({ article }) => {
    return (
      <Swipeable
        renderRightActions={(progress, dragX) => 
          renderRightActions(progress, dragX, article)
        }
        friction={2}
        rightThreshold={40}
      >
         <ArticleCard 
          key={article.id}
          title={article.title} 
          imageSource={{ uri: article.imageUrl }} 
          pdfUrl={article.pdfUrl} 
          id={article.id} 
          category={article.topic}
          />
      
      </Swipeable>
    )
  }

  // Effects
  useFocusEffect(
    React.useCallback(() => {
      resetFilters()
      if (articles.length > 0) {
        filterAndSortArticles(
          INITIAL_FILTER_STATE.selectedTopic, 
          INITIAL_FILTER_STATE.sortOption, 
          articles
        )
      }
    }, [articles])
  )

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

  // Loading and Error States
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

  // Main Render
  return (
    <SafeAreaView className="flex-1 bg-optimistic-gray-10">
      <StatusBarComponent
        barStyle="light-content"
        backgroundColor={colors.mindfulBrown100}
      />
      
      {showDeleteModal && (
        <ConfirmModal
          isConfirmButton={true}
          isCancelButton={true}
          confirmButtonTitle="Delete"
          cancelButtonTitle="Cancel"
          title="Delete Article"
          subTitle="Are you sure you want to delete this article?"
          handleConfirm={handleConfirmDelete}
          handleCancel={handleCancelDelete}
        />
      )}

      {showSuccessModal && (
        <ConfirmModal
          isConfirmButton={true}
          isCancelButton={false}
          confirmButtonTitle="OK"
          title="Success"
          subTitle="Article deleted successfully"
          handleConfirm={() => setShowSuccessModal(false)}
        />
      )}

      {showErrorModal && (
        <ConfirmModal
          isConfirmButton={true}
          isCancelButton={false}
          confirmButtonTitle="OK"
          title="Error"
          subTitle="Failed to delete article"
          handleConfirm={() => setShowErrorModal(false)}
        />
      )}

      <ScrollView className="flex-1 bg-optimistic-gray-10">
        <TopBrownSearchBar 
          title="Articles Management"
          value={searchInput}
          onChangeText={handleSearchChange}
          onSearch={handleSearch}
        />

        <View className="flex-1 px-4 mt-5">
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
              <SwipeableArticleCard
                key={article.id}
                article={article}
              />
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