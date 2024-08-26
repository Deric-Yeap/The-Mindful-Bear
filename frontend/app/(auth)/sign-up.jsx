import { View, Text, ScrollView, StatusBar } from 'react-native'
import { useState } from 'react'
import { router } from 'expo-router'

import CustomButton from '../../components/customButton'
import FormField from '../../components/formField'
import { create } from '../../api/user'

const SignUp = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleSignUp = async () => {
    try {
      const response = await create({
        email: form.email,
        password: form.password,
        confirm_password: form.confirmPassword,
      })
      router.push('/sign-in')
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <ScrollView>
      <StatusBar barStyle="light-content" />
      <View className="absolute top-[-500px] left-0 right-0 items-center z-10">
        <View className="bg-mindful-brown-80 h-[150vw] w-[150vw] rounded-full"></View>
      </View>
      <View className="min-h-[78vh] mt-[25vh] items-center mx-5">
        <Text className="font-urbanist-extra-bold text-3xl text-mindful-brown-80 pb-10">
          Sign Up
        </Text>
        <FormField
          title="Email Address"
          iconName="email-outline"
          value={form.email}
          handleChange={(value) => setForm({ ...form, email: value })}
          customStyles="w-full pb-4"
          keyboardType="email-address"
        />
        <FormField
          title="Password"
          iconName="lock-outline"
          value={form.password}
          handleChange={(value) => setForm({ ...form, password: value })}
          customStyles="w-full pb-6"
        />
        <FormField
          title="Password Confirmation"
          iconName="lock-outline"
          value={form.confirmPassword}
          handleChange={(value) => setForm({ ...form, confirmPassword: value })}
          customStyles="w-full pb-6"
        />
        <CustomButton
          title="Sign Up"
          handlePress={handleSignUp}
          buttonStyle="w-full mb-10"
        />

        <Text className="text-optimistic-gray-80 font-urbanist-medium pb-4">
          Already have an account?{' '}
          <Text
            className="font-urbanist-semi-bold text-serenity-green-50 underline"
            onPress={() => router.push('/sign-in')}
          >
            Sign In
          </Text>
        </Text>
      </View>
    </ScrollView>
  )
}

export default SignUp
