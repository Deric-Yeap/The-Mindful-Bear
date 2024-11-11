import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BrownPageTitlePortion from '../../components/brownPageTitlePortion';
import StatusBarComponent from '../../components/darkThemStatusBar';
import { colors } from '../../common/styles';
import { splitSession } from '../../api/session';
import { LineChart, BarChart } from 'react-native-gifted-charts';
import Loading from '../../components/loading';
import Toggle from '../../components/toggle';
import { Svg } from 'react-native-svg';
import { fetchLikelihoodOfFutureUse, fetchOverallExperienceRating, fetchRatingDistribution } from '../../api/formQuestion';
import { Picker } from '@react-native-picker/picker';



const MindfulnessExercisesAnalytics = () => {
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 
  const [sessionNumLineData, setSessionNumLineData] = useState([]) // state for dynamic line data
  const [sessionDurationLineData, setSessionDurationLineData] = useState([]) // state for dynamic line data
  const optionList = ['daily', 'monthly', 'yearly'];
  const periodSelected =  optionList[selectedOption - 1]
  const [selectedOption, setSelectedOption] = useState(1);


  // Add WordCloud component rendering logic here



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
 //newly added: landmark_exercise_ratingscore

  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  // Format the cutoff date to a comparable format (YYYY-MM-DD)
  const cutoffDate = thirtyDaysAgo.toISOString().split('T')[0]; 
  console.log(cutoffDate)



  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); 
      setError(null); 
      const period = optionList[selectedOption - 1]; // Get the period based on selected option
      try {
        response = await splitSession({ period })
        // console.log("response",response)
        

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
         console.log("formattedSessionNumData ",formattedSessionNumData)
          console.log("formattedSessionDurationData",formattedSessionDurationData)
       
      } catch (error) {
        if (error.response) {
          setError(`Error: ${error.response.data.message || 'An error occurred.'}`);
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
      }finally {
        setLoading(false); 
      }
    }
    fetchData()
  }, [selectedOption])

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
        setSelectedExercise(Object.keys(exerciseData)[0] || null);
        setSelectedLandmark(Object.keys(landmarkData)[0] || null);

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

  // Format data for each chart
  const formatChartData = (data) => {
    if (!data) return [];

    const maxCount = Math.max(...Object.values(data));
    return Object.keys(data).map((rating) => ({
      label: ratingLabels[rating] || rating,
      value: data[rating],
      frontColor: getColorForValue(data[rating], maxCount),
      topLabelComponent: () => (
        <Text style={{ color: colors.mindfulBrown100, fontSize: 12, marginBottom: 6 }}>
          {data[rating]}
        </Text>
      ),
    }));
  };

  const ratingLabels = {
    "0": "Very Bad",
    "1": "Bad",
    "2": "Neutral",
    "3": "Good",
    "4": "Very Good",
  };

  const formattedExerciseData = formatChartData(exerciseRatings[selectedExercise]);
  const formattedLandmarkData = formatChartData(landmarkRatings[selectedLandmark]);

  const maxExerciseValue = formattedExerciseData.length > 0 
  ? Math.max(...formattedExerciseData.map(item => item.value), 5) 
  : 5;

  const maxLandmarkValue = formattedLandmarkData.length > 0 
  ? Math.max(...formattedLandmarkData.map(item => item.value), 5) 
  : 5;

  //newly added: landmark_exercise_ratingscore

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
  const screenWidth = Dimensions.get('window').width;

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
    return pointDate >= thirtyDaysAgo && pointDate <= today;
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
  console.log("averageLineDataSessions",averageLineDataSessions)
  console.log("trendlineDataSessions",trendlineDataSessions)

  // Step 1: Extract the average value
  const averageDataSessionsValue = averageLineDataSessions.length > 0 ? averageLineDataSessions[0].value : 0;

  // Step 2: Define the chart boundaries (yMin, yMax, chartHeight)
  const yMin = 0; // Minimum value for y-axis
  const yMax = Math.max(...sessionNumLineData.map(d => d.value)); // Maximum value based on data
  const chartHeight = 250; // Assume chart height is 250 pixels

  // Step 3: Calculate the y-coordinate for the average line
  const yCoordinateNumBasedOnAverage = chartHeight * (1 - (averageDataSessionsValue - yMin) / (yMax - yMin));
  console.log("yCoordinateNumBasedOnAverage",yCoordinateNumBasedOnAverage)

  return (
    <SafeAreaView
      className="flex-1 bg-optimistic-gray-10"
      backgroundColor="#251404"
    >
      <StatusBarComponent barStyle="light-content" backgroundColor="#251404" />
      <BrownPageTitlePortion title="Mindfulness Exercises" />

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
          
          <Text className="text-mindful-brown-100 font-urbanist-bold text-xl mb-4">
            No. of Sessions Overtime
          </Text>

          
          {loading ? (
              <ActivityIndicator size="large" color={colors.mindfulBrown80} style={{ marginVertical: 20 }} />
            ) : error ? (
              <Text style={{ color: 'red', marginVertical: 20 }}>{error}</Text>
            ) : (
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
              
            {/* <Svg height="250" width={chartWidth}>
              <Text
                x={chartWidth - 50} // X-position of the label
                y={yCoordinateNumBasedOnAverage} // Y-position based on the average value
                fill={colors.presentRed100} // Color of the text
                fontSize="12"
                fontWeight="bold"
              >
                {`Average: ${averageDataSessionsValue}`} 
              </Text>
            </Svg>
            */}
            
            </View>
          </ScrollView>
          )}
          <View className="flex-row justify-between mb-4">
            
            
          </View>

          <Text className="text-mindful-brown-100 font-urbanist-bold text-xl mb-4">
            Average Duration of Sessions Overtime
          </Text>
          <ScrollView horizontal={true}>
            <View className="flex-row justify-between mb-4 style={{ width: chartWidth }}">
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
          
          <View className="bg-optimistic-gray-10 p-4 rounded-lg mb-4">
            <Text className="text-mindful-brown-100 font-urbanist-bold text-xl mb-4">
              Popular Landmarks
            </Text>
            <View>
              
            </View>
          </View>

          
          {/* Likelihood of Future Use Chart */}
          <Text className="text-mindful-brown-80 font-urbanist-bold text-xl mb-4">Likelihood of Future Use</Text>
          {likelihoodData.length > 0 ? (
            <BarChart
              data={likelihoodData.map((item) => ({
                ...item,
                frontColor: getColorForValue(item.value, maxLikelihoodValue), // Use dynamic color
                topLabelComponent: () => (
                  <Text style={{ color: colors.optimisticGray50, fontSize: 12, marginBottom: 6 }}>
                    {item.value}
                  </Text>
                ),
              }))}
              barWidth={30}
              barBorderRadius={4}
              yAxisThickness={1}
              xAxisThickness={1}
              showYAxisIndices
              yAxisLabelTextStyle={{ color: colors.mindfulBrown70, fontSize: 10 }}
              xAxisLabelTextStyle={{ color: colors.mindfulBrown90, fontSize: 10 }}
              maxValue={maxLikelihoodValue} // Dynamically set the max y-axis value based on data
            />
          ) : (
            <Text>No data available</Text>
          )}

          {/* Overall Experience Rating Chart */}
          <Text className="text-mindful-brown-80 font-urbanist-bold text-xl mb-4 mt-8">Overall Experience Rating</Text>
          {experienceData.length > 0 ? (
            <BarChart
              data={experienceData.map((item) => ({
                ...item,
                frontColor: getColorForValue(item.value, maxExperienceValue), // Use dynamic color
                topLabelComponent: () => (
                  <Text style={{ color: colors.optimisticGray50, fontSize: 12, marginBottom: 6 }}>
                    {item.value}
                  </Text>
                ),
              }))}
              barWidth={30}
              barBorderRadius={4}
              yAxisThickness={1}
              xAxisThickness={1}
              showYAxisIndices
              yAxisLabelTextStyle={{ color: colors.mindfulBrown70, fontSize: 10 }}
              xAxisLabelTextStyle={{ color: colors.mindfulBrown90, fontSize: 10 }}
              maxValue={maxExperienceValue} // Dynamically set the max y-axis value based on data
            />
          ) : (
            <Text>No data available</Text>
          )}

          {/* Exercise Picker */}   
          <View className="p-4"> 
            <Text className="text-mindful-brown-80 font-urbanist-bold text-xl mb-2">Exercises Rating:</Text>
            <View style={{ borderWidth: 1, borderColor: colors.mindfulBrown40, borderRadius: 4, marginBottom: 8 }}>
            <Picker
            selectedValue={selectedExercise}
            onValueChange={(itemValue) => setSelectedExercise(itemValue)}
            style={{ height: 50, width: '100%', color: colors.mindfulBrown100 }}
          >
                {Object.keys(exerciseRatings).map((exerciseId) => (
                  <Picker.Item key={exerciseId} label={exerciseLabelsMap[exerciseId]} value={exerciseId} />
                ))}
              </Picker>
            </View>

            {/* Exercise Rating Chart */}
            {formattedExerciseData.length > 0 ? (
              <View className="mt-4">
                <Text className="text-mindful-brown-80 font-urbanist-bold text-lg mb-2">
                  {exerciseLabelsMap[selectedExercise] || "Exercise Rating"}
                </Text>
                <BarChart
                  data={formattedExerciseData}
                  barWidth={30}
                  barBorderRadius={4}
                  yAxisThickness={1}
                  xAxisThickness={1}
                  showYAxisIndices
                  yAxisLabelTextStyle={{ color: colors.mindfulBrown70, fontSize: 10 }}
                  xAxisLabelTextStyle={{ color: colors.mindfulBrown90, fontSize: 10 }}
                  maxValue={maxExerciseValue}
                />
              </View>
            ) : (
              selectedExercise && (
                <Text className="text-mindful-brown-80 text-center mt-4">
                  No data available for the selected exercise
                </Text>
              )
            )}

            {/* Landmark Picker */}
            <Text className="text-mindful-brown-80 font-urbanist-bold text-xl mt-4 mb-2">Landmarks Rating:</Text>
            <View style={{ borderWidth: 1, borderColor: colors.mindfulBrown40, borderRadius: 4, marginBottom: 8 }}>
              <Picker
                selectedValue={selectedLandmark}
                onValueChange={(itemValue) => setSelectedLandmark(itemValue)}
                style={{ height: 50, width: '100%', color: colors.mindfulBrown100 }}
              >
                {Object.keys(landmarkRatings).map((landmarkId) => (
                  <Picker.Item key={landmarkId} label={landmarkLabelsMap[landmarkId]} value={landmarkId} />
                ))}
              </Picker>
            </View>

            {/* Landmark Rating Chart */}
            {formattedLandmarkData.length > 0 ? (
              <View className="mt-4">
                <Text className="text-mindful-brown-80 font-urbanist-bold text-lg mb-2">
                  {landmarkLabelsMap[selectedLandmark] || "Landmark Rating"}
                </Text>
                <BarChart
                  data={formattedLandmarkData}
                  barWidth={30}
                  barBorderRadius={4}
                  yAxisThickness={1}
                  xAxisThickness={1}
                  showYAxisIndices
                  yAxisLabelTextStyle={{ color: colors.mindfulBrown70, fontSize: 10 }}
                  xAxisLabelTextStyle={{ color: colors.mindfulBrown90, fontSize: 10 }}
                  maxValue={maxLandmarkValue}
                />
              </View>
            ) : (
              selectedLandmark && (
                <Text className="text-mindful-brown-80 text-center mt-4">
                  No data available for the selected landmark
                </Text>
              )
            )}
          </View>


        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default MindfulnessExercisesAnalytics