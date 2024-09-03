import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatusBarComponent from '../../components/darkThemStatusBar';
import BrownPageTitlePortion from '../../components/brownPageTitlePortion';
import FormField from '../../components/formField';
import Dropdown from '../../components/dropdown';
import CustomButton from '../../components/customButton';
import axiosInstance from '../../common/axiosInstance';
import { listOptionSet } from '../../api/option-set';
import { useRoute } from '@react-navigation/native';
import FormField from '../../components/formField'

const UpdateForm = () => {
  const route = useRoute();
  const formId = route.params.formId;
  console.log('Form ID:', formId);

  const [formName, setFormName] = useState("");
  const [storeResponses, setStoreResponses] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [responseTypeList, setResponseTypeList] = useState([]);
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    const fetchFormDetails = async () => {
      try {
        console.log('Fetching form details for Form ID:', formId);
        const response = await axiosInstance.get(`/form/get-form-and-questions/${formId}`);
        console.log('Form details fetched:', response);

        const formDetails = response;
        setFormName(formDetails.form_name);
        setStoreResponses(formDetails.store_responses);
        setQuestions(formDetails.questions.map(q => ({
          ...q,
          editable: false,
          optionSet_id: q.optionSet || '',
        })));
        console.log('Questions after setting state:', formDetails.questions);

        const optionSetResponse = await listOptionSet();
        console.log('Option Set Response:', optionSetResponse);
        setResponseTypeList(optionSetResponse);
      } catch (error) {
        console.error('Error fetching form details:', error);
      }
    };

    fetchFormDetails();
  }, [formId]);

  const getPlaceholder = (optionSetId) => {
    const foundOption = responseTypeList.find(opt => opt.id === optionSetId);
    return foundOption ? foundOption.description : "Select Response Type";
  };

  const toggleEditable = () => {
    setEditable(!editable);
    setQuestions(prevQuestions =>
      prevQuestions.map(q => ({ ...q, editable: !q.editable }))
    );
  };

  const handleSaveChanges = async () => {
    try {
      console.log('Saving changes for Form ID:', formId);
      await axiosInstance.put(`/form/update/${formId}`, {
        form_name: formName,
        store_responses: storeResponses,
        questions: questions.map((q, index) => ({
          question_text: q.question,
          optionSet_id: q.optionSet_id,
          order: index,
        })),
      });
      Alert.alert('Form Updated Successfully');
      toggleEditable();
    } catch (error) {
      console.error('Error saving form:', error);
    }
  };

  const handleDelete = async () => {
    try {
      console.log('Deleting Form ID:', formId);
      await axiosInstance.delete(`/form/delete/${formId}`);
      Alert.alert('Form Deleted Successfully');
      // Add navigation back or any other post-delete action here
    } catch (error) {
      console.error('Error deleting form:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-optimistic-gray-10">
      <StatusBarComponent barStyle="light-content" backgroundColor={colors.mindfulBrown100} />
      <BrownPageTitlePortion title="Form Management" />

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <FormField
          title="Form Name"
          iconName="form-select"
          value={formName}
          handleChange={(value) => setFormName(value)}
          customStyles="mb-4 m-4"
          editable={editable}
        />

        <View className="flex flex-row items-center mb-4 mx-4">
          <Text className="text-mindful-brown-80 font-bold text-[24px]">
            Store Response?
          </Text>
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-end"
            onPress={() => editable && setStoreResponses(!storeResponses)}
          >
            <View
              className={`w-6 h-6 rounded border-2 border-mindful-brown-80 ${
                storeResponses ? 'bg-mindful-brown-80' : ''
              }`}
            />
          </TouchableOpacity>
        </View>

        <View style={{ height: 1, backgroundColor: '#E1E1E0', marginVertical: 10 }} />

        {questions.map((question, index) => {
          const placeholder = getPlaceholder(question.optionSet_id);
          console.log(`Rendering Question ${index + 1}`);
          console.log('Question Details:', question);
          console.log('Selected OptionSet ID:', question.optionSet_id);
          console.log('Placeholder:', placeholder);

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
                handleChange={(value) => {
                  const newQuestions = [...questions];
                  newQuestions[index].question = value;
                  setQuestions(newQuestions);
                }}
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
                data={responseTypeList.map(opt => ({ key: opt.id, value: opt.description }))}
                customStyles="pb-2 mt-2"
                placeHolder={placeholder}
                handleSelect={(value) => {
                  const newQuestions = [...questions];
                  newQuestions[index].optionSet_id = value;
                  setQuestions(newQuestions);
                  console.log(`Option selected for Question ${index + 1}:`, value);
                }}
                disabled={!editable}
              />

              <View className="flex-row justify-between mt-4 mb-4">
                <View className="bg-mindful-brown-70 rounded-full py-3 flex-1 justify-center items-center mr-2">
                  <Text className="text-white text-lg font-bold">Make Changes</Text>
                </View>

                <View className="bg-optimistic-gray-60 rounded-full py-3 flex-1 justify-center items-center ml-2">
                  <Text className="text-white text-lg font-bold">Delete</Text>
                </View>
              </View>

              <View
                style={{ height: 1, backgroundColor: '#E1E1E0', marginVertical: 10 }}
              />
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpdateForm;
