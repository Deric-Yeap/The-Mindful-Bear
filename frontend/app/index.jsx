import { StatusBar } from 'expo-status-bar'
import { ScrollView, Text, View } from 'react-native'
import { Link, router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../components/customButton'

export default function App() {
  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="h-full justify-center items-center min-h-[100vh]">
          <Text className="font-urbanist-black-italic">Landing page</Text>
          <Text className="font-urbanist-thin-italic">
            urbanist font types are declared in tailwindconfig
          </Text>
          <StatusBar style="auto" />
          <Link href="/home" className="text-kind-purple-40 text-lg">
            Jump to home
          </Link>
          <CustomButton
            title="Get Started"
            handlePress={() => router.push('/(auth)/sign-in')}
            buttonStyle="w-60"
            textStyle="text-white"
            isLoading={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
