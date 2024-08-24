import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/customButton'
import { login } from '../../api/user'
import { useDispatch, useSelector } from 'react-redux'
import { setTokens } from '../../redux/slices/authSlice'

const SignIn = () => {
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth)
  const handleLogin = async () => {
    try {
      const response = await login({
        email: 'owg321@gmail.com',
        password: 'Themindfulbear123!',
      })
      dispatch(
        setTokens({
          token: response.access,
          refreshToken: response.refresh,
        })
      )
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="w-full min-h-[100vh] justify-center items-center">
          <Text>SignIn</Text>
          <CustomButton title="Login" handlePress={handleLogin} />
          {auth.token && <Text>Token:{auth.token}</Text>}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn
