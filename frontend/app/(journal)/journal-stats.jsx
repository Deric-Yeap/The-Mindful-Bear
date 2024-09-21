import { View, Text, TouchableOpacity, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BarChart } from 'react-native-gifted-charts'
import { colors } from '../../common/styles'
import BackButton from '../../components/backButton'
import CustomButton from '../../components/customButton'
import { router } from 'expo-router'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Calendar } from 'react-native-calendars'
import { journalEntriesByPeriod } from '../../api/journal'

const JournalStats = ({
  title = 'Journal Stats',
  subtitle = 'Please Select a date range',
}) => {
  const today = new Date()
  const [modalVisible, setModalVisible] = useState(false)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [journals, setJournals] = useState([])
  console.log('startdate', startDate)
  console.log('enddate', endDate)

  const handleOnPress = () => {
    setModalVisible(true)
  }

  const handleDayPress = (day) => {
    const selectedDate = new Date(day.timestamp)
    if (!startDate || (startDate && endDate)) {
      setStartDate(selectedDate)
      setEndDate(null)
    } else if (selectedDate < startDate) {
      setStartDate(selectedDate)
      setEndDate(null)
    } else {
      setEndDate(selectedDate)
    }
  }

  const getMarkedDates = () => {
    const marked = {}
    if (startDate && endDate) {
      const startKey = startDate.toISOString().split('T')[0]
      const endKey = endDate.toISOString().split('T')[0]

      marked[startKey] = {
        selected: true,
        startingDay: true,
        color: '#005700',
        textColor: 'white',
        customStyles: {
          container: {
            borderTopLeftRadius: 50,
            borderBottomLeftRadius: 50,
            overflow: 'hidden',
          },
        },
      }
      marked[endKey] = {
        selected: true,
        endingDay: true,
        color: '#005700',
        textColor: 'white',
        customStyles: {
          container: {
            borderTopRightRadius: 50,
            borderBottomRightRadius: 50,
            overflow: 'hidden',
          },
        },
      }

      let currentDate = new Date(startDate)
      while (currentDate <= endDate) {
        marked[currentDate.toISOString().split('T')[0]] = {
          color: '#add8e6',
        }
        currentDate.setDate(currentDate.getDate() + 1)
      }
    } else if (startDate) {
      const startKey = startDate.toISOString().split('T')[0]
      marked[startKey] = {
        selected: true,
        color: '#005700',
        textColor: 'white',
      }
    }
    return marked
  }

  const barData = [
    { value: 5, label: 'Happy', frontColor: colors.serenityGreen50 },
    { value: 11, label: 'Angry', frontColor: colors.presentRed40 },
    { value: 8, label: 'Bad', frontColor: colors.mindfulBrown60 },
    { value: 1, label: 'Surprised', frontColor: colors.empathyOrange40 },
    { value: 4, label: 'Sad', frontColor: '#507DBC' },
    { value: 1, label: 'Disgusted', frontColor: colors.kindPurple40 },
  ]

  const maxValue = Math.max(...barData.map((item) => item.value))
  const noOfSections = 4
  const stepValue = Math.ceil(maxValue / noOfSections)

  useEffect(() => {
    const fetchData = async () => {
      if (startDate && endDate) {
        // Ensure both dates are set before making the API call
        try {
          const response = await journalEntriesByPeriod({
            start_date: startDate.toISOString().split('T')[0], // Convert to 'YYYY-MM-DD'
            end_date: endDate.toISOString().split('T')[0],
          })
          setJournals(response)
          console.log(response)
        
        } catch (error) {
          console.error(error)
        }
      }
    }

    fetchData()
  }, [startDate, endDate]) // Re-run when startDate or endDate changes


  return (
    <SafeAreaView className="bg-optimistic-gray-10 h-full p-4 space-y-4">
      <BackButton buttonStyle="mb-4" />
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="font-urbanist-extra-bold text-mindful-brown-80 text-4xl mb-1">
            {title}
          </Text>
          <Text className="font-urbanist-light text-mindful-brown-80 text-xl">
            {startDate && endDate
              ? `Selected Range: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
              : subtitle}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleOnPress}
          className="w-16 h-16 rounded-full bg-empathy-orange-40 flex items-center justify-center -mt-4"
        >
          <MaterialCommunityIcons
            name="calendar-month-outline"
            size={30}
            color="white"
          />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded-lg w-80 p-4 shadow-lg">
            <Calendar
              style={{
                borderWidth: 1,
                borderColor: 'gray',
                height: 350,
                borderRadius: 10,
                overflow: 'hidden',
              }}
              current={today.toISOString().split('T')[0]}
              onDayPress={handleDayPress}
              markingType={'period'}
              markedDates={getMarkedDates()}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="mt-4 p-2 bg-empathy-orange-40 rounded-md flex items-center justify-center"
            >
              <Text className="text-white font-bold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
          yAxisMaxValue={maxValue}
          stepValue={stepValue}
          noOfSections={noOfSections}
          yAxisLabelTexts={Array.from({ length: noOfSections + 1 }, (_, i) =>
            (i * stepValue).toString()
          ).concat(maxValue.toString())}
          showValuesOnTopOfBars={false}
          renderLabelOnTop={(barData) => (
            <Text className="text-white font-bold text-center">
              {barData.value}
            </Text>
          )}
        />
      </View>

      <CustomButton
        title="See All Journal Entries"
        handlePress={() => router.push('/(journal)/journal-history')}
        buttonStyle="w-full"
      />
      
    </SafeAreaView>
  )
}

export default JournalStats
