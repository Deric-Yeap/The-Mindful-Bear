import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BrownPageTitlePortion from '../../components/brownPageTitlePortion';
import StatusBarComponent from '../../components/darkThemStatusBar';
import { colors } from '../../common/styles';
import { LineChart } from 'react-native-gifted-charts';
import PositiveBear from '../../assets/positiveBear.png';
import NeutralBear from '../../assets/neutralBear.png';
import NegativeBear from '../../assets/negativeBear.png';
import Toggle from '../../components/toggle';
import axiosInstance from '../../common/axiosInstance';
import { journalCounts } from '../../api/journal'
import Loading from '../../components/loading';
import { Svg } from 'react-native-svg';


const JournalAnalytics = () => {
  const [selectedBear, setSelectedBear] = useState('Positive'); 
  const [selectedOption, setSelectedOption] = useState(1); 
  const [lineData, setLineData] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 
  const optionList = ['daily', 'monthly', 'yearly'];
  const periodSelected =  optionList[selectedOption - 1]

  useEffect(() => {
    const fetchJournalData = async () => {
      setLoading(true); 
      setError(null); 
      try {
        const response = await journalCounts({
          sentiment: selectedBear,
          period: periodSelected,
        });
  
        if (response && Array.isArray(response.counts)) {
          const transformedData = response.counts.map(item => ({
            value: item.count,
            label: item.date,
          }));
          setLineData(transformedData); 
        } else {
          setError('No data found'); 
        }
      } catch (error) {
        if (error.response) {
          setError(`Error: ${error.response.data.message || 'An error occurred.'}`);
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
      } finally {
        setLoading(false); 
      }
    };
  
    fetchJournalData(); 
  }, [selectedBear, selectedOption]); 
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.optimisticGray10 }}>
        <Loading />
      </View>
    );
  }
  const onSelectSwitch = option => {
    setSelectedOption(option);
  };

  const handlePress = bearType => {
    setSelectedBear(bearType);
  };
   // Inside your MindfulnessExercisesAnalytics component
   const screenWidth = Dimensions.get('window').width;

   // Use the number of data points to determine the chart width
   const chartWidth = Math.max(screenWidth, lineData.length * 100); // Ensure at least the screen width
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
 
  const averageLineData = selectedOption === 1 ? calculateAverageLine(lineData) : [];
   const trendlineData = selectedOption !== 1 ? calculateTrendline(lineData) : [];

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors['optimistic-gray-10'] }}
    >
      <StatusBarComponent
        barStyle="light-content"
        backgroundColor={colors.mindfulBrown100}
      />
      <BrownPageTitlePortion title="Mindful Journal Analytics" tabName="(tabs)" screenName="stats" />
      <ScrollView style={{ flex: 1 }}>
        <Text style={{ color: colors['mindful-brown-80'], fontWeight: 'bold', fontSize: 18, marginTop: 16, marginLeft: 12 }}>
          Filter by Period
        </Text>
        
        <View style={{ alignItems: 'center', marginLeft: 10, marginRight: 10 }}>
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

        <Text style={{ color: colors['mindful-brown-80'], fontWeight: 'bold', fontSize: 18, marginTop: 16, marginLeft: 12 }}>
          Filter by Sentiment
        </Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
          {['Positive', 'Neutral', 'Negative'].map(bearType => (
            <TouchableOpacity
              key={bearType}
              onPress={() => handlePress(bearType)}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: selectedBear === bearType ? colors.empathyOrange10 : 'transparent',
                borderColor: colors.zenYellow20,
                borderWidth: 2,
                borderRadius: 8,
                padding: 8,
              }}
            >
              <Image source={bearType === 'Positive' ? PositiveBear : bearType === 'Neutral' ? NeutralBear : NegativeBear} style={{ width: 80, height: 80 }} resizeMode="contain" />
              <Text style={{ marginTop: 8, fontSize: 16, color: 'black' }}>{bearType}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={{ color: colors['mindful-brown-80'], fontWeight: 'bold', fontSize: 18, marginTop: 16, marginLeft: 10 }}>
          No. of journal entries based on sentiment
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.mindfulBrown80} style={{ marginVertical: 20 }} />
        ) : error ? (
          <Text style={{ color: 'red', marginVertical: 20 }}>{error}</Text>
        ) : (
          <View style={{ paddingVertical: 8 }}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              <LineChart
                areaChart
                curved
                data={lineData}
                data2={averageLineData}
                data3={trendlineData}
                 // Ensure this is your data
                width={chartWidth} // Make chart width dynamic based on data
                height={250}
                showVerticalLines
                spacing={70}
                initialSpacing={0}
                color1={colors.mindfulBrown100}
                hideDataPoints
                dataPointsColor1={colors.mindfulBrown100}
                startFillColor1={colors.mindfulBrown50}
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
                xAxisTickCount={5} // Adjust based on your data
                xAxisLabelTextStyle={{
                    transform: [{ rotate: '-15deg' }], // Consistent rotation angle for all labels
                    textAlign: 'center',
                    overflow: 'visible',
                    fontSize: lineData.length > 10 ? 8 : 11,
                    color: colors.mindfulBrown100,
                    fontWeight: 'bold',
                }}
                xAxisLabelContainerStyle={{
                    paddingBottom: 60, // Fixed padding for bottom space
                    paddingHorizontal: lineData.length > 10 ? 15 : 7,
                    paddingTop: -20,
                    paddingLeft: 20,
                }}
                hideXAxis={false} 
              />
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default JournalAnalytics;