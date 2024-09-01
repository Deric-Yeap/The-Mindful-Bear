import React from 'react';
import { View, Text, TextInput } from 'react-native';

const LandmarkForm = () => {
  return (
    <View className="px-4 mt-6 w-full text-base font-bold tracking-normal">
      {/* Landmark Name Section */}
      <View className="flex-row justify-start w-full">
        <Text className="self-start text-mindful-brown-80 text-base font-bold">Landmark Name</Text>
      </View>
      <TextInput
        className="mt-2 px-4 py-3 text-black rounded-3xl bg-zinc-300 w-[95%] "
        placeholder="Landmark 2"
      />

      {/* Coordinate Section */}
      <View className="flex-row gap-3.5 items-start mt-8 w-full justify-center">
        {/* Coordinate-x */}
        <View className="flex flex-col w-[45%]">
          <Text className="self-start text-mindful-brown-80 text-base font-bold">Coordinate-x</Text>
          <TextInput
            className="mt-4 text-black rounded-3xl bg-zinc-300 px-4 pt-2.5 pb-2.5 h-[41px]"
            placeholder="1.273"
          />
        </View>

        {/* Coordinate-y */}
        <View className="flex flex-col w-[45%]">
          <Text className="self-start text-mindful-brown-80 text-base font-bold">Coordinate-y</Text>
          <TextInput
            className="mt-4 text-black rounded-3xl bg-zinc-300 px-4 pt-2.5 pb-2.5 h-[41px]"
            placeholder="1.273"
          />
        </View>
      </View>
    </View>
  );
};

export default LandmarkForm;
