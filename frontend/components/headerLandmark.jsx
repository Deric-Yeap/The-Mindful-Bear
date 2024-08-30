import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import BackButton from './backButton';

const HeaderLandmark = () => {
  return (
    <View className="flex relative flex-col pb-2 w-full aspect-[1.011]">
      <Image
        source={{ uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/4b116fb504bae4e96910a8019ffd8338d6215db8183025d8130d5d03956a6e90?apiKey=004e7e3501424a9a9c0fe2fe31f6ca4a&" }}
        className="object-cover absolute inset-0 w-full h-full"
      />
      <View className="flex relative flex-col overflow-hidden mx-auto bg-mindful-brown-80 h-[135px] w-[110%] rounded-[32px] shadow-[0px_16px_32px_rgba(254,129,75,0.15)]">
        <View className="flex flex-col w-[131px]">
          <View className="flex w-full min-h-[57px]" />
    
        </View>
      </View>
      <View className="absolute top-0 left-0 right-0 p-4 flex-row items-center justify-between">
        <BackButton title="Landmark Management" />
      </View>
      <View className="absolute bottom-0 left-0 w-full p-4 flex-row items-center justify-start">
        <View className="px-3.5 py-1  tracking-normal rounded-3xl bg-mindful-brown-80">
          <Text className="text-white text-base font-bold">Upload Image</Text>
        </View>
      </View>
    </View>
  );
};

export default HeaderLandmark;
