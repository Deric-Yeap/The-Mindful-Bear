import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SelectList } from 'react-native-dropdown-select-list'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

const Dropdown = ({
  title,
  data,
  placeHolder,
  handleSelect,
  iconName,
  customStyles,
  dropdownShown,
  notFoundText,
  errorMessage,
  selectedValue,
  ...props
}) => {
  const [selected, setSelected] = useState(selectedValue || "");  

  return (
    <View className={`space-y-2 ${customStyles}`}>
      <Text className=" text-mindful-brown-80 font-urbanist-extra-bold text-lg">
        {title}
      </Text>
      <View>
        <SelectList
          setSelected={(value) => {
            setSelected(value);
            handleSelect(value); 
          }}
          data={data}
          placeholder={placeHolder}
          save="key"
          boxStyles={{ borderRadius: 100 }}
          dropdownStyles={{ borderRadius: 20 }}
          dropdownShown={dropdownShown}
          notFoundText={notFoundText}
          defaultOption={
            data.find((opt) => opt.key === selectedValue) || null
          }
        />
      </View>
      {errorMessage && (
        <View className="border border-present-red-50 bg-present-red-10 w-full h-16 px-4 rounded-full items-center flex-row">
          <MaterialCommunityIcons
            name="alert-outline"
            size={24}
            className="bg-mindful-brown-80"
          />
          <Text className="text-mindful-brown-80 font-urbanist-extra-bold px-2">
            {errorMessage}
          </Text>
        </View>
      )}
    </View>
  )
}

export default Dropdown
