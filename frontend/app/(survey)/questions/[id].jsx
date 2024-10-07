import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getFormQuestions, getFormName } from '../../../api/form';
import LoadingPage from '../../../components/loading'; 
import { setFormQuestion } from '../../../api/form';
import { FontAwesome } from '@expo/vector-icons';

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
  const { 
    id, 
    isRedirectedForms,
    selectedLandmarkData,
    sessionID, 
    sessionStarted,     
    start,
    completedForms: initialCompletedForms } = useLocalSearchParams();  
  const [completedForms, setCompletedForms] = useState(() => {
    try {
      return initialCompletedForms ? JSON.parse(initialCompletedForms) : [];
    } catch (error) {
      console.error("Failed to parse initialCompletedForms:", error);
      return [];
    }
  });
  const [sessionData, setSessionData] = useState({});
  const [formTitle, setFormTitle] = useState('Survey');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  

  let questionsWithOptions = [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedQuestions = await getFormQuestions(id);                
        const sortedQuestions = fetchedQuestions.questions.sort((a, b) => a.order - b.order);
        setQuestions(sortedQuestions);         
        setFormTitle(fetchedQuestions.form_name);
        setLoading(false); 
      } catch (error) {
        console.error('Error fetching form data:', error);
        setLoading(false); 
      }
    };
    fetchData();
  }, []);

  const handleAnswerChange = (questionID, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionID]: value, 
    }));
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
        try {                                           
          await setFormQuestion(sessionID, id, answers);             
          router.push({
            pathname: `/questionaire`,
            params: {               
              isRedirectedForms: isRedirectedForms,
              selectedLandmarkData: selectedLandmarkData, 
              sessionID: sessionID,
              sessionStarted: true,               
              start: start,
              completedForms: JSON.stringify(completedForms),              
            },
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
    <ScrollView className="flex-1 p-4 bg-mindful-brown-10 mt-2">
      <View className="mb-4 flex flex-row justify-between items-center">
        <Text className="text-mindful-brown-100 text-xl font-urbanist-bold">
          {formTitle + " Assessment"}
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
          {currentQuestion.optionSet.description === "Likert" || currentQuestion.optionSet.options.length > 0 ? (
            currentQuestion.optionSet.options.map((option) => (
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
            ))
          ) : currentQuestion.optionSet.description === "Rating" ? (
            <View className="flex flex-row justify-between items-center p-4 mx-6">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Pressable
                  key={rating}
                  onPress={() => handleAnswerChange(currentQuestion.questionID, rating)}
                  className="mx-1"
                >
                  <FontAwesome
                    name="star"
                    size={40} 
                    color={answers[currentQuestion.questionID] >= rating ? '#F4C430' : '#E0E0E0'} // Highlight selected stars in gold, others in grey
                  />
                </Pressable>
              ))}
              </View>
          ) : (
            <TextInput
              className="bg-white p-4 m-2 border border-gray-300 rounded-md text-base"
              placeholder="Type your response here"
              value={answers[currentQuestion.questionID] || ''}
              onChangeText={(text) => handleAnswerChange(currentQuestion.questionID, text)}
              multiline={true}
              style={{
                minHeight: 40,
                textAlignVertical: 'top',
                flexGrow: 1,
                paddingHorizontal: 15,
              }}
            />
          )}

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
