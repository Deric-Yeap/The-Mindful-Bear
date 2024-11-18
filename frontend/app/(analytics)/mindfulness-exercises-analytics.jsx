import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, Dimensions, TextInput,ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import BrownPageTitlePortion from '../../components/brownPageTitlePortion'
import StatusBarComponent from '../../components/darkThemStatusBar'
import { colors } from '../../common/styles'
import { splitSession } from '../../api/session'
import { BarChart, LineChart } from 'react-native-gifted-charts'
import Loading from '../../components/loading';
import Toggle from '../../components/toggle';
import { Svg } from 'react-native-svg';
import { splitUserSession } from '../../api/usersession';
import FilterButton from '../../components/filterButton';
import { fetchLikelihoodOfFutureUse, fetchOverallExperienceRating, fetchRatingDistribution, fetchSuggestionOnLandmark, fetchImprovementsToApp } from '../../api/formQuestion';
import { Picker } from '@react-native-picker/picker';
import Dropdown from '../../components/dropdown'; 



// Helper function to calculate bar width
const calculateBarWidth = (data, chartWidth) => {
  return data && data.length > 0
    ? chartWidth / (data.length * 1.5)  // Adjust multiplier for spacing as needed
    : 40;  // Default bar width if data is empty or unavailable
};


const MindfulnessExercisesAnalytics = () => {
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 
  const [sessionNumLineData, setSessionNumLineData] = useState([]) // state for dynamic line data
  const [sessionDurationLineData, setSessionDurationLineData] = useState([]) // state for dynamic line data
  const optionList = ['daily', 'monthly', 'yearly'];
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const periodSelected =  optionList[selectedOption - 1]
  const [selectedOption, setSelectedOption] = useState(1);
  const today = new Date();
  const fortyDaysAgo = new Date();
  fortyDaysAgo.setDate(today.getDate() - 40);
  // Format the cutoff date to a comparable format (YYYY-MM-DD)
  const cutoffDate = fortyDaysAgo.toISOString().split('T')[0]; 
  const [exercisesSessionCountData, setExercisesSessionCountData] = useState([]) // state for dynamic line data
  const [exerciseSessionDurationData, setExerciseSessionDurationData] = useState([]) // state for dynamic line data
  
  const [maxSessionCountValue, setMaxSessionCountValue] = useState(20);
  const [maxSessionDurationValue, setMaxSessionDurationValue] = useState(20);
  // newly added: Calculate chart width and height for each bar chart
  const screenWidth = Dimensions.get('window').width;

const exerciseSessionCountChartWidth = Math.max(screenWidth, (exercisesSessionCountData?.length || 0) * 80);  // Customize width multiplier
const exerciseSessionDurationChartWidth = Math.max(screenWidth, (exerciseSessionDurationData?.length || 0) * 80);  // Customize width multiplier
// newly added: Calculate chart width and height for each bar chart
const likelihoodChartWidth = Math.max(screenWidth, (likelihoodData?.length || 0) * 80);  // Customize width multiplier
const experienceChartWidth = Math.max(screenWidth, (experienceData?.length || 0) * 80);
const exerciseChartWidth = Math.max(screenWidth, (formattedExerciseData?.length || 0) * 80);
const landmarkChartWidth = Math.max(screenWidth, (formattedLandmarkData?.length || 0) * 80);

const defaultchartHeight = 250; // Set a standard height for all charts, or customize if needed

// newly added: Calculate bar width for each chart individually
const exerciseSessionCountBarWidth = calculateBarWidth(exercisesSessionCountData || [], exerciseSessionCountChartWidth);
const exerciseSessionDurationBarWidth = calculateBarWidth(exerciseSessionDurationData || [], exerciseSessionDurationChartWidth);
const likelihoodBarWidth = calculateBarWidth(likelihoodData || [], likelihoodChartWidth);
const experienceBarWidth = calculateBarWidth(experienceData || [], experienceChartWidth);
const exerciseBarWidth = calculateBarWidth(formattedExerciseData || [], exerciseChartWidth);
const landmarkBarWidth = calculateBarWidth(formattedLandmarkData || [], landmarkChartWidth);

 // newly added: Add suggestions for landmarks and app
 const [landmarkSuggestions, setLandmarkSuggestions] = useState([]);
 const [appImprovements, setAppImprovements] = useState([]);
 const [suggestionsLoading, setSuggestionsLoading] = useState(false);
 const [suggestionsError, setSuggestionsError] = useState(null);
 // newly added: Add suggestions for landmarks and app



 // newly added: State for likelihood and experience data
 const [likelihoodData, setLikelihoodData] = useState([]);
 const [experienceData, setExperienceData] = useState([]);
 const likelihoodLabels = {
   "0": "Very Unlikely",
   "1": "Unlikely",
   "2": "Neutral",
   "3": "Likely",
   "4": "Very Likely",
 };
 const experienceLabels = {
   "0": "Very Bad",
   "1": "Bad",
   "2": "Neutral",
   "3": "Good",
   "4": "Very Good",
 };
const getColorForValue = (value, maxCount) => {
  const intensity = value / maxCount; // Calculate intensity from 0 to 1
  return `rgba(108, 83, 61, ${0.4 + 0.5 * intensity})`; // From mindfulnessbrown30 to mindfulnessbrown80
};

const maxLikelihoodValue = Math.max(...likelihoodData.map(item => item.value), 20); // Default to 20 if no data available
  const maxExperienceValue = Math.max(...experienceData.map(item => item.value), 20); // Default to 20 if no data available
  // newly added: State for likelihood and experience data

  //newly added: landmark_exercise_ratingscore
  const [exerciseRatings, setExerciseRatings] = useState({});
  const [landmarkRatings, setLandmarkRatings] = useState({});
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [selectedLandmark, setSelectedLandmark] = useState(null);

// Default to 20 if no data available


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); 
      setError(null); 
      const period = optionList[selectedOption - 1]; // Get the period based on selected option
      try {
        response = await splitSession({ period })

        // Format the data for the line chart
           const formattedSessionNumData = Object.keys(response.dates).map((date) => ({
          value: response.dates[date].session_count || 0, // Use session_count or default to 0
          label: date
        }));

        const formattedSessionDurationData = Object.keys(response.dates).map((date) => ({
          value: response.dates[date].average_duration || 0, // Use session_count or default to 0
          label: date
        }));
         // Update the state with the formatted data
         setSessionNumLineData(formattedSessionNumData)
         setSessionDurationLineData(formattedSessionDurationData)
         

          
            userSession = await splitUserSession();
            console.log("userSession",userSession)
            // Initialize an array to hold the formatted data
            const exerciseSessionCountData = Object.keys(userSession).map((exercise_name) => ({
              
             value: userSession[exercise_name].count || 0, // Use session_count or default to 0
             label: exercise_name
           }));
          
         // Update the state with the formatted data
         setExercisesSessionCountData(exerciseSessionCountData);
  
         const exerciseSessionDurationData = Object.keys(userSession).map((exercise_name) => ({
              
          value: userSession[exercise_name].average_duration || 0, // Use session_count or default to 0
          label: exercise_name
        }));
  
        setExerciseSessionDurationData(exerciseSessionDurationData);
        console.log("exerciseSessionDurationData",exerciseSessionDurationData)
       
       
       
      } catch (error) {
        if (error.response) {
          setError(`Error: ${error.response.data.message || 'An error occurred.'}`);
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
      }finally {
        setLoading(false)
    }
    }
    fetchData();
  }, [selectedOption]);

    
