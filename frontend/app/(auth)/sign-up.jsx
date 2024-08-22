import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const SignUp = () => {
  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="w-full min-h-[100vh] justify-center items-center">
          <Text>SignUp</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp