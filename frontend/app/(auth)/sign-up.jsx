import { View, Text, ScrollView, StatusBar } from 'react-native'
import { useState, useEffect } from 'react'
import { router } from 'expo-router'

import CustomButton from '../../components/customButton'
import FormField from '../../components/formField'
import Dropdown from '../../components/dropdown'
import DatePicker from '../../components/datePicker'
import { create } from '../../api/user'
import { listGender } from '../../api/gender'
import { listDepartment } from '../../api/department'
import Loading from '../../components/loading'

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({
    email: '',
    name: '',
    password: '',
    confirm_password: '',
    gender: '',
    department: '',
    date_of_birth: new Date().toISOString().split('T')[0],
  })

  const [genderList, setGenderList] = useState([])
  const [departmentList, setDepartmentList] = useState([])
  const [errorMessage, setErrorMessage] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const genderResponse = await listGender()
        setGenderList(genderResponse)

        const departmentResponse = await listDepartment()
        setDepartmentList(departmentResponse)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  const handleSignUp = async () => {
    try {
      setIsLoading(true)
      setErrorMessage({})
      const response = await create(form)
      setIsLoading(false)
      router.push('/sign-in')
    } catch (error) {
      setIsLoading(false)
      setErrorMessage(error.response.data.error_description)
    }
  }
  return (
    <ScrollView>
      <StatusBar barStyle="light-content" />
      <View className="absolute top-[-500px] left-0 right-0 items-center z-10">
        <View className="bg-mindful-brown-80 h-[150vw] w-[150vw] rounded-full"></View>
      </View>
      {isLoading && (
        <View className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center z-10 bg-optimistic-gray-80/90">
          <Loading />
        </View>
      )}
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
          errorMessage={errorMessage.email ? errorMessage.email : ''}
        />
        <FormField
          title="Password"
          iconName="lock-outline"
          value={form.password}
          handleChange={(value) => setForm({ ...form, password: value })}
          customStyles="w-full pb-6"
          errorMessage={errorMessage.password ? errorMessage.password : ''}
        />
        <FormField
          title="Password Confirmation"
          iconName="lock-outline"
          value={form.confirm_password}
          handleChange={(value) =>
            setForm({ ...form, confirm_password: value })
          }
          customStyles="w-full pb-6"
          errorMessage={
            errorMessage.confirm_password ? errorMessage.confirm_password : ''
          }
        />
        <FormField
          title="Name"
          iconName="card-account-details-outline"
          value={form.name}
          handleChange={(value) => setForm({ ...form, name: value })}
          customStyles="w-full pb-4"
          errorMessage={errorMessage.name ? errorMessage.name : ''}
        />

        <Dropdown
          title="Department"
          data={departmentList}
          customStyles="w-full pb-6"
          placeHolder="Select Department"
          handleSelect={(value) => setForm({ ...form, department: value })}
          errorMessage={errorMessage.department ? errorMessage.department : ''}
        />

        <Dropdown
          title="Gender"
          data={genderList}
          customStyles="w-full pb-6"
          placeHolder="Select Gender"
          handleSelect={(value) => setForm({ ...form, gender: value })}
          errorMessage={errorMessage.gender ? errorMessage.gender : ''}
        />

        <DatePicker
          title="Date of Birth"
          customStyles="w-full pb-6"
          onDateChange={(selectedDate) => {
            setForm({
              ...form,
              date_of_birth: selectedDate.toISOString().split('T')[0],
            })
          }}
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
