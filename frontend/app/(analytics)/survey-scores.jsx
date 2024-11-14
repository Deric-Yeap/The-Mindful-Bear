import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BrownPageTitlePortion from '../../components/brownPageTitlePortion';
import StatusBarComponent from '../../components/darkThemStatusBar';
import { colors } from '../../common/styles';
import { PieChart, BarChart } from 'react-native-gifted-charts';
import Loading from '../../components/loading';
import Toggle from '../../components/toggle';
import { Svg } from 'react-native-svg';
import { profScoreSession, profPercentScoreSession } from '../../api/formSession';
import { Picker } from '@react-native-picker/picker';
import Dropdown from '../../components/dropdown'; 

// Helper function to calculate bar width
const calculateBarWidth = (data, chartWidth) => {
  return data && data.length > 0
    ? chartWidth / (data.length * 1.5)  // Adjust multiplier for spacing as needed
    : 40;  // Default bar width if data is empty or unavailable
};

const SurveyScoresAnalytics = () => {
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 
  const [profScorePercentData, setProfScorePercentData] = useState([]);
  
  // Inside your MindfulnessExercisesAnalytics component
  const screenWidth = Dimensions.get('window').width;

// newly added: Calculate chart width and height for each bar chart
const profScorePercentDataChartWidth = Math.max(screenWidth, (profScorePercentData?.length || 0) * 80);  // Customize width multiplier

const defaultchartHeight = 250; // Set a standard height for all charts, or customize if needed

// newly added: Calculate bar width for each chart individually
const profScorePercentDataBarWidth = calculateBarWidth(profScorePercentData || [], profScorePercentDataChartWidth)
const getColorForValue = (value, maxCount) => {
    const intensity = value / maxCount; // Calculate intensity from 0 to 1
    return `rgba(108, 83, 61, ${0.4 + 0.5 * intensity})`; // From mindfulnessbrown30 to mindfulnessbrown80
  };

const exerciseSessionCountChartWidth = Math.max(screenWidth, (exercisesSessionCountData?.length || 0) * 80);  // Customize width multiplier
 
    const getProfData = async () => {
      try {
        const params = {
            pss: pss || 20,  // If pss is not provided, set it to 20
            sms: sms || -20  // If sms is not provided, set it to -20
        };
        
        const profScorePercentData = await profPercentScoreSession(params);
        console.log("profScorePercentData",profScorePercentData)
        // const experience = await fetchOverallExperienceRating();

        const { session_count_percent_sms, session_count_percent_sms_no, session_count_percent_pss, session_count_percent_pss_no } = likelihoodData;

        // Prepare the data for the pie chart
        const pieChartData = [
            {
                value: session_count_percent_sms,
                label: "SMS Improvent",
            },
            {
                value: session_count_percent_sms_no,
                label: "SMS No  Improvement",
            },
            {
                value: session_count_percent_pss,
                label: "PSS Improve",
            },
            {
                value: session_count_percent_pss_no,
                label: "PSS No Improvement",
            }
        ];


      } catch (error) {
        console.error("Error fetching data for charts:", error);
      }
    };
    
   // Run both fetchData and retrieveData in parallel
   const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([getProfData()]); // Wait for both to complete
    } catch (error) {
      // If either call fails, set the error immediately
      setError('An error occurred during data fetching.');
    }finally {
      // Set loading to false only after both fetchData and retrieveData have completed (or failed)
      setLoading(false);
    }
  };

  // Trigger fetchAllData when the selected option, year, or month changes
  useEffect(() => {
    fetchAllData();
  }, []);

  
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

  console.log("Data before rendering - Landmark Suggestions:", landmarkSuggestions);
  console.log("Data before rendering - App Improvements:", appImprovements);

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
                <View style={{ width: exerciseChartWidth }}>
                  <BarChart
                    data={formattedExerciseData}
                    barWidth={exerciseBarWidth}
                    barBorderRadius={4}
                    width={exerciseChartWidth}
                    height={defaultchartHeight}
                    yAxisThickness={1}
                    xAxisThickness={1}
                    showYAxisIndices
                    yAxisLabelTextStyle={{ color: colors.mindfulBrown70, fontSize: 10 }}
                    xAxisLabelTextStyle={{ color: colors.mindfulBrown90, fontSize: 10 }}
                    maxValue={maxExerciseValue}
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
                    showYAxisIndices
                    yAxisLabelTextStyle={{ color: colors.mindfulBrown70, fontSize: 10 }}
                    xAxisLabelTextStyle={{ color: colors.mindfulBrown90, fontSize: 10 }}
                    maxValue={maxLandmarkValue}
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
                          showYAxisIndices
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
                          showYAxisIndices
                          yAxisLabelTextStyle={{ color: colors.mindfulBrown70, fontSize: 10 }}
                          xAxisLabelTextStyle={{ color: colors.mindfulBrown90, fontSize: 10 }}
                          maxValue={maxExperienceValue}
                      />
                  </View>
              </ScrollView>
          ) : (
              <Text>No data available</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SurveyScoresAnalytics