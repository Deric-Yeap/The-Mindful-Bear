import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BrownPageTitlePortion from '../../components/brownPageTitlePortion';
import StatusBarComponent from '../../components/darkThemStatusBar';
import { colors } from '../../common/styles';
import { PieChart, BarChart } from 'react-native-gifted-charts';
import Loading from '../../components/loading';
import Toggle from '../../components/toggle';
import { Svg } from 'react-native-svg';
import { profScoreSession, profPercentScoreSession } from '../../api/formSession';
import { genScoreSession } from '../../api/formQuestion';
import { Picker } from '@react-native-picker/picker';
import Dropdown from '../../components/dropdown'; 
import FilterButton from '../../components/filterButton';
import ImprovementAnalytics from './conclusion';
import { PieChartComponent } from '../../components/analytics/pieChartComponent';
// Helper function to calculate bar width
const calculateBarWidth = (data, chartWidth) => {
  return data && data.length > 0
    ? chartWidth / (data.length * 1.5)  // Adjust multiplier for spacing as needed
    : 40;  // Default bar width if data is empty or unavailable
};

const SurveyScoresAnalytics = () => {
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 
  //For general line charts
  const optionList = ['daily', 'monthly', 'yearly'];
  const periodSelected =  optionList[selectedOption - 1]
  const [selectedOption, setSelectedOption] = useState(1);
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  const [formattedPssBeforeData, setFormattedPssBeforeData] = useState([]);
const [formattedPssAfterData, setFormattedPssAfterData] = useState([]);
const [formattedSmsBeforeData, setFormattedSmsBeforeData] = useState([]);
const [formattedSmsAfterData, setFormattedSmsAfterData] = useState([]);

  //For PSS & SMS Prof Pie Charts
  const [profScorePercentData, setProfScorePercentData] = useState([]);
  const [genScoreData, setGenScoreData] = useState([]);
  const [pssPieChartData, setPssPieChartData] = useState([]);
  const [smsPieChartData, setSmsPieChartData] = useState([]);
  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);
  const [pssThreshold, setPssThreshold] = useState(20);
  const [smsThreshold, setSmsThreshold] = useState(-20);

  //For General Line Charts
  const [stressGenData, setStressGenData] = useState([]);
  const [mindfulnessGenData, setMindfulnessGenData] = useState([]);
    
  // Calculate chartwidth & height
  const screenWidth = Dimensions.get('window').width;
  const pieChartWidth = Math.max(screenWidth, (profScorePercentData?.length || 0) * 10);  // Customize width multiplier

const defaultchartHeight = 250; // Set a standard height for all charts, or customize if needed

  const getLineData = async() =>
    {
        const period = optionList[selectedOption - 1]; // Get the period based on selected option
      try {
        response = await profScoreSession({ period })
        console.log("response",response)

        // Format the data for the line chart
           const formattedPssBeforeData = Object.keys(response).map((date) => ({
          value: response[date].average_pss_before || 0, // Use session_count or default to 0
          label: date
        }));

        const formattedPssAfterData = Object.keys(response).map((date) => ({
            value: response[date].average_pss_after || 0, // Use session_count or default to 0
            label: date
         }));
         const formattedSmsBeforeData = Object.keys(response).map((date) => ({
            value: response[date].average_sms_before || 0, // Use session_count or default to 0
            label: date
            }));

        const formattedSmsAfterData = Object.keys(response).map((date) => ({
            value: response[date].average_sms_after || 0, // Use session_count or default to 0
            label: date
            }));

       
         // Update the state with the formatted data
         setFormattedPssBeforeData(formattedPssBeforeData);
         setFormattedPssAfterData(formattedPssAfterData);
         setFormattedSmsBeforeData(formattedSmsBeforeData);
         setFormattedSmsAfterData(formattedSmsAfterData);
         console.log("formattedPssBeforeData",formattedPssBeforeData)
        } catch (error) {
            console.error('Error fetching data for charts:', error);
        }
    }
         
