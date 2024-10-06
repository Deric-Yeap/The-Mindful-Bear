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

  

  return (
    <SafeAreaView
      className="flex-1 bg-optimistic-gray-10"
      backgroundColor="#251404"
    >
      <StatusBarComponent barStyle="light-content" backgroundColor="#251404" />

      <ScrollView className="flex-1 bg-optimistic-gray-10 mb-16">
        <View className="mt-12 bg-mindful-brown-70">
        
        </View>
        <BrownPageTitlePortion title="Mindfulness Exercises" />

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
                data={sessionNumLineData} // Ensure this is your data
                width={chartWidth} // Make chart width dynamic based on data
                height={250}
                showVerticalLines
                spacing={44}
                initialSpacing={0}
                color1={colors.mindfulBrown100}
                textColor1="green"
                hideDataPoints
                dataPointsColor1={colors.mindfulBrown100}
                startFillColor1={colors.mindfulBrown50}
                startOpacity={0.8}
                endOpacity={0.3}
                xAxisLabelTextStyle={{
                  transform: [{ rotate: '-15deg' }], // Consistent rotation angle for all labels
                  textAlign: 'center',
                  overflow: 'visible',
                  fontSize: sessionNumLineData.length > 10 ? 11 : 11,
                  color: colors.mindfulBrown100,
                  fontWeight: 'bold',
                }}
                xAxisLabelContainerStyle={{
                    paddingBottom: 60, // Fixed padding for bottom space
                    paddingHorizontal: sessionNumLineData.length > 10 ? 15 : 7,
                    paddingTop: -20,
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
          <View className="flex-row justify-between mb-4 style={{ width: chartWidth }}">
          <LineChart
                areaChart
                curved
                data={sessionDurationLineData} // Ensure this is your data
                width={chartWidth} // Make chart width dynamic based on data
                height={250}
                showVerticalLines
                spacing={44}
                initialSpacing={0}
                color1={colors.mindfulBrown100}
                textColor1="green"
                hideDataPoints
                dataPointsColor1={colors.mindfulBrown100}
                startFillColor1={colors.mindfulBrown50}
                startOpacity={0.8}
                endOpacity={0.3}
                xAxisLabelTextStyle={{
                  transform: [{ rotate: '-15deg' }], // Consistent rotation angle for all labels
                  textAlign: 'center',
                  overflow: 'visible',
                  fontSize: sessionDurationLineData.length > 10 ? 11 : 11,
                  color: colors.mindfulBrown100,
                  fontWeight: 'bold',
                }}
                xAxisLabelContainerStyle={{
                    paddingBottom: 60, // Fixed padding for bottom space
                    paddingHorizontal: sessionDurationLineData.length > 10 ? 15 : 7,
                    paddingTop: -20,
                }}
              />
          </View>
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
