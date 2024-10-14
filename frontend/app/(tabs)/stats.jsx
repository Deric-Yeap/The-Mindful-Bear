import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import StatusBarComponent from '../../components/darkThemStatusBar'
import TopBrownSearchBar from '../../components/topBrownSearchBar'
import { colors } from '../../common/styles'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { featureFlags } from '../../common/featureFlags'
import AnalyticsTabs from '../../components/analytics/analyticsTabs'

const analytics = () => {
  return (
    <SafeAreaView className="bg-optimistic-gray-10 flex-1">
      <StatusBarComponent
        barStyle="light-content"
        backgroundColor={colors.mindfulBrown100}
      />
      <TopBrownSearchBar title="Analytics" />
      <AnalyticsTabs />
    </SafeAreaView>
  )
}

export default analytics
