import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatusBarComponent from '../../components/darkThemStatusBar'; 
import BrownPageTitlePortion from '../../components/brownPageTitlePortion';

const ViewForm = () => {
  // Static values for demonstration
  const [formName] = useState("Sample Form Name");
  const [storeResponses] = useState(true);
  const [questions] = useState([
    { text: "Sample Question 1", responseType: "Likert Scale - How Often" },
    { text: "Sample Question 2", responseType: "Open Ended Question" },
  ]);

  return (
    <SafeAreaView className="flex-1 bg-optimistic-gray-10">
      <StatusBarComponent barStyle="light-content" backgroundColor="#251404" />
      <BrownPageTitlePortion title="Form Management" />

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <Text className="text-mindful-brown-80 font-bold text-3xl mb-4 p-4 text-[24px]">
          Form Name
        </Text>

        {/* Form Name Input (Read-only) */}
        <View className="border-mindful-brown-30 border-[5px] rounded-full mb-4 mx-4">
          <TextInput
            value={formName}
            editable={false} // Make the input read-only
            className="border mindful-brown-80 border-[2px] rounded-full h-[50px] w-full px-4"
            placeholderTextColor="#A0A0A0"
          />
        </View>

        {/* Store Response? */}
        <View className="flex-row items-center mb-4 mx-4 justify-between">
          <Text className="text-mindful-brown-80 font-bold text-[24px]">
            Store Response?
          </Text>
          <View
            className={`w-6 h-6 rounded border-2 border-mindful-brown-80 ${
              storeResponses ? 'bg-mindful-brown-80' : ''
            }`}
          />
        </View>

       {/* Delete Button */}
       <TouchableOpacity
          className="bg-mindful-brown-70 rounded-full h-[40px] w-2/3 px-4 mb-4 mx-4 justify-center"
          onPress={() => console.log('Delete button pressed')}
        >
          <Text className="text-white text-center text-lg font-bold">Delete</Text>
        </TouchableOpacity>

        {/* Horizontal Line */}
        <View style={{ height: 1, backgroundColor: '#A0A0A0', marginVertical: 10 }} />

        {questions.map((question, index) => (
          <View key={index} className="mb-4">
            <View className="flex-row justify-between items-center">
              <Text className="text-mindful-brown-80 font-bold text-3xl mb-2 p-4 text-[24px]">
                Question {index + 1}
              </Text>
            </View>

            {/* Display the question text */}
            <View className="border-mindful-brown-30 border-[5px] rounded-full mb-4 mx-4">
              <TextInput
                value={question.text}
                editable={false} // Make the input read-only
                className="border mindful-brown-80 border-[2px] rounded-full h-[50px] w-full px-4"
                placeholderTextColor="#A0A0A0"
              />
            </View>

            <Text className="text-mindful-brown-80 font-bold text-3xl mb-2 p-4 text-[24px]">
              Response Type
            </Text>

            {/* Display the response type */}
            <View className="rounded-full mb-4 mx-4 bg-[#9BB167] text-color-[#FFFFFF] text-white">
              <TextInput
                value={question.responseType}
                editable={false} // Make the input read-only
                className="border mindful-brown-80 border-[2px] rounded-full h-[50px] w-full px-4"
                placeholderTextColor="#A0A0A0"
              />
            </View>

            {/* Horizontal Line */}
            <View style={{ height: 1, backgroundColor: '#A0A0A0', marginVertical: 10 }} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ViewForm;
