import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

const FormField = ({
  title,
  value,
  handleChange,
  placeHolder,
  iconName,
  customStyles,
  errorMessage,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <View className={`space-y-2 ${customStyles}`}>
      <Text className=" text-mindful-brown-80 font-urbanist-extra-bold text-lg">
        {title}
      </Text>
      <View className="border-2 border-optimistic-gray-20 w-full h-16 px-4 rounded-full focus:border-serenity-green-50 items-center flex-row">
        <MaterialCommunityIcons
          name={iconName}
          size={24}
          className="bg-mindful-brown-80"
        />
        <TextInput
          className="flex-1 text-optimistic-gray-80 font-urbanist-semi-bold"
          value={value}
          placeholder={placeHolder}
          placeholderTextColor="optimistic-gray-50"
          onChangeText={handleChange}
          secureTextEntry={
            title.toLowerCase().includes('password') && !showPassword
          }
        />

        {title.toLowerCase().includes('password') && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <MaterialCommunityIcons
              name={showPassword ? 'eye-off' : 'eye'}
              size={24}
            />
          </TouchableOpacity>
        )}
      </View>
      {errorMessage &&(
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

export default FormField
