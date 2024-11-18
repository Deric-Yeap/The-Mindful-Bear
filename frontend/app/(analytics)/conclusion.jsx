import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { colors } from '../../common/styles';

const screenWidth = Dimensions.get('window').width;

const ImprovementAnalytics = ({ pssPieChartData,smsPieChartData, stressGenData, mindfulnessGenData }) => {
  const cleanData = (data) => data.map(({ value, ...rest }) => ({ ...rest, value: +value.toFixed(2) }));

  const cleanedPssPieChartData = cleanData(pssPieChartData);
  const cleanedSmsPieChartData = cleanData(smsPieChartData);
  const cleanedStressGenData = cleanData(stressGenData);
  const cleanedMindfulnessGenData = cleanData(mindfulnessGenData);

  const [genericWeight, setGenericWeight] = useState('50');
  const [professionalWeight, setProfessionalWeight] = useState('50');
  const [showConclusion, setShowConclusion] = useState(false);
  
  
  const calculateWeightedImprovement = (genericData, professionalData) => {
    const genericImprovement = genericData[0].value;
    const professionalImprovement = professionalData[0].value;

    const weightedGeneric = (genericImprovement * (parseFloat(genericWeight) / 100));
    const weightedProfessional = (professionalImprovement * (parseFloat(professionalWeight) / 100));
    const totalWeightedImprovement = weightedGeneric + weightedProfessional;

    return {
      weightedGeneric,
      weightedProfessional,
      totalWeightedImprovement,
      genericImprovement,
      professionalImprovement,
    };
  };

  const handleWeightChange = (value, type) => {
    const numValue = Math.min(Math.max(0, parseInt(value) || 0), 100);
    if (type === 'generic') {
      setGenericWeight(numValue.toString());
      setProfessionalWeight((100 - numValue).toString());
    } else {
      setProfessionalWeight(numValue.toString());
      setGenericWeight((100 - numValue).toString());
    }
  };

  const renderLegend = (data) => {
    return (
      <View style={styles.legendContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>{item.label} ({item.value}%)</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderAnalysisSection = (genericData, professionalData, title) => {
    return (
      <View style={styles.analysisSection} className="px-1">
        <Text className="text-mindful-brown-80 font-urbanist-bold text-xl mb-4 items-center text-center">{title}</Text>
        <View style={styles.chartsRow}>
          <View style={[styles.chartContainer, styles.halfWidth]}>
            <Text className="text-mindful-brown-80 font-urbanist-bold text-lg items-center text-center">Generic Improvement</Text>
            <View style={styles.pieChartContainer}>
              <PieChart
                data={genericData}
                donut
                showText
                colors={[colors.mindfulBrown30, colors.mindfulBrown70]}
                textColor="white"
                radius={screenWidth * 0.15}
                innerRadius={screenWidth * 0.09}
                textSize={12}
                focusOnPress
                centerLabelComponent={() => (
                  <View style={styles.centerLabel}>
                    <Text className= "font-urbanist-bold text-sm text-center text-mindfulbrown-100">
                      {genericData[0].value}%
                    </Text>
                  </View>
                )}
              />
            </View>
            {renderLegend(genericData)}
          </View>

          <View style={[styles.chartContainer, styles.halfWidth]}>
            <Text className="text-mindful-brown-80 font-urbanist-bold text-lg items-center text-center">Professional Improvement</Text>
            <View style={styles.pieChartContainer}>
              <PieChart
                data={professionalData}
                donut
                colors={[colors.mindfulBrown30, colors.mindfulBrown70]}
                showText
                textColor="white"
                radius={screenWidth * 0.15}
                innerRadius={screenWidth * 0.09}
                textSize={12}
                focusOnPress
                centerLabelComponent={() => (
                  <View style={styles.centerLabel}>
                    <Text className= "font-urbanist-bold text-sm text-center text-mindfulbrown-100">
                      {professionalData[0].value}%
                    </Text>
                  </View>
                )}
              />
            </View>
            {renderLegend(professionalData)}
          </View>
        </View>
      </View>
    );
  };

  const renderConclusion = () => {
    const pssResults = calculateWeightedImprovement(stressGenData, pssPieChartData);
    const smsResults = calculateWeightedImprovement(mindfulnessGenData, smsPieChartData);
   
    const conclusionText = pssResults.totalWeightedImprovement >= 50 
      ? smsResults.totalWeightedImprovement >= 50 
        ? "The combined analysis reveals significant improvement in both stress and mindfulness, suggesting strong progress in overall wellbeing."
        : "While stress management shows significant improvement, further efforts are needed to enhance mindfulness levels."
      : smsResults.totalWeightedImprovement < 50 
        ? "Mindfulness has shown significant improvement, but additional focus is required to reduce stress levels."
        : "The combined analysis indicates moderate improvement, highlighting the need for further work to improve both stress and mindfulness.";


    return (
      <View style={styles.conclusionContainer}>
        <Text className="text-mindful-brown-80 font-urbanist-bold text-xl mb-4">Analysis Conclusion</Text>
        
        <View style={styles.conclusionSection}>
          <Text className="text-mindful-brown-80 font-urbanist-bold text-lg mb-4">PSS Analysis</Text>
          <Text className="text-mindful-brown-80 font-urbanist-bold text-sm">
            Based on the weighted analysis (Generic: {genericWeight}%, Professional: {professionalWeight}%):
          </Text>
          <View style={styles.conclusionDetails}>
            <Text className="text-mindful-brown-90 font-urbanist text-sm">
              • Generic: {pssResults.genericImprovement.toFixed(1)}% improvement, contributing {pssResults.weightedGeneric.toFixed(1)}%
            </Text>
            <Text className="text-mindful-brown-90 font-urbanist text-sm">
              • Professional PSS: {pssResults.professionalImprovement.toFixed(1)}% improvement, contributing {pssResults.weightedProfessional.toFixed(1)}%
            </Text>
            <Text className="text-mindful-brown-80 font-urbanist-bold text-sm">
              • Overall stress improvement: {pssResults.totalWeightedImprovement.toFixed(1)}%
            </Text>
          </View>
        </View>

        <View style={styles.conclusionSection}>
          <Text className="text-mindful-brown-80 font-urbanist-bold text-lg mb-4">SMS Analysis</Text>
          <Text className="text-mindful-brown-80 font-urbanist-bold text-sm mb-4">
            Based on the same weightage:
          </Text>
          <View style={styles.conclusionDetails}>
          <Text className="text-mindful-brown-90 font-urbanist text-sm">
              • Generic: {pssResults.genericImprovement.toFixed(1)}% improvement, contributing {pssResults.weightedGeneric.toFixed(1)}%
            </Text>
         
            <Text style={styles.conclusionItem}>     
              • Professional SMS: {smsResults.professionalImprovement.toFixed(1)}% improvement, contributing {smsResults.weightedProfessional.toFixed(1)}%
            </Text>
            <Text className="text-mindful-brown-80 font-urbanist-bold text-sm">
              • Overall mindfulness improvement: {smsResults.totalWeightedImprovement.toFixed(1)}%
            </Text>
          </View>
        </View>

        <View style={[
          styles.conclusionAlert,
          { backgroundColor: '#FFF3E0' }
        ]}>
          <Text style={styles.conclusionAlertText}>
            { conclusionText }
</Text>

        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {renderAnalysisSection(cleanedStressGenData, cleanedPssPieChartData, "Stress Improvement")}
        {renderAnalysisSection(cleanedMindfulnessGenData, cleanedSmsPieChartData, "Mindfulness Improvement")}

        <View style={styles.weightageContainer}>
          <Text className="text-mindful-brown-80 font-urbanist-bold text-xl mb-4">Weightage Configuration</Text>
          <View style={styles.inputContainer}>
            <View style={styles.inputGroup}>
              <Text className="text-mindful-brown-80 font-urbanist-bold text-sm mb-2">Generic Weight (%)</Text>
              <TextInput
                className="text-mindful-brown-80 font-urbanist text-sm mb-4 border-2 border-optimistic-gray-30 h-10 w-1/6 text-center"
                value={genericWeight}
                onChangeText={(value) => handleWeightChange(value, 'generic')}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text className="text-mindful-brown-80 font-urbanist-bold text-sm mb-2">Professional Weight (%)</Text>
              <TextInput
                className="text-mindful-brown-80 font-urbanist text-sm mb-4 border-2 border-optimistic-gray-30 h-10 w-1/6 text-center"
                value={professionalWeight}
                onChangeText={(value) => handleWeightChange(value, 'professional')}
                keyboardType="numeric"
              />
            </View>
          </View>
          <TouchableOpacity
            className="bg-mindful-brown-80 p-4 rounded-md items-center text-sm"
            onPress={() => setShowConclusion(true)}
          >
            <Text className="text-white font-urbanist-bold text-lg">Generate Conclusion</Text> 
          </TouchableOpacity>
        </View>

        {showConclusion && renderConclusion()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  analysisSection: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  chartsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  chartContainer: {
    padding: 8,
    marginBottom: 16,
  },
  halfWidth: {
    width: '48%',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  pieChartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  legendContainer: {
    marginTop: 12,
    alignItems: 'start',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
  },
  centerLabel: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerLabelValue: {
    fontSize: 14,
    fontFamily: 'urbanist-bold',
  },
  weightageContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  weightageTitle: {
    fontSize: 18,
    fontFamily: 'urbanist-bold',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'urbanist'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: colors.mindfulBrown100,
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'urbanist-bold',
  },
  conclusionContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  conclusionTitle: {
    fontSize: 20,
    fontFamily: 'urbanist-bold',
    marginBottom: 16,
  },
  conclusionSection: {
    marginBottom: 20,
  },
  conclusionSubtitle: {
    fontSize: 16,
    fontFamily: 'urbanist-bold',
    marginBottom: 8,
    color: '#2196F3',
  },
  conclusionText: {
    fontSize: 14,
    fontFamily: 'urbanist',
    marginBottom: 12,
  },
  conclusionDetails: {
    marginBottom: 16,
  },
  conclusionItem: {
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'urbanist',
  },
  conclusionAlert: {
    padding: 16,
    borderRadius: 4,
    marginTop: 8,
  },
  conclusionAlertText: {
    fontSize: 14,
  },
});

export default ImprovementAnalytics;