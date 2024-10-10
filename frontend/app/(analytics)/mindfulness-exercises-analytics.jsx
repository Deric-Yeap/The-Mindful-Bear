import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import BrownPageTitlePortion from '../../components/brownPageTitlePortion'
import StatusBarComponent from '../../components/darkThemStatusBar'
import { colors } from '../../common/styles'
import { splitSession } from '../../api/session'
import { LineChart } from 'react-native-gifted-charts'
import Loading from '../../components/loading';
import Toggle from '../../components/toggle';
import { Svg } from 'react-native-svg';

const MindfulnessExercisesAnalytics = () => {
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 
  const [sessionNumLineData, setSessionNumLineData] = useState([]) // state for dynamic line data
  const [sessionDurationLineData, setSessionDurationLineData] = useState([]) // state for dynamic line data
  const optionList = ['daily', 'monthly', 'yearly'];
  const periodSelected =  optionList[selectedOption - 1]
  const [selectedOption, setSelectedOption] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); 
      setError(null); 
      const period = optionList[selectedOption - 1]; // Get the period based on selected option
      try {
        response = await splitSession({ period })
        console.log("response",response)
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
  const averageValue = data.reduce((sum, point) => sum + point.value, 0) / data.length;
  return data.map(point => ({
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
                data={sessionNumLineData}
                data2={averageLineDataSessions}
                data3={trendlineDataSessions}
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
              
            <Svg height="250" width={chartWidth}>
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
                  data={sessionDurationLineData} // Ensure this is your data
                  data2={averageLineDataDuration}
                  data3={trendlineDataDuration}
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
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default MindfulnessExercisesAnalytics
