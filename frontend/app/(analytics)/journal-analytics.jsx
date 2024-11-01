
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, Dimensions, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BrownPageTitlePortion from '../../components/brownPageTitlePortion';
import StatusBarComponent from '../../components/darkThemStatusBar';
import CustomButton from '../../components/customButton'; // Importing CustomButton
import { colors } from '../../common/styles';
import { LineChart } from 'react-native-gifted-charts';
import PositiveBear from '../../assets/positiveBear.png';
import NeutralBear from '../../assets/neutralBear.png';
import NegativeBear from '../../assets/negativeBear.png';
import Toggle from '../../components/toggle';
import Loading from '../../components/loading';
import { journalCounts, getJournalClassification } from '../../api/journal';

const JournalAnalytics = () => {
  const [selectedBear, setSelectedBear] = useState('Positive');
  const [selectedOption, setSelectedOption] = useState(1);
  const [lineData, setLineData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [classificationData, setClassificationData] = useState([]);
  const [lastRefreshTime, setLastRefreshTime] = useState(null);
  
  const optionList = ['daily', 'monthly', 'yearly'];
  const periodSelected = optionList[selectedOption - 1];
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = Math.max(screenWidth, lineData.length * 100);

  //filter for topic classification
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [entries, setEntries] = useState([]);

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
          const transformedData = response.counts.map((item) => ({
            value: item.count,
            label: item.date,
          }));
          setLineData(transformedData);
        } else {
          setError('No data found');
        }
      } catch (error) {
        setError('An error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchJournalData();
  }, [selectedBear, selectedOption]);

  //Topic classification: Fetch classification data with optional year and month filtering
  const fetchClassificationData = async () => {
    try {
      const params = {};
      if (year) params.year = year;
      if (month) params.month = month;

      const response = await getJournalClassification(params); // Correct API call
      console.log("Full response from getJournalClassification:", response);

      const entries = response?.data?.classified_entries;
      if (Array.isArray(entries)) {
        setClassificationData(entries);
      } else {
        console.warn("Unexpected response structure:", response);
        setClassificationData([]);
      }
    } catch (error) {
      console.error("Failed to fetch classification data:", error);
    }
  };

  useEffect(() => {
    fetchClassificationData();
  }, [year, month]); // Trigger re-fetch when year or month changes


  const onSelectSwitch = (option) => {
    setSelectedOption(option);
  };

  const handlePress = (bearType) => {
    setSelectedBear(bearType);
  };

  const calculateAverageLine = (data) => {
    const averageValue = data.reduce((sum, point) => sum + point.value, 0) / data.length;
    return data.map(point => ({ value: averageValue, label: point.label }));
  };

  const averageLineData = selectedOption === 1 ? calculateAverageLine(lineData) : [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors['optimistic-gray-10'] }}>
      <StatusBarComponent barStyle="light-content" backgroundColor={colors.mindfulBrown100} />
      <BrownPageTitlePortion title="Mindful Journal Analytics" tabName="(tabs)" screenName="stats" />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
        
        {/* Filter by Period Section */}
        <Text className="text-mindful-brown-100 font-urbanist-extra-bold text-xl mb-2 mt-2 ml-6">
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

        {/* Filter by Sentiment Section */}
        <Text className="text-mindful-brown-100 font-urbanist-extra-bold text-xl mb-2 mt-2 ml-6">
          Filter by Sentiment
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
          {['Positive', 'Neutral', 'Negative'].map((bearType) => (
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
              <Image
                source={
                  bearType === 'Positive'
                    ? PositiveBear
                    : bearType === 'Neutral'
                    ? NeutralBear
                    : NegativeBear
                }
                style={{ width: 80, height: 80 }}
                resizeMode="contain"
              />
              <Text style={{ marginTop: 8, fontSize: 16, color: 'black' }}>{bearType}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Line Chart Section */}
        <Text className="text-mindful-brown-100 font-urbanist-extra-bold text-xl mb-2 mt-2 ml-6">
          No. of journal entries based on sentiment
        </Text>
        {loading ? (
          <ActivityIndicator size="large" color={colors.mindfulBrown80} style={{ marginVertical: 20 }} />
        ) : error ? (
          <Text style={{ color: 'red', marginVertical: 20 }}>{error}</Text>
        ) : (
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <LineChart
              areaChart
              curved
              data={lineData.length > 1 ? lineData : null}
              data2={averageLineData.length > 1 ? averageLineData : null}
              width={chartWidth}
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
              startOpacity2={0}
              endOpacity2={0}
              strokeDashArray2={[4, 4]}
              xAxisTickCount={5}
              xAxisLabelTextStyle={{
                transform: [{ rotate: '-15deg' }],
                textAlign: 'center',
                overflow: 'visible',
                fontSize: lineData.length > 10 ? 8 : 11,
                color: colors.mindfulBrown100,
                fontWeight: 'bold',
              }}
              xAxisLabelContainerStyle={{
                paddingBottom: 60,
                paddingHorizontal: lineData.length > 10 ? 15 : 7,
                paddingTop: -20,
                paddingLeft: 20,
              }}
              hideXAxis={false}
            />
          </ScrollView>
        )}

                {/* Filter by Month and Year Section for Classification */}
                <Text className="text-mindful-brown-100 font-urbanist-extra-bold text-xl mb-2 mt-2 ml-6">
          Filter by Month and Year
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 10 }}>
          <View style={{ alignItems: 'center' }}>
            <Text>Year</Text>
            <TextInput
              style={{ borderWidth: 1, borderColor: colors.zenYellow20, padding: 5, width: 80, textAlign: 'center' }}
              placeholder="YYYY"
              keyboardType="numeric"
              value={year}
              onChangeText={(text) => setYear(text)}
            />
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text>Month</Text>
            <TextInput
              style={{ borderWidth: 1, borderColor: colors.zenYellow20, padding: 5, width: 80, textAlign: 'center' }}
              placeholder="MM"
              keyboardType="numeric"
              value={month}
              onChangeText={(text) => setMonth(text)}
            />
          </View>
          <CustomButton onPress={fetchClassificationData} title="Apply Filter" />
        </View>


        {/* topic classification */}
        <View style={{ paddingVertical: 20 }}>
          <Text className="text-mindful-brown-100 font-urbanist-extra-bold text-xl mb-2 mt-2 ml-6">
            Journal Classification
          </Text>

          {classificationData.map((topicData, index) => (
            <View
              key={index}
              style={{
                backgroundColor: colors['mindful-brown-20'],
                margin: 10,
                padding: 10,
                borderRadius: 10,
              }}
            >
              <Text
                className="text-mindful-brown-100 font-urbanist-extra-bold text-lg mb-2"
                style={{ marginBottom: 10 }}
              >
                Top 10 Reasons for {topicData.topic}:
              </Text>

              {/* Table Header */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingBottom: 10,
                  borderBottomWidth: 1,
                  borderColor: colors['mindful-brown-60'],
                }}
              >
                <Text className="text-mindful-brown-100 font-urbanist-bold text-base">
                  Keyword
                </Text>
                <Text className="text-mindful-brown-100 font-urbanist-bold text-base">
                  Mentions
                </Text>
              </View>

              {/* Table Rows */}
              {topicData.top_reasons.slice(0, 10).map((reason, idx) => (
                <View
                  key={idx}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: 6,
                    borderBottomWidth: idx === topicData.top_reasons.length - 1 ? 0 : 1,
                    borderColor: colors['mindful-brown-30'],
                  }}
                >
                  <Text className="text-mindful-brown-100 text-base">
                    {reason.reason}
                  </Text>
                  <Text className="text-mindful-brown-100 text-base">
                    {reason.mentions}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default JournalAnalytics;
