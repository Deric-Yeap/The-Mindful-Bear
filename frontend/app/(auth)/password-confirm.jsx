import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState, useEffect } from 'react'
import * as Linking from 'expo-linking'
import { router, useLocalSearchParams } from 'expo-router'

import CustomButton from '../../components/customButton'
import FormField from '../../components/formField'
import { passwordConfirm } from '../../api/password-reset'
import Loading from '../../components/loading'
import ConfirmModal from '../../components/confirmModal'

const PasswordReset = () => {
  const { token } = useLocalSearchParams()
  const url = Linking.useURL()
  const [request, setRequest] = useState({
    token: token || '',
    password: '',
  })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState({
    password: '',
  })

  const handleReset = async () => {
    if (request.password !== confirmPassword) {
      setErrorMessage({
        password: 'Passwords do not match.',
      })
      return
    }

    try {
      setErrorMessage({})
      setIsLoading(true)
      const response = await passwordConfirm(request)
      setIsLoading(false)
      setIsModalVisible(true)
    } catch (error) {
      setIsLoading(false)
      if (
        error.response &&
        error.response.data &&
        error.response.data.error_description
      ) {
        const errorDescription = error.response.data.error_description
        if (typeof errorDescription === 'string') {
          setErrorMessage({
            password:
              'The password reset link is invalid or has expired. Please request for a new link.',
          })
        } else if (
          typeof errorDescription === 'object' &&
          errorDescription.password
        ) {
          setErrorMessage({
            password: errorDescription.password[0],
          })
        }
      } else {
        setErrorMessage({
          password: 'An unexpected error occurred. Please try again.',
        })
      }
    }
  }

  return (
    <SafeAreaView>
      {isLoading && (
        <View className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center z-10 bg-optimistic-gray-80/90">
          <Loading />
        </View>
      )}
      {isModalVisible && (
        <ConfirmModal
          title="Password has been reset!"
          subTitle={`Click the button below to sign in`}
          confirmButtonTitle="Sign In"
          isConfirmButton={true}
          handleConfirm={() => {
            setIsModalVisible(false)
            router.push('/sign-in')
          }}
        />
      )}
      <View className="min-h-[78vh] mt-[25vh] items-center mx-5">
        <Text className="font-urbanist-extra-bold text-3xl text-mindful-brown-80 pb-10">
          Password Reset
        </Text>
        <Text className="font-urbanist-medium text-xl text-mindful-brown-80 pb-10">
          Please enter your new password below.
        </Text>
        <FormField
          title="Password"
          iconName="lock-outline"
          value={request.password}
          handleChange={(value) =>
            setRequest((prevRequest) => ({ ...prevRequest, password: value }))
          }
          customStyles="w-full pb-4"
          placeHolder="Enter your password"
          errorMessage=""
        />
        <FormField
          title="Confirm Password"
          iconName="lock-outline"
          value={confirmPassword}
          handleChange={(value) => setConfirmPassword(value)}
          customStyles="w-full pb-4"
          placeHolder="Confirm your password"
          errorMessage={errorMessage.password ? errorMessage.password : ''}
        />
        <CustomButton
          title="Reset Password"
          handlePress={handleReset}
          buttonStyle="w-full mb-10"
          iconName="lock-outline"
        />
      </View>
    </SafeAreaView>
  )
}

export default PasswordReset
