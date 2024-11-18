import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BrownPageTitlePortion from '../../components/brownPageTitlePortion';
import StatusBarComponent from '../../components/darkThemStatusBar';
import { colors } from '../../common/styles';
import { PieChart, BarChart, LineChart } from 'react-native-gifted-charts';
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

  
    const getGenData = async() =>
    {
        try {
            const params = {}
            if(year) params.year = year;
            if(month) params.month = month;
            const genScoreData = await genScoreSession(params);

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

        } catch (error) {
            console.error("Error fetching data for charts:", error);

        }
    }
 
    const getProfData = async () => {
      try {
       
        const params = {
            pss: pssThreshold || 20,  // If pss is not provided, set it to 20
            sms: smsThreshold || -20  // If sms is not provided, set it to -20
        };

        if(year) params.year = year;
        if(month) params.month = month;
        
        const profScorePercentData = await profPercentScoreSession(params);
        setProfScorePercentData(profScorePercentData);
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
      console.log("error",error)
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



  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.optimisticGray10 }}>
        <Loading />
      </View>
    );
  }

  // Use the number of data points to determine the chart width


  return (
    <SafeAreaView
      className="flex-1 bg-optimistic-gray-10"
      backgroundColor="#251404"
    >
      <StatusBarComponent barStyle="light-content" backgroundColor="#251404" />
      <BrownPageTitlePortion title="Overall Assessment" />

      <ScrollView className="flex-1 bg-optimistic-gray-10 mb-16 ">
      
        

        <View className="p-2">
          
          {loading ? (
              <ActivityIndicator size="large" color={colors.mindfulBrown80} style={{ marginVertical: 20 }} />
            ) : error ? (
              <Text style={{ color: 'red', marginVertical: 20 }}>{error}</Text>
            ) : (
                
        <View>
          
          <Text className="text-mindful-brown-100 font-urbanist-bold text-2xl">
        Overall Improvement Analysis
        </Text>
          <View className="flex flex-wrap p-4 ">
            {/* First Row with 3 Filters */}
            <View className="flex-row justify-between w-full ">
              <View className="w-1/3 mt-4">
                  <Text className="text-mindful-brown-80 font-urbanist-bold text-sm">Year</Text>
                    <TextInput
                    className="border-2 border-optimistic-gray-30 px-2 py-1 w-20 text-center rounded"
                    placeholder="YYYY"
                    keyboardType="numeric"
                    value={year}
                    onChangeText={(text) => setYear(text)}
                    />
              </View>
              <View className="w-1/3 mt-4">
                  <Text className="text-mindful-brown-80 font-urbanist-bold text-sm">Month</Text>
                    <TextInput
                    className="border-2 border-optimistic-gray-30 px-2 py-1 w-20 text-center rounded"
                    placeholder="MM"
                    keyboardType="numeric"
                    value={month}
                    onChangeText={(text) => setMonth(text)}
                    />
                  
              </View>
              <View className="w-1/3 mt-4">
                  <Text className="text-mindful-brown-80 font-urbanist-bold text-sm">PSS Threshold (%)</Text>
                    <TextInput
                    className="border-2 border-optimistic-gray-30 px-2 py-1 w-20 text-center rounded"
                    placeholder='%'
                    keyboardType="numeric"
                    value={`${pssThreshold}`} // Replace with appropriate state variable
                    onChangeText={(text) => setPssThreshold(text)}  // Replace with appropriate handler
                    />
              </View>
            </View>

            {/* Second Row with 1 Filter and Apply Button */}
            <View className="flex-row items-center justify-between w-full gap-x-2 ">
              <View className="w-5/12 mt-2 mb-1">
                  <Text className="text-mindful-brown-80 font-urbanist-bold text-sm">SMS Threshold (%)</Text>
                    <TextInput
                    className="border-2 border-optimistic-gray-30 px-2 py-1 w-20 text-center rounded"
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