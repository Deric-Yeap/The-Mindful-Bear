import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import TopBrownSearchBar from '../../components/topBrownSearchBar';
import ArticleCard from '../../components/articleCard';
import StatusBarComponent from '../../components/darkThemStatusBar';
import Loading from '../../components/loading';
import { journalStreak } from '../../api/journal';

const articles = [
  {
    id: 1,
    title: "Mindful Journal",
    imageUrl: "https://i.pinimg.com/enabled_lo/564x/5c/c7/4b/5cc74b542c4315e3bc2cb6288007001b.jpg",
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
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [streak, setStreak] = useState(0);

  const handleArticlePress = (article) => {
    console.log(`Navigating to article with ID: ${article.id}`); // Debugging log
    router.push(`/(article)/article-detail?id=${article.id}`);
    
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f5f1' }}>
      <ScrollView style={{ marginBottom: 48 }}>
        <StatusBarComponent barStyle="light-content" backgroundColor="#251404" />
        <TopBrownSearchBar title="Article Finder" />
        <View style={{ backgroundColor: '#f8f5f1', padding: 16, borderRadius: 8, marginBottom: 16 }}>
          {articles.map((article) => (
            <TouchableOpacity 
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
