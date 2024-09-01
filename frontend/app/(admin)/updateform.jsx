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

const UpdateForm = () => {
  const route = useRoute();
  const formId = route.params.formId; // Extract formId from route params
  console.log('Form ID:', formId);

  const [formName, setFormName] = useState("");
  const [storeResponses, setStoreResponses] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [responseTypeList, setResponseTypeList] = useState([]);
  const [editable, setEditable] = useState(false); // State to toggle editability

  useEffect(() => {
    const fetchFormDetails = async () => {
      try {
        console.log('Fetching form details for Form ID:', formId);
        // Fetch the form details
        const response = await axiosInstance.get(`/form/get-form-and-questions/${formId}`);
        console.log('Form details fetched:', response);

        const formDetails = response;
        setFormName(formDetails.form_name);
        setStoreResponses(formDetails.store_responses);
        setQuestions(formDetails.questions.map(q => ({
          ...q,
          editable: false,
          optionSet_id: q.optionSet || '', // Set optionSet_id based on the data provided
        })));
        console.log('Questions after setting state:', formDetails.questions);

        // Fetch the option sets
        const optionSetResponse = await listOptionSet();
        console.log('Option Set Response:', optionSetResponse);
        setResponseTypeList(optionSetResponse);
      } catch (error) {
        console.error('Error fetching form details:', error);
      }
    };

    fetchFormDetails();
  }, [formId]);

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
      toggleEditable(); // Disable editing after saving
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
      <StatusBarComponent barStyle="light-content" backgroundColor="#251404" />
      <BrownPageTitlePortion title="Form Management" />

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <FormField
          title="Form Name"
          iconName="form-select"
          value={formName}
          handleChange={(value) => setFormName(value)}
          customStyles="mb-4 m-4"
          editable={editable} // Make form name editable if toggle is on
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

        {/* Horizontal Line */}
        <View
          style={{ height: 1, backgroundColor: '#A0A0A0', marginVertical: 10 }}
        />

        {questions.map((question, index) => {
          console.log(`Rendering Question ${index + 1}`);
          console.log('Question Details:', question);

          const placeholder = responseTypeList.find(opt => opt.key === question.optionSet_id)?.value || "Select Response Type";
          console.log(`Placeholder for Question ${index + 1}:`, placeholder);

          return (
            <View key={index} className="mb-4 px-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-mindful-brown-80 font-urbanist-extra-bold text-lg">
                  Question {index + 1}
                </Text>
              </View>

              {/* Text Input for Question */}
              <FormField
                iconName="text-box-outline"
                value={question.question}
                handleChange={(value) => {
                  const newQuestions = [...questions];
                  newQuestions[index].question = value;
                  setQuestions(newQuestions);
                }}
                customStyles="mx-0"
                editable={editable} // Make question editable if toggle is on
                multiline={true} // Enable multiline input
                numberOfLines={4} // Specify a default number of lines
                textAlignVertical="top" // Align text at the top
                style={{
                  minHeight: 50, // Set a minimum height
                  maxHeight: 200, // Set a maximum height
                }}
              />

              {/* Dropdown List for Response Type */}
              <Dropdown
                title="Question Response Type"
                data={responseTypeList}
                customStyles="pb-2 mt-2"
                placeHolder={placeholder}
                handleSelect={(value) => {
                  const newQuestions = [...questions];
                  newQuestions[index].optionSet_id = value;
                  setQuestions(newQuestions);
                }}
                disabled={!editable} // Disable dropdown if not in edit mode
              />

              {/* Buttons Container */}
              <View className="flex-row justify-between mt-4">
                <CustomButton
                  title="Make Changes"
                  handlePress={() => console.log('Make Changes pressed')}
                  buttonStyle="bg-mindful-brown-70 rounded-full flex-1 mr-2"
                />
                <CustomButton
                  title="Delete"
                  handlePress={() => console.log('Delete pressed')}
                  buttonStyle="bg-mindful-brown-70  rounded-full flex-1 mr-2"
                />
              </View>
            </View>
          );
        })}

      </ScrollView>
    </SafeAreaView>
  );
};

export default UpdateForm;