//Line Chart width
const formattedPssBeforeChartWidth = Math.max(screenWidth, (formattedPssBeforeData?.length || 0) * 80);  
const formattedPssAfterChartWidth = Math.max(screenWidth, (formattedPssAfterData?.length || 0) * 80);
const formattedSmsBeforeChartWidth = Math.max(screenWidth, (formattedSmsBeforeData?.length || 0) * 80);
const formattedSmsAfterChartWidth = Math.max(screenWidth, (formattedSmsAfterData?.length || 0) * 80);

    const getGenData = async() =>
    {
        try {
            const params = {}
            if(year) params.year = year;
            if(month) params.month = month;
            const genScoreData = await genScoreSession(params);
            console.log("genScoreData",genScoreData)

            // Prepare the data for the bar chart
            const stressGenData = [
                {
                    value: genScoreData["percentage_yes_stress"],
                    label: "Improvement",
                    color: colors.mindfulBrown80
                },
                {
                    value: genScoreData["percentage_no_stress"],
                    label: "No Improvement",
                    color: colors.mindfulBrown30
                }
            ]
            setStressGenData(stressGenData);

            const mindfulnessGenData = [
                {
                    value: genScoreData["percentage_yes_mindfulness"],
                    label: "Improvement",
                    color: colors.mindfulBrown80
                },
                {
                    value: genScoreData["percentage_no_mindfulness"],
                    label: "No Improvement",
                    color: colors.mindfulBrown30
                }
            ]
            setMindfulnessGenData(mindfulnessGenData);
            console.log("mindfulnessGenData",mindfulnessGenData)

        } catch (error) {
            console.error("Error fetching data for charts:", error);

        }
    }
 
    const getProfData = async () => {
      try {
        console.log("starts here")
        
        const params = {
            pss: pssThreshold || 20,  // If pss is not provided, set it to 20
            sms: smsThreshold || -20  // If sms is not provided, set it to -20
        };

        if(year) params.year = year;
        if(month) params.month = month;
        
        const profScorePercentData = await profPercentScoreSession(params);
        console.log("profScorePercentData",profScorePercentData)
        // const experience = await fetchOverallExperienceRating();


        // Prepare the data for the pie chart
        const smsPieChartData = [
            {
                value: profScorePercentData["session_count_percent_sms"],
                label: "Improvement",
                color: colors.mindfulBrown80
            },
            {
                value: profScorePercentData["session_count_percent_sms_no"],
                label: "No Improvement",
                color: colors.mindfulBrown30
            }
        ];
        setSmsPieChartData(smsPieChartData); 

        const pssPieChartData = [
            {
                value: profScorePercentData["session_count_percent_pss"],
                label: "Improvement",
                color: colors.mindfulBrown80
            },
            {
                value: profScorePercentData["session_count_percent_pss_no"],
                label: "No Improvement",
                color: colors.mindfulBrown30
            }
        ];
        setPssPieChartData(pssPieChartData);
        console.log("smsPieChartData",smsPieChartData)
        console.log("pssPieChartData",pssPieChartData)

      } catch (error) {
        console.error("Error fetching data for charts:", error);
      }
    };
    
   // Run all data retrieval functions in parallel
   const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([getProfData(),getGenData()]); // Wait for both to complete
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

//  const averagePssBeforeLineChart = selectedOption === 1 ? calculateAverageLine(formattedPssBeforeData) : [];
//  const trendlinePssBeforeLineChart = selectedOption !== 1 ? calculateTrendline(formattedPssBeforeData) : [];
// const averagePssAfterLineChart = selectedOption === 1 ? calculateAverageLine(formattedPssAfterData) : [];
// const trendlinePssAfterLineChart = selectedOption !== 1 ? calculateTrendline(formattedPssAfterData) : [];
// const averageSmsBeforeLineChart = selectedOption === 1 ? calculateAverageLine(formattedSmsBeforeData) : [];
// const trendlineSmsBeforeLineChart = selectedOption !== 1 ? calculateTrendline(formattedSmsBeforeData) : [];
// const averageSmsAfterLineChart = selectedOption === 1 ? calculateAverageLine(formattedSmsAfterData) : [];
// const trendlineSmsAfterLineChart = selectedOption !== 1 ? calculateTrendline(formattedSmsAfterData) : [];
//   const trendlineDataDuration = selectedOption !== 1 ? calculateTrendline(sessionDurationLineData) : [];

//   const averageLineDataSessions = selectedOption === 1 ? calculateAverageLine(sessionNumLineData) : [];
//   const trendlineDataSessions = selectedOption !== 1 ? calculateTrendline(sessionNumLineData) : [];
//   console.log("averageLineDataSessions",averageLineDataSessions)
//   console.log("trendlineDataSessions",trendlineDataSessions)

  // Step 1: Extract the average value
//   const averageDataSessionsValue = averageLineDataSessions.length > 0 ? averageLineDataSessions[0].value : 0;

  // Step 2: Define the chart boundaries (yMin, yMax, chartHeight)
//   const yMin = 0; // Minimum value for y-axis
//   const yMax = Math.max(...sessionNumLineData.map(d => d.value)); // Maximum value based on data
//   const chartHeight = 250; // Assume chart height is 250 pixels

  // Step 3: Calculate the y-coordinate for the average line