// Separate useEffect for calculating max values after data is set
useEffect(() => {
  // retrieveData();
  if (exercisesSessionCountData.length > 0) {
      const maxSessionCount = Math.max(...exercisesSessionCountData.map(item => item.value), 20);
      setMaxSessionCountValue(maxSessionCount);
  }

  if (exerciseSessionDurationData.length > 0) {
      const maxSessionDuration = Math.max(...exerciseSessionDurationData.map(item => item.value), 20);
      console.log("maxSessionDuration",maxSessionDuration)
      console.log("type",typeof(maxSessionDuration))
      setMaxSessionDurationValue(maxSessionDuration);
      
      
  }


  console.log("try again","maxSessionCountValue",maxSessionCountValue)
}, [exercisesSessionCountData, exerciseSessionDurationData]);
  
    const retrieveData = async () => {
      setLoading(true); 
      setError(null); 
     
      try {
        const params = {};
        if (year) params.year = year;
        if (month) params.month = month;
    
          userSession = await splitUserSession(params);
          // Initialize an array to hold the formatted data
          const exerciseSessionCountData = Object.keys(userSession).map((exercise_name) => ({
            
           value: userSession[exercise_name].count || 0, // Use session_count or default to 0
           label: exercise_name
         }));
        
       // Update the state with the formatted data
       setExercisesSessionCountData(exerciseSessionCountData);

       const exerciseSessionDurationData = Object.keys(userSession).map((exercise_name) => ({
            
        value: userSession[exercise_name].average_duration || 0, // Use session_count or default to 0
        label: exercise_name
      }));

      setExerciseSessionDurationData(exerciseSessionDurationData);

      const maxSessionCountValue = exercisesSessionCountData.length > 0 
      ? Math.max(...exercisesSessionCountData.map(item => item.value)+2, 20) 
      : 20;
      setMaxSessionCountValue(maxSessionCountValue)
      const maxSessionDurationValue = exerciseSessionDurationData.length > 0 
      ? Math.max(...exerciseSessionDurationData.map(item => item.value)+2, 20) 
      : 20;
      setMaxSessionDurationValue(maxSessionDurationValue)
       
      } catch (error) {
        if (error.response) {
          setError(`Error: ${error.response.data.message || 'An error occurred.'}`);
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
      
      } finally {
        setLoading(false);
      }
    }

   
 // newly added: likelihood and experience data
  useEffect(() => {
    const getData = async () => {
      try {
        const likelihood = await fetchLikelihoodOfFutureUse();
        const experience = await fetchOverallExperienceRating();
        setLikelihoodData(Object.keys(likelihood).map(rating => ({
          value: likelihood[rating],
          label: likelihoodLabels[rating] || rating,
        })));
        setExperienceData(Object.keys(experience).map(rating => ({
          value: experience[rating],
          label: experienceLabels[rating] || rating,
        })));
      } catch (error) {
        console.error("Error fetching data for charts:", error);
      }
    };
    getData();
  }, []);
  // newly added: likelihood and experience data

  //newly added: landmark_exercise_ratingscore
  useEffect(() => {
    const loadRatingsData = async () => {
      try {
        setLoading(true);
        const response = await fetchRatingDistribution();

        // Separate data into exercises and landmarks
        const exerciseData = {};
        const landmarkData = {};

        Object.keys(response).forEach((questionID) => {
          if (isExerciseQuestion(questionID)) {
            exerciseData[questionID] = response[questionID];
          } else if (isLandmarkQuestion(questionID)) {
            landmarkData[questionID] = response[questionID];
          }
        });

        setExerciseRatings(exerciseData);
        setLandmarkRatings(landmarkData);

        // Set default selections to the first exercise and landmark if available
        //setSelectedExercise(Object.keys(exerciseData)[0] || null);
        //setSelectedLandmark(Object.keys(landmarkData)[0] || null);

      } catch (error) {
        setError("Error fetching rating distribution. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadRatingsData();
  }, []);

  // Mapping for question IDs to human-readable names
  const exerciseLabelsMap = {
    "165": "Breathe Awareness and Mindfulness",
    "167": "Mindfulness Walking Exercise",
    "180": "Engaging Taste and Touch",
    "193": "Expanding Awareness through Senses",
  };

  const landmarkLabelsMap = {
    "164": "Connector",
    "166": "SGH Outdoor Area",
    "179": "SGH Bicentennial Garden",
    "192": "SGH Museum",
  };

  // Helper functions to check question IDs
  const isExerciseQuestion = (questionID) => ["165", "167", "180", "193"].includes(String(questionID));
  const isLandmarkQuestion = (questionID) => ["164", "166", "179", "192"].includes(String(questionID));

  // Fallbacks to handle undefined or empty data
  const exerciseOptions = Object.keys(exerciseRatings || {}).map((exerciseId) => ({
    key: exerciseId,
    value: exerciseLabelsMap[exerciseId] || "Unnamed Exercise",
  }));

  const landmarkOptions = Object.keys(landmarkRatings || {}).map((landmarkId) => ({
    key: landmarkId,
    value: landmarkLabelsMap[landmarkId] || "Unnamed Landmark",
  }));

  // Format data for each chart
  const formatChartData = (data) => {
    if (!data) return [];

    const maxCount = Math.max(...Object.values(data));
    return Object.keys(data).map((rating) => ({
      label: ratingLabels[rating] || rating,
      value: Math.round(data[rating]),
      frontColor: getColorForValue(data[rating], maxCount),
      topLabelComponent: () => (
        <Text style={{ color: colors.mindfulBrown100, fontSize: 12, marginBottom: 6 }}>
          {Math.round(data[rating])}
        </Text>
      ),
    }));
  };

  const ratingLabels = {
    "1": "Very Bad",
    "2": "Bad",
    "3": "Neutral",
    "4": "Good",
    "5": "Very Good",
  };

  const formattedExerciseData = formatChartData(exerciseRatings[selectedExercise]);
  const formattedLandmarkData = formatChartData(landmarkRatings[selectedLandmark]);

  const maxExerciseValue = formattedExerciseData.length > 0
  ? Math.max(...formattedExerciseData.map(item => item.value)) * 1.2 // Add buffer
  : 5;
  const exerciseStepValue = Math.ceil(maxExerciseValue / 5); // Divide max value by 5 for intervals

  const maxLandmarkValue = formattedLandmarkData.length > 0
  ? Math.max(...formattedLandmarkData.map(item => item.value)) * 1.2 // Add buffer
  : 5;
  const landmarkStepValue = Math.ceil(maxLandmarkValue / 5); // Divide max value by 5 for intervals
  
  //newly added: landmark_exercise_ratingscore

  // Fetch Suggestions on Landmark and App Improvements
  useEffect(() => {
    const fetchSuggestionsData = async () => {
      setSuggestionsLoading(true);
      try {
        // Fetch landmark suggestions
        const landmarkResponse = await fetchSuggestionOnLandmark();
        console.log("Landmark Suggestions API Response:", landmarkResponse);
        setLandmarkSuggestions(landmarkResponse || []);
  
        // Fetch app improvements
        const appResponse = await fetchImprovementsToApp();
        console.log("App Improvements API Response:", appResponse);
        setAppImprovements(appResponse || []);
        
        setSuggestionsError(null);
      } catch (error) {
        setSuggestionsError('Failed to load suggestions data.');
        console.error("Error fetching suggestions data:", error);
      } finally {
        setSuggestionsLoading(false);
      }
    };
  
    fetchSuggestionsData();
  }, []);

// Fetch Suggestions on Landmark and App Improvements

  const onSelectSwitch = option => {
    setSelectedOption(option);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.optimisticGray10 }}>
        <Loading />
      </View>
    );
  }
  // Inside your MindfulnessExercisesAnalytics component

  // Use the number of data points to determine the chart width
  const chartWidth = Math.max(screenWidth, sessionNumLineData.length * 100); // Ensure at least the screen width
  console.log("chartWidth",chartWidth)

 // Function to calculate linear regression (trendline)
 const calculateTrendline = (data) => {
  const n = data.length;
  if (n === 0) return []; // Avoid calculation if no data

  const sumX = data.reduce((sum, _, index) => sum + index, 0);
  const sumY = data.reduce((sum, point) => sum + point.value, 0);
  const sumXY = data.reduce((sum, point, index) => sum + index * point.value, 0);
  const sumX2 = data.reduce((sum, _, index) => sum + index * index, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return data.map((_, index) => ({
    value: slope * index + intercept,
    label: data[index].label,
  }));
};


// Function to calculate average line
const calculateAverageLine = (data) => {
  // Filter data for the last 30 days
  const filteredData = data.filter(point => {
    const pointDate = new Date(point.label); // Assuming point.label is a date string
    return pointDate >= fortyDaysAgo && pointDate <= today;
  });

  // Calculate the average value from the filtered data
  const averageValue = filteredData.reduce((sum, point) => sum + point.value, 0) / filteredData.length || 0; // Prevent division by zero

  // Return the average line data
  return filteredData.map(point => ({
    value: averageValue,
    label: point.label,
  }));
};

 const averageLineDataDuration = selectedOption === 1 ? calculateAverageLine(sessionDurationLineData) : [];
  const trendlineDataDuration = selectedOption !== 1 ? calculateTrendline(sessionDurationLineData) : [];

  const averageLineDataSessions = selectedOption === 1 ? calculateAverageLine(sessionNumLineData) : [];
  const trendlineDataSessions = selectedOption !== 1 ? calculateTrendline(sessionNumLineData) : [];
  

  // Step 1: Extract the average value
  const averageDataSessionsValue = averageLineDataSessions.length > 0 ? averageLineDataSessions[0].value : 0;

  // Step 2: Define the chart boundaries (yMin, yMax, chartHeight)
  const yMin = 0; // Minimum value for y-axis
  const yMax = Math.max(...sessionNumLineData.map(d => d.value)); // Maximum value based on data
  const chartHeight = 250; // Assume chart height is 250 pixels

  // Step 3: Calculate the y-coordinate for the average line
  const yCoordinateNumBasedOnAverage = defaultchartHeight * (1 - (averageDataSessionsValue - yMin) / (yMax - yMin));

  return (
    <SafeAreaView
      className="flex-1 bg-optimistic-gray-10"
      backgroundColor="#251404"
    >
      <StatusBarComponent barStyle="light-content" backgroundColor="#251404" />
      <BrownPageTitlePortion title="Engagement Metrics" />

      <ScrollView className="flex-1 bg-optimistic-gray-10 mb-16">
      
        

        <View className="p-4">
        <Text className="text-mindful-brown-100 font-urbanist-bold text-xl mb-4">
          Filter by Period
        </Text>
        
        <View className="flex justify-center mx-2 w-full">
          <Toggle
            selectionMode={selectedOption}
            roundCorner={true}
            option1="Daily"
            option2="Monthly"
            option3="Yearly"
            onSelectSwitch={onSelectSwitch}
            selectionColor={colors.mindfulBrown80}
          />
        </View>
          
          

          
          {loading ? (
              <ActivityIndicator size="large" color={colors.mindfulBrown80} style={{ marginVertical: 20 }} />
            ) : error ? (
              <Text style={{ color: 'red', marginVertical: 20 }}>{error}</Text>
            ) : (
          <View >
            <Text className="text-mindful-brown-100 font-urbanist-bold text-xl mb-4">
            No. of Sessions Overtime
          </Text>
            <ScrollView horizontal={true}>
              <View className="flex-row justify-between mb-4 style={{ width: chartWidth }} ">
            
              <LineChart
                  areaChart
                  curved
                  data={sessionNumLineData.length > 1 ? sessionNumLineData : null}
                  data2={averageLineDataSessions.length > 1 ? averageLineDataSessions : null}
                  data3={trendlineDataSessions.length > 1 ? trendlineDataSessions : null}
                  // Ensure this is your data
                  width={chartWidth} // Make chart width dynamic based on data
                  height={250}
                  showVerticalLines
                  spacing={44}
                  initialSpacing={11}
                  color1={colors.mindfulBrown100}
                  color2={colors.optimisticGray50}
                  color3={colors.optimisticGray50}
                  textColor1="green"
                  hideDataPoints
                  dataPointsColor1={colors.mindfulBrown100}
                  startFillColor1={colors.mindfulBrown50}
                  endFillColor1={colors.mindfulBrown30}
            
                  startOpacity1={0.8}
                  endOpacity1={0.3}
                  // To avoid any shadow or transparency effects on the second dataset
                  startOpacity2={0}
                  endOpacity2={0}
                  startOpacity3={0}
                  endOpacity3={0}
                  // Make the average & trendline line dashed
                strokeDashArray2={[4, 4]}
                strokeDashArray3={[4, 4]}
            
            
                  xAxisLabelTextStyle={{
                    transform: [{ rotate: '-15deg' }], // Consistent rotation angle for all labels
                    textAlign: 'center',
                    overflow: 'visible',
                    fontSize: sessionNumLineData.length > 10 ? 8 : 11,
                    color: colors.mindfulBrown100,
                    fontWeight: 'bold',
                  }}
                  xAxisLabelContainerStyle={{
                    paddingBottom: 60,
                    paddingHorizontal: sessionNumLineData.length > 10 ? 15 : 7,
                    paddingTop: -20,
                    paddingLeft: 20, // Add padding to the left to prevent coverage
                  }}
            
                />
              </View>
            </ScrollView>
            
            <View className="flex-row justify-between mb-4">
            
            </View>
            <Text className="text-mindful-brown-100 font-urbanist-bold text-xl mb-4">
              Average Duration of Sessions Overtime
            </Text>
            <ScrollView horizontal={true}>
              <View className="flex-row justify-between mb-4 style={{ width: chartWidth }} " >
              <LineChart
                    areaChart
                    curved
                    data={sessionDurationLineData.length > 1 ? sessionDurationLineData : null} // Ensure this is your data
                    data2={averageLineDataDuration.length > 1 ? averageLineDataDuration : null}
                    data3={trendlineDataDuration.length > 1 ? trendlineDataDuration : null}
                    width={chartWidth} // Make chart width dynamic based on data
                    height={250}
                    showVerticalLines
                    spacing={44}
                    initialSpacing={0}
                    color1={colors.mindfulBrown100}
                    color2={colors.optimisticGray50}
                    color3={colors.optimisticGray50}
                    textColor1="green"
                    hideDataPoints
                    dataPointsColor1={colors.mindfulBrown100}
                    startFillColor1={colors.mindfulBrown50}
                    endFillColor1={colors.mindfulBrown30}
                    startOpacity1={0.8}
                    endOpacity1={0.3}
                    // To avoid any shadow or transparency effects on the second dataset
                    startOpacity2={0}
                    endOpacity2={0}
                    startOpacity3={0}
                    endOpacity3={0}
                    strokeDashArray2={[4, 4]}
                    strokeDashArray3={[4, 4]}
                    xAxisLabelTextStyle={{
                      transform: [{ rotate: '-15deg' }], // Consistent rotation angle for all labels
                      textAlign: 'center',
                      overflow: 'visible',
                      fontSize: sessionNumLineData.length > 10 ? 8 : 11,
                      color: colors.mindfulBrown100,
                      fontWeight: 'bold',
                    }}
                    xAxisLabelContainerStyle={{
                      paddingBottom: 60,
                      paddingHorizontal: sessionNumLineData.length > 10 ? 15 : 7,
                      paddingTop: -20,
                      paddingLeft: 20, // Add padding to the left to prevent coverage
                    }}
                  />
            
              </View>
            </ScrollView>
            <View className="flex-row justify-between mb-4 border-t border-mindfulBrown80 mt-50px mb-50px" >
            <View style={{ flexDirection: 'row', alignItems: 'center',paddingHorizontal: 30 , marginTop:10}}>

        <View style={{ alignItems: 'center', marginRight: 10 }}>
            <Text>Year</Text>
            <TextInput
              style={{ borderWidth: 1, borderColor: colors.zenYellow20, padding: 5, width: 80, textAlign: 'center', borderRadius: 8 }}
              placeholder="YYYY"
              keyboardType="numeric"
              value={year}
              onChangeText={(text) => setYear(text)}
            />
          </View>
          <View style={{ alignItems: 'center', marginRight: 10 }}>
            <Text>Month</Text>
            <TextInput
              style={{ borderWidth: 1, borderColor: colors.zenYellow20, padding: 5, width: 80, textAlign: 'center', borderRadius: 8 }}
              placeholder="MM"
              keyboardType="numeric"
              value={month}
              onChangeText={(text) => setMonth(text)}
            />
          </View>
          {/* Apply Button with Brown Background and Aligned with Filter Boxes */}
          <FilterButton
            title="Apply"
            onPress={retrieveData}
            style={{
              marginLeft: 10,
              marginTop: 17// Add margin to adjust alignment
            }}
          />
                    
                    </View>
                
                    </View>
            <View className="flex-row justify-between mb-4">
            
            </View>
            <Text className="text-mindful-brown-100 font-urbanist-bold text-xl mb-4">
              Popular Exercises by Count
            </Text>
            <ScrollView horizontal={true}>
              <View className="flex-row justify-between mb-4 " >
              {exercisesSessionCountData.length > 0   ? (
              <ScrollView horizontal={true}>
                  <View style={{ width: exerciseSessionCountChartWidth }}>
                      <BarChart
                          data={exercisesSessionCountData.map((item) => ({
                              ...item,
                              frontColor: getColorForValue(item.value,maxSessionCountValue),
                              topLabelComponent: () => (
                                  <Text style={{ color: colors.optimisticGray50, fontSize: 12, marginBottom: 6 }}>
                                      {item.value}
                                  </Text>
                              ),
                          }))}
                    
                    barWidth={exerciseSessionCountBarWidth}
                    barBorderRadius={4}
                    width={exerciseSessionCountChartWidth}
                    height={defaultchartHeight}
                    yAxisThickness={1}
                    xAxisThickness={1}
                    showYAxisIndices
                    yAxisLabelTextStyle={{ color: colors.mindfulBrown70, fontSize: 10 }}
                    xAxisLabelTextStyle={{ color: colors.mindfulBrown90, fontSize: 10 }}
                    maxValue={30}
                  />
                 </View> 
              </ScrollView>
             
            
          ) : (
            <Text>No data available for selected period</Text>
        )}
              </View>
            </ScrollView>

            <View className="flex-row justify-between mb-4">
            
            </View>
            <Text className="text-mindful-brown-100 font-urbanist-bold text-xl mb-4">
              Popular Exercises by Duration
            </Text>
          {exerciseSessionDurationData.length > 0  ? (
              <ScrollView horizontal={true}>
                  <View style={{ width: exerciseSessionDurationChartWidth }}>
                      <BarChart
                          data={exerciseSessionDurationData.map((item) => ({
                              ...item,
                              frontColor: getColorForValue(item.value,30),
                              topLabelComponent: () => (
                                  <Text style={{ color: colors.optimisticGray50, fontSize: 12, marginBottom: 6 }}>
                                      {item.value}
                                  </Text>
                              ),
                          }))}
                    
                    barWidth={exerciseSessionDurationBarWidth}
                    barBorderRadius={4}
                    width={exerciseSessionDurationChartWidth}
                    height={defaultchartHeight}
                    yAxisThickness={1}
                    xAxisThickness={1}
                    showYAxisIndices
                    yAxisLabelTextStyle={{ color: colors.mindfulBrown70, fontSize: 10 }}
                    xAxisLabelTextStyle={{ color: colors.mindfulBrown90, fontSize: 10 }}
                    maxValue={30}
                  />
                </View>
              </ScrollView>
            
          ) : (
            <Text>No data available for selected period</Text>
        )}

<View style={{ borderBottomWidth: 1, borderBottomColor: colors.mindfulBrown80, marginTop: 50 }} />
          {/* Exercise Picker with Dropdown Component */}
          <Text className="text-mindful-brown-80 font-urbanist-bold text-xl mt-10">Exercises Rating:</Text>
          <Dropdown
            data={exerciseOptions}
            handleSelect={(itemValue) => setSelectedExercise(itemValue)}
            selectedValue={selectedExercise}
            iconName="chevron-down"
          />

          {/* Exercise Rating Chart */}
          {formattedExerciseData.length > 0 ? (
            <View className="mt-4">
              <Text className="text-mindful-brown-80 font-urbanist-bold text-lg mb-2">
                {exerciseLabelsMap[selectedExercise] || "Exercise Rating"}
              </Text>
              <ScrollView horizontal={true}>
                <View style={{ width: exerciseChartWidth, paddingBottom: 40 }}>
                  <BarChart
                    data={formattedExerciseData}
                    barWidth={exerciseBarWidth}
                    barBorderRadius={4}
                    width={exerciseChartWidth}
                    height={defaultchartHeight}
                    yAxisThickness={1}
                    xAxisThickness={1}
                    stepValue={exerciseStepValue} // Use dynamic step value
                    maxValue={Math.ceil(maxExerciseValue)} // Use buffered max value
                    yAxisLabelTextStyle={{ color: colors.mindfulBrown70, fontSize: 10 }}
                    xAxisLabelTextStyle={{ color: colors.mindfulBrown90, fontSize: 10 }}
                  />
                </View>
              </ScrollView>
            </View>
          ) : (
            selectedExercise && (
              <Text className="text-mindful-brown-80 text-center mt-4">
                No data available for the selected exercise
              </Text>
            )
          )}

          {/* Landmark Picker with Dropdown Component */}
          <Text className="text-mindful-brown-80 font-urbanist-bold text-xl mt-10">Landmarks Rating:</Text>
          <Dropdown
            data={landmarkOptions}
            handleSelect={(itemValue) => setSelectedLandmark(itemValue)}
            selectedValue={selectedLandmark}
            iconName="chevron-down"
          />

          {/* Landmark Rating Chart */}
          {formattedLandmarkData.length > 0 ? (
            <View className="mt-4">
              <Text className="text-mindful-brown-80 font-urbanist-bold text-lg mb-2">
                {landmarkLabelsMap[selectedLandmark] || "Landmark Rating"}
              </Text>
              <ScrollView horizontal={true}>
                <View style={{ width: landmarkChartWidth }}>
                  <BarChart
                    data={formattedLandmarkData}
                    barWidth={landmarkBarWidth}
                    barBorderRadius={4}
                    width={landmarkChartWidth}
                    height={defaultchartHeight}
                    yAxisThickness={1}
                    xAxisThickness={1}
                    stepValue={landmarkStepValue} // Use dynamic step value
                    maxValue={Math.ceil(maxLandmarkValue)} // Use buffered max value
                    yAxisLabelTextStyle={{ color: colors.mindfulBrown70, fontSize: 10 }}
                    xAxisLabelTextStyle={{ color: colors.mindfulBrown90, fontSize: 10 }}
                  />
                </View>
              </ScrollView>
            </View>
          ) : (
            selectedLandmark && (
              <Text className="text-mindful-brown-80 text-center mt-4">
                No data available for the selected landmark
              </Text>
            )
          )}

          <View style={{ borderBottomWidth: 1, borderBottomColor: colors.mindfulBrown80, marginTop: 50 }} />

          <Text className="text-mindful-brown-80 font-urbanist-bold text-xl mb-4">Likelihood of Future Use</Text>
          {likelihoodData.length > 0 ? (
              <ScrollView horizontal={true}>
                  <View style={{ width: likelihoodChartWidth }}>
                      <BarChart
                          data={likelihoodData.map((item) => ({
                              ...item,
                              frontColor: getColorForValue(item.value, maxLikelihoodValue),
                              topLabelComponent: () => (
                                  <Text style={{ color: colors.optimisticGray50, fontSize: 12, marginBottom: 6 }}>
                                      {item.value}
                                  </Text>
                              ),
                          }))}
                          barWidth={likelihoodBarWidth}  // Specific bar width for this chart
                          barBorderRadius={4}
                          width={likelihoodChartWidth}  // Specific chart width
                          height={defaultchartHeight}  // Default chart height
                          yAxisThickness={1}
                          xAxisThickness={1}
                          yAxisLabelTextStyle={{ color: colors.mindfulBrown70, fontSize: 10 }}
                          xAxisLabelTextStyle={{ color: colors.mindfulBrown90, fontSize: 10 }}
                          maxValue={maxLikelihoodValue}
                      />
                  </View>
              </ScrollView>
          ) : (
              <Text>No data available</Text>
          )}


          <Text className="text-mindful-brown-80 font-urbanist-bold text-xl mb-4 mt-8">Overall Experience Rating</Text>
          {experienceData.length > 0 ? (
              <ScrollView horizontal={true}>
                  <View style={{ width: experienceChartWidth }}>
                      <BarChart
                          data={experienceData.map((item) => ({
                              ...item,
                              frontColor: getColorForValue(item.value, maxExperienceValue),
                              topLabelComponent: () => (
                                  <Text style={{ color: colors.optimisticGray50, fontSize: 12, marginBottom: 6 }}>
                                      {item.value}
                                  </Text>
                              ),
                          }))}
                          barWidth={experienceBarWidth}  // Specific bar width for this chart
                          barBorderRadius={4}
                          width={experienceChartWidth}  // Specific chart width
                          height={defaultchartHeight}  // Default chart height
                          yAxisThickness={1}
                          xAxisThickness={1}
                          yAxisLabelTextStyle={{ color: colors.mindfulBrown70, fontSize: 10 }}
                          xAxisLabelTextStyle={{ color: colors.mindfulBrown90, fontSize: 10 }}
                          maxValue={maxExperienceValue}
                      />
                  </View>
              </ScrollView>
          ) : (
              <Text>No data available</Text>
          )}


          
                    


          {/* Suggestions Section */}
            <View style={{ borderBottomWidth: 1, borderBottomColor: colors.mindfulBrown80, marginTop: 50 }} />

            {/* Suggestions to Improve Landmark */}
            <Text className="text-mindful-brown-100 font-urbanist-extra-bold text-2xl mt-6 ml-6">
              Suggestions to Improve Landmark
            </Text>
            {suggestionsLoading ? (
              <ActivityIndicator size="large" color={colors.mindfulBrown80} style={{ marginVertical: 20 }} />
            ) : suggestionsError ? (
              <Text style={{ color: 'red', marginVertical: 20, textAlign: 'center' }}>{suggestionsError}</Text>
            ) : (
              landmarkSuggestions.length > 0 ? (
                <View style={{ margin: 10, padding: 10, backgroundColor: colors['mindful-brown-20'], borderRadius: 10 }}>
                  {/* Table Header */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10, borderBottomWidth: 1, borderColor: colors['mindful-brown-60'] }}>
                    <Text className="text-mindful-brown-100 font-urbanist-bold text-base">Suggestion</Text>
                    <Text className="text-mindful-brown-100 font-urbanist-bold text-base">Mentions</Text>
                  </View>
                  {/* Table Rows */}
                  {landmarkSuggestions.map((suggestion, idx) => (
                    <View
                      key={idx}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',  // Aligns items vertically
                        paddingVertical: 6,
                        borderBottomWidth: idx === landmarkSuggestions.length - 1 ? 0 : 1,
                        borderColor: colors['mindful-brown-30'],
                      }}
                    >
                      {/* Suggestion Text */}
                      <Text
                        style={{
                          flex: 1,
                          marginRight: 30,  // Space between suggestion and mentions
                          color: colors.mindfulBrown100,
                          fontSize: 16,
                        }}
                      >
                        {suggestion.response}
                      </Text>
                      
                      {/* Mentions Count */}
                      <Text
                        style={{
                          color: colors.mindfulBrown100,
                          fontSize: 16,
                          width: 30,  // Fixed width for alignment
                          textAlign: 'right',  // Align text to the right
                        }}
                      >
                        {suggestion.count}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={{ color: 'gray', margin: 20, textAlign: 'center', fontSize: 16 }}>No suggestions available for landmarks.</Text>
              )
            )}

            {/* Suggestions to Improve App */}
            <Text className="text-mindful-brown-100 font-urbanist-extra-bold text-2xl mt-6 ml-6">
              Suggestions to Improve App
            </Text>
            {suggestionsLoading ? (
              <ActivityIndicator size="large" color={colors.mindfulBrown80} style={{ marginVertical: 20 }} />
            ) : suggestionsError ? (
              <Text style={{ color: 'red', marginVertical: 20, textAlign: 'center' }}>{suggestionsError}</Text>
            ) : (
              appImprovements.length > 0 ? (
                <View style={{ margin: 10, padding: 10, backgroundColor: colors['mindful-brown-20'], borderRadius: 10 }}>
                  {/* Table Header */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10, borderBottomWidth: 1, borderColor: colors['mindful-brown-60'] }}>
                    <Text className="text-mindful-brown-100 font-urbanist-bold text-base">Suggestion</Text>
                    <Text className="text-mindful-brown-100 font-urbanist-bold text-base">Mentions</Text>
                  </View>
                  {/* Table Rows */}
                  {appImprovements.map((improvement, idx) => (
                    <View
                      key={idx}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',  // Aligns items vertically
                        paddingVertical: 6,
                        borderBottomWidth: idx === appImprovements.length - 1 ? 0 : 1,
                        borderColor: colors['mindful-brown-30'],
                      }}
                    >
                      {/* Suggestion Text */}
                      <Text
                        style={{
                          flex: 1,
                          marginRight: 20,  // Space between suggestion and mentions
                          color: colors.mindfulBrown100,
                          fontSize: 16,
                        }}
                      >
                        {improvement.response}
                      </Text>
                      
                      {/* Mentions Count */}
                      <Text
                        style={{
                          color: colors.mindfulBrown100,
                          fontSize: 16,
                          width: 30,  // Fixed width for alignment
                          textAlign: 'right',  // Align text to the right
                        }}
                      >
                        {improvement.count}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={{ color: 'gray', margin: 20, textAlign: 'center', fontSize: 16 }}>No suggestions available for app improvements.</Text>
              )
            )}
            
          </View> 
         
)}
          </View>
      
      </ScrollView>
    </SafeAreaView>
  )
}

export default MindfulnessExercisesAnalytics
