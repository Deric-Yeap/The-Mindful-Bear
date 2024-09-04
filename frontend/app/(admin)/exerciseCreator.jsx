import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import FormField from '../../components/formField'
import Dropdown from '../../components/dropdown'
import BrownPageTitlePortion from '../../components/brownPageTitlePortion'
import StatusBarComponent from '../../components/darkThemStatusBar'
import CustomButton from '../../components/customButton'
import { CreateFormAndQuestion } from '../../api/form'
import { listOptionSet } from '../../api/option-set'

const CreateExercise = () => {
  const [responseTypeList, setResponseTypeList] = useState([])

  const [request, setRequest] = useState({
    form_name: '',
    store_responses: false,
    questions: [
      {
        question: '',
        option_set_id: '',
      },
    ],
  })


  useEffect(() => {
    const fetchData = async () => {
      try {
        const optionSetResponse = await listOptionSet()
        setResponseTypeList(optionSetResponse)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  const handleSave = async () => {
    try {
      request_with_order = request.questions.map((question, index) => {
        return { ...question, order: index }
      })
      request.questions = request_with_order
      const response = await CreateFormAndQuestion(request)
    } catch (error) {
      console.error(error.response.data.error_description)
    }
  }

  // Function to handle text input change
  const handleTextChange = (index, value) => {
    const newQuestions = [...request.questions]
    newQuestions[index].question = value
    setRequest((prevRequest) => ({
      ...prevRequest,
      questions: newQuestions,
    }))
  }

  // Function to handle response type change
  const handleResponseTypeChange = (index, value) => {
    const newQuestions = [...request.questions]
    newQuestions[index].option_set_id = value
    setRequest((prevRequest) => ({
      ...prevRequest,
      questions: newQuestions,
    }))
  }

  // Function to delete a question
  const deleteQuestion = (index) => {
    if (request.questions.length <= 1) {
      Alert.alert('You need to have at least one question')
      return
    }
    const newQuestions = request.questions.filter((_, i) => i !== index)
    setRequest((prevRequest) => ({
      ...prevRequest,
      questions: newQuestions,
    }))
  }

  return (
    <SafeAreaView className="flex-1 bg-optimistic-gray-10">
      <StatusBarComponent barStyle="light-content" backgroundColor="#251404" />
      <BrownPageTitlePortion title="Exercise Management" />

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <FormField
          title="Exercise Name"
          iconName="form-select"
          value={request.form_name}
          handleChange={(value) => setRequest({ ...request, form_name: value })}
          customStyles="mb-4 m-4"
        />

        

        {/* Horizontal Line */}
        <View
          style={{ height: 1, backgroundColor: '#A0A0A0', marginVertical: 10 }}
        />

        {request.questions.map((question, index) => (
          <View key={index} className="mb-2">
            <View className="flex-row justify-between items-center">
              <Text className="text-mindful-brown-80 font-urbanist-extra-bold text-lg mb-2 p-4">
                Description
              </Text>

              
            </View>

            {/* Text Input for Question */}
            <FormField
              iconName="text-box-outline"
              value={request.questions[index].question}
              handleChange={(value) => handleTextChange(index, value)}
              customStyles="mx-4"
            />

            {/* Dropdown List for Response Type */}
            <Dropdown
              title="Assigned Landmark"
              data={responseTypeList}
              customStyles="pb-6 m-4"
              placeHolder="No Landmark Assigned"
              handleSelect={(value) => handleResponseTypeChange(index, value)}
            />
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  )
}

export default CreateExercise
