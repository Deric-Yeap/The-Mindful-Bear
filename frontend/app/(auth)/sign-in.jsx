import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const SignIn = () => {
  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="w-full min-h-[100vh] justify-center items-center">
          <Text>SignIn</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn
