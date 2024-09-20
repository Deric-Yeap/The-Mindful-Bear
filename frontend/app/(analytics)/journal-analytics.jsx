import React, { useState, useEffect } from 'react';
import {View, Text, TouchableOpacity, FlatList, ActivityIndicator,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBrownSearchBar from '../../components/topBrownSearchBar';
import StatusBarComponent from '../../components/darkThemStatusBar';
import { Link } from 'expo-router';
import { router } from 'expo-router';
import axiosInstance from '../../common/axiosInstance';
import { colors } from '../../common/styles';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon
import Loading from '../../components/loading'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const journalAnalytics = () => {
  return (
    <SafeAreaView className="bg-optimistic-gray-10 flex-1">
      <StatusBarComponent barStyle="light-content" backgroundColor={colors.mindfulBrown100}/>
      <TopBrownSearchBar title="Mindful Journal Analytics" />

     
      
    </SafeAreaView>
  );
};

export default journalAnalytics;
