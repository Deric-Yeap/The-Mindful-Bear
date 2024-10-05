import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRoute } from '@react-navigation/native'
import { router } from 'expo-router';
import StatusBarComponent from '../../components/darkThemStatusBar'
import BrownPageTitlePortion from '../../components/brownPageTitlePortion'
import FormField from '../../components/formField'
import Dropdown from '../../components/dropdown'
import CustomButton from '../../components/customButton'
import axiosInstance from '../../common/axiosInstance'
import { listOptionSet } from '../../api/option-set'
import { colors } from '../../common/styles'
import { deleteQuestion, editQuestion } from '../../api/question'
import ConfirmModal from '../../components/confirmModal'
import { deleteForm } from '../../api/form';

const UpdateForm = () => {
  const route = useRoute()
  const formId = route.params.formId
  console.log('Form ID:', formId)

  const [formName, setFormName] = useState('')
  const [storeResponses, setStoreResponses] = useState(false)
  const [questions, setQuestions] = useState([])
  const [responseTypeList, setResponseTypeList] = useState([])
  const [editable, setEditable] = useState(false)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [questionToDelete, setQuestionToDelete] = useState(null)
  const [isEditSuccessModalVisible, setIsEditSuccessModalVisible] = useState(false)
  const [questionChanges, setQuestionChanges] = useState({})
  const [noChangeError, setNoChangeError] = useState({})
  const [handleConfirmCallback, setHandleConfirmCallback] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const fetchFormDetails = async () => {
    try {
      console.log('Fetching form details for Form ID:', formId)
      const response = await axiosInstance.get(
        `/form/get-form-and-questions/${formId}`
      )
      console.log('Form details fetched:', response)

      const formDetails = response
      setFormName(formDetails.form_name)
      setStoreResponses(formDetails.store_responses)
      setQuestions(
        formDetails.questions.map((q) => ({
          ...q,
          editable: false,
          optionSet_id: q.optionSet || '',
        }))
      )
      console.log('Questions after setting state:', formDetails.questions)

      const optionSetResponse = await listOptionSet()
      console.log('Option Set Response:', optionSetResponse)
      setResponseTypeList(optionSetResponse)
    } catch (error) {
      console.error('Error fetching form details:', error)
    }
  }

  useEffect(() => {
    fetchFormDetails()
  }, [formId])

  const getPlaceholder = (optionSetId) => {
    const foundOption = responseTypeList.find((opt) => opt.id === optionSetId)
    return foundOption ? foundOption.description : 'Select Response Type'
  }

  const toggleEditable = () => {
    setEditable(!editable)
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => ({ ...q, editable: !q.editable }))
    )
  }

  const handleSaveChanges = async (questionId) => {
    if (!questionChanges[questionId]) {
      setNoChangeError((prev) => ({ ...prev, [questionId]: true }))
      return
    }

    try {
      const question = questions.find((q) => q.questionID === questionId)
      console.log('Saving changes for Question ID:', questionId)
      await editQuestion(questionId, {
        question: question.question,
        optionSet: question.optionSet,
      })
      fetchFormDetails()
      setIsEditSuccessModalVisible(true)
      setQuestionChanges((prev) => ({ ...prev, [questionId]: false }))
      setNoChangeError((prev) => ({ ...prev, [questionId]: false }))
    } catch (error) {
      console.error('Error saving question:', error)
    }
  }

  const handleDeleteConfirm = async () => {
    if (questionToDelete) {
      try {
        const response = await deleteQuestion(questionToDelete)
        console.log(response)
        fetchFormDetails() // Fetch the form details again after deletion
        setIsDeleteModalVisible(false)
        setQuestionToDelete(null)
      } catch (error) {
        console.error('Error deleting question:', error)
      }
    }
  }

  const handleChange = (setter, questionId) => (value) => {
    setter(value)
    setQuestionChanges((prev) => ({ ...prev, [questionId]: true }))
    setNoChangeError((prev) => ({ ...prev, [questionId]: false }))
  }

  const handleDeleteForm = async (formId) => {
    try {
      setIsConfirmModalOpen(true);

      const confirmDelete = new Promise((resolve) => {
        const handleConfirm = () => {
          setIsConfirmModalOpen(false);
          resolve(true);
        };
        setHandleConfirmCallback(() => handleConfirm);
      });

      const result = await confirmDelete;
      if (result) {
        await deleteForm(formId);        
        setIsSuccessModalOpen(true);
      }
    } catch (error) {
      console.error(`Error deleting form with ID: ${formId}`, error);
    }
  };

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
          value={formName}
          handleChange={handleChange(setFormName, 'formName')}
          customStyles="mb-4 m-4"
          editable={editable}
        />

        <View className="flex flex-row items-center mb-4 mx-4">
          <Text className="text-mindful-brown-80 font-bold text-[24px]">
            Store Response?
          </Text>
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-end"
            onPress={() => editable && handleChange(setStoreResponses, 'storeResponses')(!storeResponses)}
          >
            <View
              className={`w-6 h-6 rounded border-2 border-mindful-brown-80 ${
                storeResponses ? 'bg-mindful-brown-80' : ''
              }`}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{ height: 1, backgroundColor: '#E1E1E0', marginVertical: 10 }}
        />

        {questions.map((question, index) => {
          const placeholder = getPlaceholder(question.optionSet_id)
          console.log(`Rendering Question ${index + 1}`)
          console.log('Question Details:', question)
          console.log('Selected OptionSet ID:', question.optionSet_id)
          console.log('Placeholder:', placeholder)

          return (
            <View key={index} className="mb-4 px-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-mindful-brown-80 font-urbanist-extra-bold text-lg">
                  Question {index + 1}
                </Text>
              </View>

              <FormField
                iconName="text-box-outline"
                value={question.question}
                handleChange={handleChange((value) => {
                  const newQuestions = [...questions]
                  newQuestions[index].question = value
                  setQuestions(newQuestions)
                }, question.questionID)}
                customStyles="mx-0"
                editable={editable}
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
                style={{
                  minHeight: 50,
                  maxHeight: 200,
                }}
              />

              <Dropdown
                title="Question Response Type"
                data={responseTypeList.map((opt) => ({
                  key: opt.id,
                  value: opt.description,
                }))}
                customStyles="pb-2 mt-2"
                placeHolder={placeholder}
                handleSelect={handleChange((value) => {
                  console.log('here', value)
                  const newQuestions = [...questions]
                  newQuestions[index].optionSet = value
                  setQuestions(newQuestions)
                  console.log(
                    `Option selected for Question ${index + 1}:`,
                    value
                  )
                }, question.questionID)}
                disabled={!editable}
              />

              <View className="flex-row justify-between mt-4 mb-4">
                <CustomButton
                  title="Save Change"
                  handlePress={() => handleSaveChanges(question.questionID)}
                  buttonStyle={`w-[45vw] ${!questionChanges[question.questionID] ? 'bg-mindful-brown-30' : ''}`}
                />
                <CustomButton
                  title="Delete"
                  handlePress={() => {
                    setQuestionToDelete(question.questionID)
                    setIsDeleteModalVisible(true)
                  }}
                  buttonStyle="w-[45vw] bg-present-red-70"
                />
              </View>

              {noChangeError[question.questionID] && (
                <Text className="text-red-500 text-center">
                  There are no changes to save.
                </Text>
              )}

              <View
                style={{
                  height: 1,
                  backgroundColor: '#E1E1E0',
                  marginVertical: 10,
                }}
              />
            </View>
          )
        })}
        <View className="m-4">
          <CustomButton
            title="Delete Form"
            handlePress={() => handleDeleteForm(formId)}
            buttonStyle="w-full bg-mindfulBrown90"
          />
        </View>
      </ScrollView>

      {isDeleteModalVisible && (
        <ConfirmModal
          title="Are you sure?"
          subTitle={`You are about to delete the question`}
          isCancelButton={true}
          cancelButtonTitle={'Cancel'}
          handleCancel={() => {
            setIsDeleteModalVisible(false)
            setQuestionToDelete(null)
          }}
          confirmButtonTitle="Delete"
          isConfirmButton={true}
          handleConfirm={handleDeleteConfirm}
        />
      )}
      {isEditSuccessModalVisible && (
        <ConfirmModal
          title="Success"
          subTitle={`The question has been successfully edited.`}
          isCancelButton={false}
          confirmButtonTitle="OK, Thanks!"
          isConfirmButton={true}
          handleConfirm={() => setIsEditSuccessModalVisible(false)}
        />
      )}

      {isConfirmModalOpen && (
        <ConfirmModal
          isConfirmButton
          isCancelButton
          // imageSource={confirmModal}
          confirmButtonTitle="Confirm"
          cancelButtonTitle="Cancel"
          title="Are you sure?"
          subTitle="Do you really want to delete this form?"
          handleConfirm={handleConfirmCallback}
          handleCancel={() => setIsConfirmModalOpen(false)}
        />
      )}

      {isSuccessModalOpen && (
        <ConfirmModal
          isConfirmButton
          isCancelButton={false}
          // imageSource={confirmModal}
          confirmButtonTitle="Ok"
          title="Form Deleted"
          subTitle="Form has been successfully deleted!"
          handleConfirm={() => {
            setIsSuccessModalOpen(false);
            router.push('/form')
          }}
        />
      )}
    </SafeAreaView>
  )
}

export default UpdateForm