import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState, useEffect } from 'react'
import { router } from 'expo-router'

import CustomButton from '../../components/customButton'
import FormField from '../../components/formField'
import { passwordResetLink } from '../../api/password-reset'
import BackButton from '../../components/backButton'
import ConfirmModal from '../../components/confirmModal'
import Loading from '../../components/loading'

const PasswordReset = () => {
  const [request, setRequest] = useState({
    email: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState({
    email: '',
  })

  const handleReset = async () => {
    try {
      setErrorMessage({})
      setIsLoading(true)
      const response = await passwordResetLink(request)
      setIsLoading(false)
      setIsModalVisible(true)
    } catch (error) {
      setIsLoading(false)
      setErrorMessage({ email: error.response.data.error_description.email[0] })
    }
  }

  return (
    <SafeAreaView>
      <BackButton buttonStyle={'mx-5'} />
      {isLoading && (
        <View className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center z-10 bg-optimistic-gray-80/90">
          <Loading />
        </View>
      )}
      {isModalVisible && (
        <ConfirmModal
          title="Check your email!"
          subTitle={`A password reset link has been sent to ${request.email}`}
          confirmButtonTitle="Okay"
          isConfirmButton={true}
          handleConfirm={() => {
            setIsModalVisible(false)
            router.push('/sign-in')
          }}
        />
      )}
      <View className="min-h-[78vh] mt-[25vh] items-center mx-5">
        <Text className="font-urbanist-extra-bold text-3xl text-mindful-brown-80 pb-10">
          Forget Password
        </Text>
        <Text className="font-urbanist-medium text-xl text-mindful-brown-80 pb-10">
          Enter your email address to receive the reset password link.
        </Text>
        <FormField
          title="Email Address"
          iconName="email-outline"
          value={request.email}
          handleChange={(value) => setRequest({ email: value })}
          customStyles="w-full pb-4"
          keyboardType="email-address"
          placeHolder="Enter your email address"
          errorMessage={errorMessage.email ? errorMessage.email : ''}
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
