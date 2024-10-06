
import { View, Text, ScrollView} from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import StatusBarComponent from '../../components/darkThemStatusBar'
import TopBrownSearchBar from '../../components/topBrownSearchBar'


const JournalHome = () => {
    return (
        <SafeAreaView className="flex-1 bg-optimistic-gray-10">
          <ScrollView>      
          <StatusBarComponent barStyle="light-content" backgroundColor="#251404" />
          <TopBrownSearchBar title="Article Discovery" />
          
          </ScrollView>
        </SafeAreaView>
      )
}
export default JournalHome