import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker'; // Import the Picker component
import BrownPageTitlePortion from '../../components/brownPageTitlePortion';
import StatusBarComponent from '../../components/darkThemStatusBar';

const CreateForm = () => {
  const [responseType] = useState([
    { name: 'Rating', key: '1' },
    { name: 'Likert Scale - How Often', key: '2' },
    { name: 'Likert Scale - How Tired', key: '3' },
    { name: 'Likert Scale - How Unlikely', key: '4' },
    { name: 'Open Ended Question', key: '5' },
  ]);

  // State for the questions
  const [questions, setQuestions] = useState([{ text: '', responseType: '' }]);

  // State for Checkbox
  const [isChecked, setIsChecked] = useState(false);

  // Function to add a new question
  const addQuestion = () => {
    setQuestions([...questions, { text: '', responseType: '' }]);
  };

  // Function to handle text input change
  const handleTextChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].text = value;
    setQuestions(newQuestions);
  };

  // Function to handle response type change
  const handleResponseTypeChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].responseType = value;
    setQuestions(newQuestions);
  };

  // Function to delete a question
  const deleteQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  return (
    <SafeAreaView className="flex-1 bg-optimistic-gray-10">
      <StatusBarComponent barStyle="light-content" backgroundColor="#251404" />
      <BrownPageTitlePortion title="Form Management" />

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <Text className="text-mindful-brown-80 font-bold text-3xl mb-4 p-4 text-[24px]">
          Form Name
        </Text>

        <View className="border-mindful-brown-30 border-[5px] rounded-full mb-4 mx-4">
          <TextInput
            placeholder="Type your answer here"
            className="border mindful-brown-80 border-[2px] rounded-full h-[50px] w-full px-4"
            placeholderTextColor="#A0A0A0"
          />
        </View>

        <TouchableOpacity
          className="flex-row items-center mb-4 mx-4 justify-between"
          onPress={() => setIsChecked(!isChecked)}
        >
          <Text className="text-mindful-brown-80 font-bold text-[24px]">
            Store Response?
          </Text>
          <View
            className={`w-6 h-6 rounded border-2 border-mindful-brown-80 ${
              isChecked ? 'bg-mindful-brown-80' : ''
            }`}
          />
        </TouchableOpacity>

        {/* Horizontal Line */}
        <View style={{ height: 1, backgroundColor: '#A0A0A0', marginVertical: 10 }} />

        {questions.map((question, index) => (
          <View key={index} className="mb-4">
            <View className="flex-row justify-between items-center">
              <Text className="text-mindful-brown-80 font-bold text-3xl mb-2 p-4 text-[24px]">
                Question {index + 1}
              </Text>

              {/* Delete Question Button */}
              <TouchableOpacity onPress={() => deleteQuestion(index)} className="flex-row items-center">
                <Text className="text-red-500 text-lg mr-4 mb-2">❌</Text>
              </TouchableOpacity>
            </View>

            {/* Text Input for Question */}
            <View className="border-mindful-brown-30 border-[5px] rounded-full mb-4 mx-4">
              <TextInput
                onChangeText={(value) => handleTextChange(index, value)}
                value={question.text}
                placeholder="Type your answer here"
                className="border mindful-brown-80 border-[2px] rounded-full h-[50px] w-full px-4"
                placeholderTextColor="#A0A0A0"
              />
            </View>

            <Text className="text-mindful-brown-80 font-bold text-3xl mb-2 p-4 text-[24px]">
              Question Response Type
            </Text>

            {/* Dropdown List for Response Type */}
            <View className="rounded-full mb-4 mx-4 bg-[#9BB167] text-color-[#FFFFFF] text-white">
              <Picker
                selectedValue={question.responseType}
                onValueChange={(itemValue) => handleResponseTypeChange(index, itemValue)}
                style={{ height: 50, width: '100%' }} // Adjust height and width
              >
                <Picker.Item label="Select an option" value="" />
                {responseType.map((item) => (
                  <Picker.Item key={item.key} label={item.name} value={item.key} />
                ))}
              </Picker>
              
            </View>
            <View style={{ height: 1, backgroundColor: '#A0A0A0', marginVertical: 10 }} />
          </View>
        ))}

        {/* Add Question Button */}
        <TouchableOpacity className="bg-mindful-brown-80 rounded p-2" onPress={addQuestion}>
          <Text className="text-white text-center">Add Another Question</Text>
        </TouchableOpacity>
         {/* Add Question Button */}
         <TouchableOpacity className="bg-mindful-brown-80 rounded p-2 mt-5" onPress={addQuestion}>
          <Text className="text-white text-center">Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateForm;