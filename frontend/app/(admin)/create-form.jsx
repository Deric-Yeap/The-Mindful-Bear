import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '../../common/styles'
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
    is_compulsory: false,
    is_presession: false,
    is_postsession: false,
    questions: [
      {
        question: '',
        option_set_id: '',
      },
    ],
  })


  const [errors, setErrors] = useState({
    form_name: '',
    questions: [],
  })


  useEffect(() => {
    const fetchData = async () => {
      try {
        const optionSetResponse = await listOptionSet()
        console.log('Option Set Response:', optionSetResponse)
        setResponseTypeList(optionSetResponse)
      } catch (error) {
        console.error('Error fetching form details:', error)
      }
    }
    fetchData()
  }, [])


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
    setErrors((prevErrors) => ({
      ...prevErrors,
      questions: [...prevErrors.questions, ''],
    }))
  }

  const validateForm = () => {
    let valid = true
    const newErrors = {
      form_name: '',
      questions: [],
    }

   
    if (!request.form_name) {
      newErrors.form_name = 'Form name is required.'
      valid = false
    }

  
    request.questions.forEach((question, index) => {
      if (!question.question) {
        newErrors.questions[index] = 'Question is required.'
        valid = false
      } else {
        newErrors.questions[index] = ''
      }

      if (!question.option_set_id) {
        newErrors.questions[index] += 'Response type is required.'
        valid = false
      }
    })

    setErrors(newErrors)
    return valid
  }

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill out all required fields.')
      return
    }

    try {
      const request_with_order = request.questions.map((question, index) => {
        return { ...question, order: index }
      })
      request.questions = request_with_order
      const response = await CreateFormAndQuestion(request)
     
    } catch (error) {
      console.error(error.response.data.error_description)
    }
  }

  
  const handleTextChange = (index, value) => {
    const newQuestions = [...request.questions]
    newQuestions[index].question = value
    setRequest((prevRequest) => ({
      ...prevRequest,
      questions: newQuestions,
    }))
    setErrors((prevErrors) => {
      const newQuestionsErrors = [...prevErrors.questions]
      newQuestionsErrors[index] = '' // Clear error on change
      return { ...prevErrors, questions: newQuestionsErrors }
    })
  }

  
  const handleResponseTypeChange = (index, value) => {
    const newQuestions = [...request.questions]
    newQuestions[index].option_set_id = value
    setRequest((prevRequest) => ({
      ...prevRequest,
      questions: newQuestions,
    }))
    setErrors((prevErrors) => {
      const newQuestionsErrors = [...prevErrors.questions]
      newQuestionsErrors[index] = newQuestionsErrors[index]?.replace(
        'Response type is required.',
        ''
      ) 
      return { ...prevErrors, questions: newQuestionsErrors }
    })
  }


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
    setErrors((prevErrors) => {
      const newQuestionsErrors = [...prevErrors.questions]
      newQuestionsErrors.splice(index, 1)
      return { ...prevErrors, questions: newQuestionsErrors }
    })
  }

  return (
    <SafeAreaView className="flex-1 bg-optimistic-gray-10">
      <StatusBarComponent
        barStyle="light-content"
        backgroundColor={colors.mindfulBrown100}
      />
      <BrownPageTitlePortion title="Form Management" />

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <FormField
          title="Form Name"
          iconName="form-select"
          value={request.form_name}
          handleChange={(value) => {
            setRequest({ ...request, form_name: value })
            setErrors((prev) => ({ ...prev, form_name: '' })) 
          }}
          customStyles="mb-4 m-4"
        />
        {errors.form_name ? (
          <Text style={{ color: 'red', marginLeft: 16 }}>
            {errors.form_name}
          </Text>
        ) : null}

        <View className="flex flex-row items-center mb-4 mx-4">
          <Text className="text-mindful-brown-80 font-bold text-[18px]">
            Store Response?
          </Text>
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-end"
            onPress={() =>
              setRequest({
                ...request,
                store_responses: !request.store_responses,
              })
            }
          >
            <View
              className={`w-6 h-6 rounded border-2 border-mindful-brown-80 ${
                request.store_responses ? 'bg-mindful-brown-80' : ''
              }`}
            />
          </TouchableOpacity>
        </View>

        {/* Is Compulsory Checkbox */}
        <View className="flex flex-row items-center mb-4 mx-4">
          <Text className="text-mindful-brown-80 font-bold text-[18px]">
            Is the form compulsory?
          </Text>
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-end"
            onPress={() =>
              setRequest({
                ...request,
                is_compulsory: !request.is_compulsory,
              })
            }
          >
            <View
              className={`w-6 h-6 rounded border-2 border-mindful-brown-80 ${
                request.is_compulsory ? 'bg-mindful-brown-80' : ''
              }`}
            />
          </TouchableOpacity>
        </View>

        {/* Is Pre-Session Checkbox */}
        <View className="flex flex-row items-center mb-4 mx-4">
          <Text className="text-mindful-brown-80 font-bold text-[18px]">
            Is the form pre-session?
          </Text>
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-end"
            onPress={() =>
              setRequest({
                ...request,
                is_presession: !request.is_presession,
              })
            }
          >
            <View
              className={`w-6 h-6 rounded border-2 border-mindful-brown-80 ${
                request.is_presession ? 'bg-mindful-brown-80' : ''
              }`}
            />
          </TouchableOpacity>
        </View>

        {/* Is Post-Session Checkbox */}
        <View className="flex flex-row items-center mb-4 mx-4">
          <Text className="text-mindful-brown-80 font-bold text-[18px]">
            Is the form post-session?
          </Text>
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-end"
            onPress={() =>
              setRequest({
                ...request,
                is_postsession: !request.is_postsession,
              })
            }
          >
            <View
              className={`w-6 h-6 rounded border-2 border-mindful-brown-80 ${
                request.is_postsession ? 'bg-mindful-brown-80' : ''
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

          
              <TouchableOpacity
                onPress={() => deleteQuestion(index)}
                className="flex-row items-center"
              >
                <Text className="text-red-500 text-lg mr-4 mb-2">❌</Text>
              </TouchableOpacity>
            </View>

         
            <FormField
              iconName="text-box-outline"
              value={request.questions[index].question}
              handleChange={(value) => handleTextChange(index, value)}
              customStyles="mx-4"
            />
            {errors.questions[index]?.includes('Question is required.') ? (
              <Text style={{ color: 'red', marginLeft: 16 }}>
                {errors.questions[index]}
              </Text>
            ) : null}

         
            <Dropdown
              title="Question Response Type"
              data={responseTypeList.map((opt) => ({
                key: opt.id,
                value: opt.description,
              }))}
              customStyles="pb-6 m-4"
              placeHolder="Select Response Type"
              handleSelect={(value) => handleResponseTypeChange(index, value)}
            />
            {errors.questions[index]?.includes('Response type is required.') ? (
              <Text style={{ color: 'red', marginLeft: 16 }}>
                Response type is required.
              </Text>
            ) : null}
          </View>
        ))}

     
        <CustomButton
          title="Add Question"
          handlePress={addQuestion}
          buttonStyle="mx-4 mb-2"
        />

      
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