//   const yCoordinateNumBasedOnAverage = chartHeight * (1 - (averageDataSessionsValue - yMin) / (yMax - yMin));
//   console.log("yCoordinateNumBasedOnAverage",yCoordinateNumBasedOnAverage)


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
        <View>
          <ScrollView horizontal={true}>
            <View className="flex-row justify-between mb-4 style={{ width: chartWidth }} ">
             
            {/* <LineChart
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
                
              /> */}
              
           
            
            </View>
          </ScrollView>
          
          <View className="flex-row justify-between mb-4">
            
            
          </View>

          <Text className="text-mindful-brown-100 font-urbanist-bold text-xl mb-4">
            Average Duration of Sessions Overtime
          </Text>
          <ScrollView horizontal={true}>
            <View className="flex-row justify-between mb-4 style={{ width: chartWidth }}">
            {/* <LineChart
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
                /> */}
                
            </View>
          </ScrollView>
          <View className="flex flex-wrap p-4 ">
  {/* First Row with 3 Filters */}
  <View className="flex-row justify-between w-full mb-4 border-t border-mindfulBrown80 mt-50px mb-50px">
    <View className="w-1/3 mt-4">
        <Text className="text-sm">Year</Text>
            <TextInput
            className="border border-yellow-400 px-2 py-1 w-20 text-center rounded"
            placeholder="YYYY"
            keyboardType="numeric"
            value={year}
            onChangeText={(text) => setYear(text)}
            />
    </View>
    <View className="w-1/3 mt-4">
        <Text className="text-sm">Month</Text>
            <TextInput
            className="border border-yellow-400 px-2 py-1 w-20 text-center rounded"
            placeholder="MM"
            keyboardType="numeric"
            value={month}
            onChangeText={(text) => setMonth(text)}
            />
        
    </View>
    <View className="w-1/3 mt-4">
        <Text className="text-sm">PSS Threshold (%)</Text>
            <TextInput
            className="border border-yellow-400 px-2 py-1 w-20 text-center rounded"
            placeholder='%'
            keyboardType="numeric"
            value={`${pssThreshold}`} // Replace with appropriate state variable
            onChangeText={(text) => setPssThreshold(text)}  // Replace with appropriate handler
            />
    </View>
  </View>

  {/* Second Row with 1 Filter and Apply Button */}
  <View className="flex-row items-center justify-between w-full gap-x-2">
    <View className="w-5/12 mt-2 mb-1">
        <Text className="text-sm">SMS Threshold (%)</Text>
            <TextInput
            className="border border-yellow-400 px-2 py-1 w-20 text-center rounded"
            placeholder='%'
            keyboardType="numeric"
            value={`${smsThreshold}`} // Replace with appropriate state variable
            onChangeText={(text) => setSmsThreshold(text)}  // Replace with appropriate handler
            />
    </View>
    <View className="w-1/3 mt-2 mb-1">
    <Text className="text-sm"></Text>
    <FilterButton
        title="Apply"
        onPress={fetchAllData}
        className="bg-brown-500 py-2 px-2 rounded text-white text-sm"
        />
      
        </View>
    </View>
    </View>
    <Text className="text-mindful-brown-100 font-urbanist-bold text-xl mb-4">
        Stress Reduction Group 
    </Text>
    <Text className="text-mindful-brown-100 font-urbanist-bold text-lg mb-4">
        PSS Results
    </Text>
    
    <View className="items-center justify-center">
        <View className="flex-row justify-center items-center w-full mb-4 " >
        {pssPieChartData.length > 0   ? (
        <ScrollView contentContainerStyle="items-center justify-center">
            <View style={{ width: pieChartWidth }} className="w-full items-center justify-center">
                <PieChart
                data={pssPieChartData}
                colors={[colors.mindfulBrown30, colors.mindfulBrown90]}
                radius={pieChartWidth / 2.5}  // Make it a donut chart
                innerRadius={pieChartWidth / 5} // Inner radius for the hole
                donut={true}
                showText
                centerLabelComponent={() => {
                    return(
                    <View>
                        <Text className = "font-urbanist-bold text-2xl text-center text-mindfulbrown-100">{`${pssPieChartData.find(item => item.label === "Improvement").value} % `}</Text>
                        <Text className = "font-urbanist text-sm text-mindfulbrown-100 text-center">sessions effectively reduced stress</Text>
                                        
                    </View>
                    )
                }}
                textPosition="center"
                centerTextFontSize={18}
                textColor={colors.mindfulBrown100}
                centerTextFontWeight="bold"

            />
            </View> 
        </ScrollView>
             
            
          ) : (
            <Text>No data available for selected period and/or threshold</Text>
        )}
        </View>
    </View>

    <Text className="text-mindful-brown-100 font-urbanist-bold text-lg mb-4">
        General Assessment Results
    </Text>
    
    <ScrollView horizontal={true}>
        <View className="flex-row justify-between mb-4 " >
        {stressGenData.length > 0   ? (
        <ScrollView horizontal={true}>
            <View style={{ width: pieChartWidth }}>
                <PieChart
                data={stressGenData}
                colors={[colors.mindfulBrown30, colors.mindfulBrown90]}
                radius={pieChartWidth / 2.5}  // Make it a donut chart
                innerRadius={pieChartWidth / 5} // Inner radius for the hole
                donut={true}
                showText
                centerLabelComponent={() => {
                    return(
                    <View>
                        <Text className = "font-urbanist-bold text-2xl text-center text-mindfulbrown-100">{`${stressGenData.find(item => item.label === "Improvement").value} % `}</Text>
                        <Text className = "font-urbanist text-sm text-mindfulbrown-100 text-center">sessions effectively reduced stress</Text>
                                        
                    </View>
                    )
                }}
                textPosition="center"
                centerTextFontSize={18}
                textColor={colors.mindfulBrown100}
                centerTextFontWeight="bold"

            />
            </View> 
        </ScrollView>
             
            
          ) : (
            <Text>No data available for selected period and/or threshold</Text>
        )}
        </View>
    </ScrollView>

    <Text className="text-mindful-brown-100 font-urbanist-bold text-xl mb-4">
        Mindfulness Improve Group 
    </Text>
    <Text className="text-mindful-brown-100 font-urbanist-bold text-lg mb-4">
        SMS Results
    </Text>

    <ScrollView horizontal={true}>
        <View className="flex-row justify-between mb-4 " >
        {smsPieChartData.length > 0   ? (
        <ScrollView horizontal={true}>
            <View style={{ width: pieChartWidth }}>
                <PieChart
                data={smsPieChartData}
                colors={[colors.mindfulBrown30, colors.mindfulBrown90]}
                radius={pieChartWidth / 2.5}  // Make it a donut chart
                innerRadius={pieChartWidth / 5} // Inner radius for the hole
                donut={true}
                showText
                centerLabelComponent={() => {
                    return(
                    <View>
                        <Text className = "font-urbanist-bold text-2xl text-center text-mindfulbrown-100">{`${smsPieChartData.find(item => item.label === "Improvement").value} % `}</Text>
                        <Text className = "font-urbanist text-sm text-mindfulbrown-100 text-center">sessions effectively improved mindfulness</Text>
                                        
                    </View>
                    )
                }}
                textPosition="center"
                centerTextFontSize={18}
                textColor={colors.mindfulBrown100}
                centerTextFontWeight="bold"

            />
            </View> 
        </ScrollView>
             
            
          ) : (
            <Text>No data available for selected period and/or threshold</Text>
        )}
        </View>
    </ScrollView>

    <Text className="text-mindful-brown-100 font-urbanist-bold text-lg mb-4">
        General Assessment Results
    </Text>

    <ScrollView horizontal={true}>
        <View className="flex-row justify-between mb-4 " >
        {mindfulnessGenData.length > 0   ? (
        <ScrollView horizontal={true}>
            <View style={{ width: pieChartWidth }}>
                <PieChart
                data={mindfulnessGenData}
                colors={[colors.mindfulBrown30, colors.mindfulBrown90]}
                radius={pieChartWidth / 2.5}  // Make it a donut chart
                innerRadius={pieChartWidth / 5} // Inner radius for the hole
                donut={true}
                showText
                centerLabelComponent={() => {
                    return(
                    <View>
                        <Text className = "font-urbanist-bold text-2xl text-center text-mindfulbrown-100">{`${mindfulnessGenData.find(item => item.label === "Improvement").value} % `}</Text>
                        <Text className = "font-urbanist text-sm text-mindfulbrown-100 text-center">sessions effectively improved mindfulness</Text>
                                        
                    </View>
                    )
                }}
                textPosition="center"
                centerTextFontSize={18}
                textColor={colors.mindfulBrown100}
                centerTextFontWeight="bold"

            />
            </View> 
        </ScrollView>
             
            
          ) : (
            <Text>No data available for selected period and/or threshold</Text>
        )}
        </View>
    </ScrollView>

    <Text className="text-mindful-brown-100 font-urbanist-bold text-2xl mb-4">
        Overall Improvement Analysis
    </Text>
    <View className="flex-row justify-between mb-4">
        <ImprovementAnalytics pssPieChartData={pssPieChartData} smsPieChartData={smsPieChartData} stressGenData={stressGenData} mindfulnessGenData={mindfulnessGenData} />
    </View>

   
    
         </View>

        )}

         
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SurveyScoresAnalytics