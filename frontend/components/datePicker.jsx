import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Platform } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

const DatePicker = ({ title, customStyles, onDateChange, ...props }) => {
  const [date, setDate] = useState(new Date())
  const [show, setShow] = useState(false)

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date
    setShow(Platform.OS === 'ios')
    setDate(currentDate)
    onDateChange(currentDate) //give parent
  }

  return (
    <View className={`space-y-2 ${customStyles}`}>
      <Text className="text-mindful-brown-80 font-urbanist-extra-bold text-lg">
        {title}
      </Text>
      <TouchableOpacity
        className="flex-row items-center border border-black rounded-full p-2"
        onPress={() => setShow(true)}
      >
        <MaterialCommunityIcons name="calendar" size={24} color="black" />
        <Text className="ml-2">{date.toDateString()}</Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  )
}

export default DatePicker
