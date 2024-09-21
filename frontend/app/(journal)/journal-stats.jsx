import { View, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart } from 'react-native-gifted-charts';
import { colors } from '../../common/styles';
import BackButton from '../../components/backButton';
import CustomButton from '../../components/customButton';
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
const JournalStats = () => {
  const barData = [
    { value: 5, label: 'Happy', frontColor: colors.serenityGreen50 },
    { value: 11, label: 'Angry', frontColor: colors.presentRed40 },
    { value: 8, label: 'Bad', frontColor: colors.mindfulBrown60 },
    { value: 1, label: 'Surprised', frontColor: colors.empathyOrange40 },
    { value: 4, label: 'Sad', frontColor: '#507DBC' },
    { value: 1, label: 'Disgusted', frontColor: colors.kindPurple40 },
  ];
  
  // Calculate the max value dynamically from the barData
  const maxValue = Math.max(...barData.map((item) => item.value));

  // Set noOfSections (adjustable based on your needs)
  const noOfSections = 4;
  
  // Calculate stepValue so that the topmost label is maxValue
  const stepValue = Math.ceil(maxValue / noOfSections);
  return (
    <SafeAreaView className="bg-optimistic-gray-10 h-full p-4 space-y-4">
      <BackButton buttonStyle="mb-4" />
      <View className="flex-row items-center justify-between">
      <View>
        <Text className="font-urbanist-extra-bold text-mindful-brown-80 text-4xl mb-1">
          Journal Stats
        </Text>
        <Text className="font-urbanist-light text-mindful-brown-80 text-xl">
            from 25 Feb 2025 to 25 Mar 2025
        </Text>
      </View>
      <View className={`w-16 h-16 rounded-full bg-empathy-orange-40 flex items-center justify-center -mt-4`}>
      <MaterialCommunityIcons
                name="calendar-month-outline"
                size={30}
                color={'white'}
              />
      </View>
      </View>
      <View className="pb-20"> 
    <BarChart
        height={400}
        barWidth={30}
        barBorderRadius={20}
        frontColor="lightgray"
        data={barData}
        yAxisThickness={0}
        xAxisThickness={0}
        borderSkipped={false}
        isAnimated
        yAxisMaxValue={maxValue}  // Set the max Y-axis value to the maxValue
        stepValue={stepValue}     // Set the step value
        noOfSections={noOfSections}  // Dynamic number of sections
        yAxisLabelTexts={Array.from(
          { length: noOfSections + 1 },
          (_, i) => (i * stepValue).toString()
        ).concat(maxValue.toString())} // Ensure the top label is exactly maxValue
            
          showValuesOnTopOfBars={false} // Turn off top display
          renderLabelOnTop={(barData) => (
            <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
              {barData.value}
            </Text>
          )} // Render values inside the bars
      />
      
</View>
      <CustomButton
        title="See All Journal Entries"
        handlePress={() => router.push('/(journal)/journal-history')}
        buttonStyle="w-full"
      />
    </SafeAreaView>
  );
};

export default JournalStats;