import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import BrownPageTitlePortion from '../../components/brownPageTitlePortion'
import StatusBarComponent from '../../components/darkThemStatusBar'
import { colors } from '../../common/styles'
import { splitSession } from '../../api/session'
import { LineChart } from 'react-native-gifted-charts'

const lineData = [
  { value: 0, label: '23/9' },
  { value: 10, label: '24/9' },
  { value: 8, label: '25/9' },
  { value: 58, label: '26/9' },
  { value: 56, label: '27/9' },
  { value: 78, label: '28/9' },
  { value: 74, label: '29/9' },
  { value: 98, label: '30/9' },
  { value: 0, label: '23/9' },
  { value: 10, label: '24/9' },
  { value: 8, label: '25/9' },
  { value: 58, label: '26/9' },
  { value: 56, label: '27/9' },
  { value: 78, label: '28/9' },
  { value: 74, label: '29/9' },
  { value: 98, label: '30/9' },
  { value: 0, label: '23/9' },
  { value: 10, label: '24/9' },
  { value: 8, label: '25/9' },
  { value: 58, label: '26/9' },
  { value: 56, label: '27/9' },
  { value: 78, label: '28/9' },
  { value: 74, label: '29/9' },
  { value: 98, label: '30/9' },
  { value: 0, label: '23/9' },
  { value: 10, label: '24/9' },
  { value: 8, label: '25/9' },
  { value: 58, label: '26/9' },
  { value: 56, label: '27/9' },
  { value: 78, label: '28/9' },
  { value: 74, label: '29/9' }
]

const MindfulnessExercisesAnalytics = () => {
  const [sessionNumLineData, setSessionNumLineData] = useState([]) // state for dynamic line data

  useEffect(() => {
    const fetchData = async () => {
      try {
        Object.keys(response).map(date => {
          const data = response[date];
          // Your processing logic here
          console.log(`Date: ${date}`);
          console.log(`Average Duration: ${data.average_duration}`);
          console.log(`Session Count: ${data.session_count}`);
          console.log(`Sessions: ${data.sessions.length}`);
      });
      
        // Fetch line chart data using axios
        // const response = await splitSession()
        // console.log("Response Data:", response.dates) // Debugging log
        // // Format the data according to LineChart structure
        // const formattedData = response.dates.map((date) => ({
        //   value: response.dates[date].session_count || 0, // Use session_count or default to 0
        //   label: date
        // }))
        //  // Update the state with the formatted data
        //  setSessionNumLineData(formattedData)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  // Calculate the width for the LineChart based on the number of data points
  const chartWidth = sessionNumLineData.length * 100 // Adjust based on your design

  return (
    <SafeAreaView
      className="flex-1 bg-optimistic-gray-10"
      backgroundColor="#251404"
    >
      <StatusBarComponent barStyle="light-content" backgroundColor="#251404" />

      <ScrollView className="flex-1 bg-optimistic-gray-10 mb-16">
        <View className="mt-12 bg-mindful-brown-70"></View>
        <BrownPageTitlePortion title="Mindfulness Exercises" />
        <View className="p-4">
          <Text className="text-mindful-brown-100 font-urbanist-bold text-xl mb-4">
            No. of Sessions Overtime
          </Text>
          <ScrollView horizontal={true}>
            <View className="flex-row justify-between mb-4 w-[200vw] ">
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
              />
            
            </View>
          </ScrollView>

          <View className="flex-row justify-between mb-4">
            
          </View>

          <Text className="text-mindful-brown-100 font-urbanist-bold text-xl mb-4">
            Average Duration of Sessions Overtime
          </Text>
          <View className="flex-row justify-between mb-4">
            
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
