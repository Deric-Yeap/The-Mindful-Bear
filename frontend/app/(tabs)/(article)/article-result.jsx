import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useRoute } from '@react-navigation/native'

// Components
import TopBrownSearchBar from '../../../components/topBrownSearchBar'
import ArticleCard from '../../../components/articleCard'
import StatusBarComponent from '../../../components/darkThemStatusBar'
import Loading from '../../../components/loading'

// API and Utilities
import { semanticSearch } from '../../../api/article'
import { recordClick } from '../../../api/searchHistory'
import { colors } from '../../../common/styles'

const initialState = {
  loading: true,
  error: null,
  articles: [],
  currentQuery: '',
  searchInput: '',
  refreshing: false,
}

const ArticleResult = () => {
  const router = useRouter()
  const route = useRoute()
  const initialQuery = route.params?.query || ''

  const [state, setState] = useState({
    ...initialState,
    currentQuery: initialQuery,
    searchInput: initialQuery,
  })

  const performSearch = useCallback(
    async (searchQuery, isRefreshing = false) => {
      if (!searchQuery?.trim()) {
        setState((prev) => ({
          ...prev,
          loading: false,
          refreshing: false,
          articles: [],
          error: null,
        }))
        return
      }

      if (!isRefreshing) {
        setState((prev) => ({ ...prev, loading: true, error: null }))
      }

      try {
        const response = await semanticSearch(searchQuery)
        if (!response) throw new Error('No response received from server')

        const { results } = response
        if (!Array.isArray(results)) throw new Error('Invalid response format')

        const formattedArticles = results
          .map((article) => {
            if (!article.article_id || !article.title) {
              console.warn('Article missing required fields:', article)
              return null
            }
            return {
              id: article.article_id,
              title: article.title,
              imageUrl: article.article_image_url || null,
              content: article.processed_contents || '',
              pdfUrl: article.article_pdf_url || null,
              topic: article.topic || 'Uncategorized',
            }
          })
          .filter(Boolean)

        setState((prev) => ({
          ...prev,
          articles: formattedArticles,
          currentQuery: searchQuery,
          loading: false,
          refreshing: false,
          error: null,
        }))
      } catch (error) {
        console.error('Search error:', error)
        let errorMessage = 'An unexpected error occurred'

        if (error.response) {
          errorMessage =
            error.response.data?.message ||
            `Server error: ${error.response.status}`
        } else if (error.request) {
          errorMessage =
            'No response from server. Please check your connection.'
        } else if (error.message) {
          errorMessage = error.message
        }

        setState((prev) => ({
          ...prev,
          error: errorMessage,
          loading: false,
          refreshing: false,
        }))

        if (!isRefreshing) {
          Alert.alert('Search Error', errorMessage, [
            { text: 'OK', onPress: () => console.log('Error alert closed') },
          ])
        }
      }
    },
    []
  )

  const handleRefresh = useCallback(() => {
    setState((prev) => ({ ...prev, refreshing: true }))
    performSearch(state.currentQuery, true)
  }, [state.currentQuery, performSearch])

  const handleSearch = useCallback(() => {
    if (state.searchInput?.trim()) {
      performSearch(state.searchInput)
    }
  }, [state.searchInput, performSearch])

  const handleSearchInputChange = useCallback((text) => {
    setState((prev) => ({ ...prev, searchInput: text }))
  }, [])

  const handleArticleClick = useCallback(
    async (articleId, index) => {
      console.log('Click handler triggered:', {
        articleId,
        index,
        currentQuery: state.currentQuery,
      })

      try {
        if (!articleId || !state.currentQuery) {
          console.warn('Missing required data for click tracking')
        } else {
          const rankPosition = index + 1

          try {
            const response = await recordClick({
              query: state.currentQuery,
              articleID: articleId,
              rankPosition,
            })
            console.log('Click tracked successfully:', response)
          } catch (trackingError) {
            console.error('Click tracking failed:', trackingError)
          }
        }

        // Always navigate even if tracking fails
        // router.push(`/(article)/article-pdf-viewer?id=${articleId}`);
      } catch (error) {
        console.error('Error in click handler:', error)
        // Still try to navigate
        // router.push(`/(article)/article-pdf-viewer?id=${articleId}`);
      }
    },
    [state.currentQuery, router]
  )

  useEffect(() => {
    performSearch(initialQuery)
  }, [initialQuery, performSearch])

  const renderLoading = () => (
    <View style={styles.centerContainer}>
      <Loading />
    </View>
  )

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{state.error}</Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={() => performSearch(state.currentQuery)}
      >
        <Text style={styles.retryButtonText}>Retry Search</Text>
      </TouchableOpacity>
    </View>
  )

  const renderArticles = () => (
  <View style={styles.articlesContainer}>
    {state.articles.length > 0 ? (
      state.articles.map((article, index) => (
        <ArticleCard 
        key={article.id}
        title={article.title} 
        imageSource={{ uri: article.imageUrl }} 
        pdfUrl={article.pdfUrl} 
        id={article.id} 
        index = {index}
        category={article.topic}
        onArticleClick={handleArticleClick}
        />
      ))
    ) : (
      <View style={styles.noResultsContainer}>
        <Text style={styles.noResultsText}>
          No articles found for "{state.currentQuery}". Please try a different search term.
        </Text>
      </View>
    )}
  </View>
);

  const renderContent = () => {
    if (state.loading && !state.refreshing) return renderLoading()
    if (state.error) return renderError()
    return renderArticles()
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBarComponent barStyle="light-content" backgroundColor="#251404" />
      <TopBrownSearchBar
        title="Article Finder"
        value={state.searchInput}
        onChangeText={handleSearchInputChange}
        onSearch={handleSearch}
        disabled={!state.searchInput?.trim() || state.loading}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl
            refreshing={state.refreshing}
            onRefresh={handleRefresh}
            colors={['#251404']}
            tintColor="#251404"
          />
        }
      >
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f5f1' },
  scrollView: { flex: 1 },
  scrollViewContent: { flexGrow: 1, paddingBottom: 48 },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.optimisticGray10,
  },
  articlesContainer: {
    backgroundColor: '#f8f5f1',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  noResultsContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsText: { fontSize: 16, color: '#666', textAlign: 'center' },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.optimisticGray10,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: '20',
  },
  retryButton: {
    backgroundColor: '#251404',
    paddingHorizontal: '20',
    paddingVertical: '10',
    borderRadius: '5',
  },
  retryButtonText: { color: '#fff', fontSize: '16' },
})

export default ArticleResult
