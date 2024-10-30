import { View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBrownSearchBar from '../../components/topBrownSearchBar';
import ArticleCard from '../../components/articleCard';
import StatusBarComponent from '../../components/darkThemStatusBar';
import Loading from '../../components/loading';
import { journalStreak } from '../../api/journal';
import { useRoute } from '@react-navigation/native'
import React, { useState } from 'react';
const articles = [
  {
    id: 1,
    title: "Mindful Journal",
    imageUrl: "https://valor-dictus.com/wp-content/uploads/2023/12/Screenshot-2023-12-01-12.24.59-PM.png",
    content: "Detailed article content about mindful journaling...",
  },
  {
    id: 2,
    title: "Coping with Depression",
    imageUrl: "https://www.helpguide.org/wp-content/uploads/2023/02/Coping-with-Depression-scaled.jpeg",
    content: "Article content about coping mechanisms...",
  },
  // Add more articles as needed
];

const ArticleResult = () => {
  const route = useRoute()
  const query = route.params.query
  const [queryInput, setQuery] = useState('')
  const handleArticlePress = (article) => {
    route.push({
      // pathname: '/article-detail',
      // params: { id: article.id },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f5f1' }}>
      <ScrollView style={{ marginBottom: 48 }}>
        <StatusBarComponent barStyle="light-content" backgroundColor="#251404" />
        <TopBrownSearchBar title="Article Finder" value={query} onChangeText={setQuery} />
        <View style={{ backgroundColor: '#f8f5f1', padding: 16, borderRadius: 8, marginBottom: 16 }}>
          {articles.map((article) => (
            <TouchableOpacity
            keyExtractor={(item) => item.key.toString()}
              key={article.id}
              onPress={() => handleArticlePress(article)}
            >
              <ArticleCard
                title={article.title}
                imageSource={{ uri: article.imageUrl }}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ArticleResult;