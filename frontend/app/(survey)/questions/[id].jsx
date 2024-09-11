import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getFormQuestions } from '../../../api/form';
import LoadingPage from '../../../components/loading'; 
import { setFormQuestion } from '../../../api/form';

const CustomRadioButton = ({ selected, onPress }) => {
  return (
    <Pressable
      className={`h-6 w-6 rounded-full justify-center items-center ${
        selected ? 'border-white' : 'border-mindful-brown-100'
      } border-2`}
      onPress={onPress}
    >
      {selected && <View className="h-3 w-3 rounded-full bg-white" />}
    </Pressable>
  );
};

const QuestionPage = () => {
  const router = useRouter();
  const { sessionStarted, formData, sessionID, id } = useLocalSearchParams();
  const [sessionData, setSessionData] = useState({});
  const [formTitle, setFormTitle] = useState('Survey');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (formData) {
      setSessionData(JSON.parse(formData)); // Parse the formData and set it to the form state
      console.log(formData)
    }
  }, [formData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { formName, enhancedData } = await getFormQuestions(id);
        setQuestions(enhancedData);
        setFormTitle(formName);
        setLoading(false); // Set loading to false after data is returned
      } catch (error) {
        console.error('Error fetching form data:', error);
        setLoading(false); // Ensure loading stops even if there is an error
      }
    };

    fetchData();
  }, []);

  const handleAnswerChange = (questionID, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionID]: value, // Use questionID instead of id
    }));
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
        try {      
          console.log(answers);                
          await setFormQuestion(sessionID, answers);                  
          router.push({
            pathname: `/questionaire/${form.id}`,
            params: { sessionStarted: true, formData: JSON.stringify(sessionData) },
          });
        } catch (error) {
          console.error('Error submitting answers:', error);
        }
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isOptionSelected = answers[currentQuestion?.questionID] !== undefined;

  
  if (loading) {
    return <LoadingPage title="Loading questions..." />;
  }

  return (
    <ScrollView className="flex-1 p-4 bg-mindful-brown-10">
      <View className="mb-4 flex flex-row justify-between items-center">
        <Text className="text-mindful-brown-100 text-xl font-urbanist-bold">
          {formTitle}
        </Text>
        <Text className="text-mindful-brown-60 text-xl font-urbanist-bold px-2 py-1 rounded-3xl bg-present-red-10">
          {currentQuestionIndex + 1} of {questions.length}
        </Text>
      </View>

      {currentQuestion && (
        <View className="mb-6">
          <Text className="text-mindful-brown-100 text-xl font-urbanist-extra-bold mb-6">
            {currentQuestion.question}
          </Text>

          {currentQuestion.optionValues.map((option) => (
            <Pressable
              key={option.id}
              onPress={() => handleAnswerChange(currentQuestion.questionID, option.value)} 
              className={`flex flex-row justify-between items-center p-4 mb-2 rounded-xl bg-white ${
                answers[currentQuestion.questionID] === option.value ? 'bg-serenity-green-50' : ''
              }`}
            >
              <Text
                className={`font-urbanist-bold ${
                  answers[currentQuestion.questionID] === option.value ? 'text-white' : 'text-mindful-brown-100'
                }`}
              >
                {option.description}
              </Text>
              <CustomRadioButton
                selected={answers[currentQuestion.questionID] === option.value}
                onPress={() => handleAnswerChange(currentQuestion.questionID, option.value)} 
              />
            </Pressable>
          ))}
        </View>
      )}

      <Pressable
        onPress={handleNextQuestion}
        className={`py-4 px-6 rounded-full mt-8 ${
          isOptionSelected
            ? 'bg-mindful-brown-70'
            : 'bg-optimistic-gray-40' 
        }`}
        disabled={!isOptionSelected} 
      >
        <Text
          className={`text-center text-lg font-urbanist-bold ${
            isOptionSelected ? 'text-white' : 'text-optimistic-gray-80'
          }`}
        >
          {currentQuestionIndex < questions.length - 1 ? 'Continue →' : 'Complete'}
        </Text>
      </Pressable>
    </ScrollView>
  );
};

export default QuestionPage;
