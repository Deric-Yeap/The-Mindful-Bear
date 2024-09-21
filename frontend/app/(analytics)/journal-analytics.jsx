import React, { useState, useEffect } from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BrownPageTitlePortion from '../../components/brownPageTitlePortion';
import StatusBarComponent from '../../components/darkThemStatusBar';
import { colors } from '../../common/styles';
import { listEmotion } from '../../api/emotion'

const journalAnalytics = () => {
    const [emotions, setEmotions] = useState([])
    useEffect(() => {
        const fetchData = async () => {
          try {
            const emotionResponse = await listEmotion()
            setEmotions(emotionResponse)
          } catch (error) {
            console.error(error)
          } finally {
            setLoading(false)
          }
        }
        fetchData()
      }, [])
  return (
    <SafeAreaView className="bg-optimistic-gray-10 flex-1">
      <StatusBarComponent barStyle="light-content" backgroundColor={colors.mindfulBrown100}/>
      <BrownPageTitlePortion title="Mindful Journal Analytics" />
      <Text className="text-mindful-brown-80 font-urbanist-bold text-lg mt-4 mb-4">Primary Emotions</Text>
      {emotions
        .filter((emotion) => emotion.level === 'Inner')
        .map((emotion) => (
        <Text className="font-urbanist-semi-bold text-mindful-brown-80">
        {emotion.name}
        </Text>
            
        ))}
            
      
    </SafeAreaView>
  );
};

export default journalAnalytics;
