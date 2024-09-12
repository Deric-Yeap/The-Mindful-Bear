import { View, Text, TextInput } from 'react-native';
import React from 'react';

const TextBox = ({
  title,
  value,
  handleChange,
  placeHolder,
  customStyles,
  errorMessage,
  ...props
}) => {
  return (
    <View className={`space-y-2 ${customStyles}`}>
      {title && (
        <Text className="text-mindful-brown-80 font-urbanist-extra-bold text-lg">
          {title}
        </Text>
      )}

      <View className="border-2 border-optimistic-gray-20 focus:border-serenity-green-50 w-full h-32 px-4 rounded-xl">
        <TextInput
          className="flex-1 text-optimistic-gray-80 font-urbanist-semi-bold"
          value={value}
          placeholder={placeHolder}
          placeholderTextColor="optimistic-gray-50"
          onChangeText={handleChange}
          multiline
          {...props}
        />
      </View>

      {errorMessage && (
        <View className="border border-present-red-50 bg-present-red-10 w-full h-16 px-4 rounded-full items-center flex-row">
          <MaterialCommunityIcons
            name="alert-outline"
            size={24}
            color="mindful-brown-80"
          />
          <Text className="text-mindful-brown-80 font-urbanist-extra-bold px-2">
            {errorMessage}
          </Text>
        </View>
      )}
    </View>
  );
};

export default TextBox;