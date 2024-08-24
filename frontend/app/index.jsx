import { StatusBar } from 'expo-status-bar'
import { ScrollView, Text, View } from 'react-native'
import { Link, router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../components/customButton'
import { useDispatch, useSelector } from 'react-redux'
import { setUserDetails } from '../redux/slices/userSlice'

export default function App() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)

  const handleUpdateUser = () => {
    dispatch(setUserDetails({ email: 'test@example.com', userId: 55 }))
  }
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
            title="Map"
            handlePress={() => router.push('/(map)/maps')}
            buttonStyle="w-60"
            textStyle="text-white"
            isLoading={false}
          />
          <CustomButton
            title="Get Started"
            handlePress={() => router.push('/(auth)/sign-in')}
            buttonStyle="w-60"
            textStyle="text-white"
            isLoading={false}
          />
          <Text>User ID: {user.userId}</Text>
          <Text>Email: {user.email}</Text>
          <StatusBar style="auto" />
          <CustomButton title="Update User" handlePress={handleUpdateUser} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
