import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { PieChart } from 'react-native-gifted-charts'; 
import{ colors } from '../../common/styles';

const PieChartComponent = ({ pieChartData, pieChartWidth, title, chartLabel }) => {
  return (
    <ScrollView horizontal={true}>
      <View className="flex-row justify-between mb-4">
        {pieChartData.length > 0 ? (
          <ScrollView horizontal={true}>
            <View style={{ width: pieChartWidth }}>
              <PieChart
                data={pieChartData}
                colors={[colors.mindfulBrown30, colors.mindfulBrown90]}
                radius={pieChartWidth / 2.5}  // Make it a donut chart
                innerRadius={pieChartWidth / 5} // Inner radius for the hole
                donut={true}
                showText
                centerLabelComponent={() => {
                  const improvementValue = pieChartData.find(item => item.label === "Improvement")?.value || 0;
                  return (
                    <View>
                      <Text className="font-urbanist-bold text-2xl text-center text-mindfulbrown-100">
                        {`${improvementValue} %`}
                      </Text>
                      <Text className="font-urbanist text-sm text-mindfulbrown-100">{chartLabel}</Text>
                    </View>
                  );
                }}
                textPosition="center"
                centerText={title}
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
  );
};

export default PieChartComponent;
