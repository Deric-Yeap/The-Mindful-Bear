import { View, Text, ScrollView, StatusBar } from 'react-native'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/customButton'
import FormField from '../../components/formField'
import { login, getMe } from '../../api/user'
import { useDispatch, useSelector } from 'react-redux'
import { setTokens } from '../../redux/slices/authSlice'
import { router } from 'expo-router'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

const SignIn = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth)
  const handleLogin = async () => {
    try {
      const response = await login({
        email: form.email,
        password: form.password,
      })      
      dispatch(
        setTokens({
          token: response.access,
          refreshToken: response.refresh,
        })
      )
      const user = await getMe()      
      if (user.is_staff){                
        router.push('/admin')
      }
      else{
        router.push('/home')
      }
      // router.push('/home')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    // <SafeAreaView className="relative h-full bg-mindful-brown-10">
    <ScrollView>
      <StatusBar barStyle="light-content" />
      <View className="absolute top-[-500px] left-0 right-0 items-center z-10">
        <View className="bg-mindful-brown-80 h-[150vw] w-[150vw] rounded-full"></View>
      </View>
      <View className="min-h-[78vh] mt-[25vh] items-center mx-5">
        <Text className="font-urbanist-extra-bold text-3xl text-mindful-brown-80 pb-10">
          Sign In
        </Text>
        <FormField
          title="Email Address"
          iconName="email-outline"
          value={form.email}
          handleChange={(value) => setForm({ ...form, email: value })}
          customStyles="w-full pb-4"
          keyboardType="email-address"
          placeHolder="Enter your email address"
          errorMessage="If you want to hide it pass in nothing to errorMessage :)"
        />
        <FormField
          title="Password"
          iconName="lock-outline"
          value={form.password}
          handleChange={(value) => setForm({ ...form, password: value })}
          customStyles="w-full pb-6"
        />
        <CustomButton
          title="Sign In"
          handlePress={handleLogin}
          buttonStyle="w-full mb-10"
        />

        <Text className="text-optimistic-gray-80 font-urbanist-medium pb-4">
          Don't have an account?{' '}
          <Text
            className="font-urbanist-semi-bold text-serenity-green-50 underline"
            onPress={() => router.push('/sign-up')}
          >
            Sign Up
          </Text>
        </Text>

        <Text
          className="font-urbanist-semi-bold text-serenity-green-50 underline"
          onPress={() => router.push('/password-reset')}
        >
          Forgot Password
        </Text>
      </View>
    </ScrollView>
    // </SafeAreaView>
  )
}

export default SignIn
