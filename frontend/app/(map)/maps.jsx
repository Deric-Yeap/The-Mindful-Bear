import React from 'react'

import { SafeAreaView } from 'react-native-safe-area-context'
import { View, StyleSheet, Text, ScrollView } from 'react-native'

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  map: {
    flex: 1,
    alignSelf: 'stretch',
  },
})

const Map = () => {
  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View>
          <Text>Hi</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Map
