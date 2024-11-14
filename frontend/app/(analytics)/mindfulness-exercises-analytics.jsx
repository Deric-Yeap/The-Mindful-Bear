import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, Dimensions, TextInput } from 'react-native'
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
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  // Format the cutoff date to a comparable format (YYYY-MM-DD)
  const cutoffDate = thirtyDaysAgo.toISOString().split('T')[0]; 
  const [exercisesSessionCountData, setExercisesSessionCountData] = useState([]) // state for dynamic line data
  const [exerciseSessionDurationData, setExerciseSessionDurationData] = useState([]) // state for dynamic line data
  
  const [maxSessionCountValue, setMaxSessionCountValue] = useState(20);
  const [maxSessionDurationValue, setMaxSessionDurationValue] = useState(20);
  // newly added: Calculate chart width and height for each bar chart
  const screenWidth = Dimensions.get('window').width;

const exerciseSessionCountChartWidth = Math.max(screenWidth, (exercisesSessionCountData?.length || 0) * 80);  // Customize width multiplier
const exerciseSessionDurationChartWidth = Math.max(screenWidth, (exerciseSessionDurationData?.length || 0) * 80);  // Customize width multiplier

const defaultchartHeight = 250; // Set a standard height for all charts, or customize if needed

// newly added: Calculate bar width for each chart individually
const exerciseSessionCountBarWidth = calculateBarWidth(exercisesSessionCountData || [], exerciseSessionCountChartWidth);
const exerciseSessionDurationBarWidth = calculateBarWidth(exerciseSessionDurationData || [], exerciseSessionDurationChartWidth);
const getColorForValue = (value, maxCount) => {
  const intensity = value / maxCount; // Calculate intensity from 0 to 1
  return `rgba(108, 83, 61, ${0.4 + 0.5 * intensity})`; // From mindfulnessbrown30 to mindfulnessbrown80
};

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

    // Run both fetchData and retrieveData in parallel
    // const fetchAllData = async () => {
    //   setLoading(true);
    //   try {
    //     await Promise.all([fetchData(), retrieveData()]); // Wait for both to complete
    //     console.log("both data retrieval done")
    //   } catch (error) {
    //     // If either call fails, set the error immediately
    //     setError('An error occurred during data fetching.');
    //   }finally {
    //     // Set loading to false only after both fetchData and retrieveData have completed (or failed)
    //     setLoading(false);
    //   }
    // };
  
    // Trigger fetchAllData when the selected option, year, or month changes


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
            <View className="flex-row justify-between mb-4">
            <View style={{ flexDirection: 'row', alignItems: 'center',paddingHorizontal: 30 }}>

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
              marginLeft: 100,
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
            
          </View> 
             
)}
          </View>
      
      </ScrollView>
    </SafeAreaView>
  )
}

export default MindfulnessExercisesAnalytics
