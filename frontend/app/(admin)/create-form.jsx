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

const CreateForm = () => {
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

  // State for Checkbox
  const [isChecked, setIsChecked] = useState(false)

  // Function to add a new question
  const addQuestion = () => {
    setRequest((prevRequest) => ({
      ...prevRequest,
      questions: [
        ...prevRequest.questions,
        {
          question: '',
          option_set_id: '',
        },
      ],
    }))
  }

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
      <BrownPageTitlePortion title="Form Management" />

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <FormField
          title="Form Name"
          iconName="form-select"
          value={request.form_name}
          handleChange={(value) => setRequest({ ...request, form_name: value })}
          customStyles="mb-4 m-4"
        />

        <View className="flex flex-row items-center mb-4 mx-4">
          <Text className="text-mindful-brown-80 font-bold text-[24px]">
            Store Response?
          </Text>
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-end"
            onPress={() => setIsChecked(!isChecked)}
          >
            <View
              className={`w-6 h-6 rounded border-2 border-mindful-brown-80 ${
                isChecked ? 'bg-mindful-brown-80' : ''
              }`}
            />
          </TouchableOpacity>
        </View>

        {/* Horizontal Line */}
        <View
          style={{ height: 1, backgroundColor: '#A0A0A0', marginVertical: 10 }}
        />

        {request.questions.map((question, index) => (
          <View key={index} className="mb-2">
            <View className="flex-row justify-between items-center">
              <Text className="text-mindful-brown-80 font-urbanist-extra-bold text-lg mb-2 p-4">
                Question {index + 1}
              </Text>

              {/* Delete Question Button */}
              <TouchableOpacity
                onPress={() => deleteQuestion(index)}
                className="flex-row items-center"
              >
                <Text className="text-red-500 text-lg mr-4 mb-2">❌</Text>
              </TouchableOpacity>
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
              title="Question Response Type"
              data={responseTypeList}
              customStyles="pb-6 m-4"
              placeHolder="Select Response Type"
              handleSelect={(value) => handleResponseTypeChange(index, value)}
            />
          </View>
        ))}

        {/* Add Question Button */}
        <CustomButton
          title="Add Question"
          handlePress={addQuestion}
          buttonStyle="mx-4 mb-2"
        />

        {/* Add Question Button */}
        <CustomButton
          title="Save"
          handlePress={handleSave}
          buttonStyle="mx-4"
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default CreateForm
