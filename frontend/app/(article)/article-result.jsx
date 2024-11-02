import { View, ScrollView, TextInput, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBrownSearchBar from '../../components/topBrownSearchBar';
import ArticleCard from '../../components/articleCard';
import { useRouter } from 'expo-router';
import StatusBarComponent from '../../components/darkThemStatusBar';
import Loading from '../../components/loading';
import { journalStreak } from '../../api/journal';
import { useRoute } from '@react-navigation/native'
import React, { useState, useEffect } from 'react';
import { getArticles } from '../../api/article'
import { colors } from '../../common/styles'

const ArticleResult = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState([]);

  const route = useRoute()
  const query = route.params.query
  const [queryInput, setQuery] = useState('')

  // const handleArticlePress = (article) => {
  //   console.log(`Navigating to article with ID: ${article.id}`); // Debugging log
  //   router.push(`/(article)/article-detail?id=${article.id}`);
    
  // };

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const response = await getArticles();
        console.log(response)
        // Assuming response.data contains the array of articles
        const formattedArticles = response.map(article => ({
          id: article.article_id,
          title: article.title,
          imageUrl: article.article_image_url,
          content: article.processed_contents,
          pdfUrl: article.article_pdf_url,
          topic: article.topic
        }));
        setArticles(formattedArticles);
      } catch (error) {
        setError(
          error.response?.data || error.request
            ? 'No response received from the server.'
            : error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.optimisticGray10 }}>
        <Loading />
      </View>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-optimistic-gray-10 justify-center items-center">
        <Text>Error fetching data: {error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f5f1' }}>
      <ScrollView style={{ marginBottom: 48 }}>
        <StatusBarComponent barStyle="light-content" backgroundColor="#251404" />

        <TopBrownSearchBar title="Article Finder" value={query} onChangeText={setQuery} />
        <View style={{ backgroundColor: '#f8f5f1', padding: 16, borderRadius: 8, marginBottom: 16 }}>
          {articles.map((article) => (
            <TouchableOpacity 
              key={article.id}              
            >
              <ArticleCard
                title={article.title}
                imageSource={{ uri: article.imageUrl }}
                pdfUrl={article.pdfUrl}
                id = {article.id}
                category = {article.topic}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ArticleResult;