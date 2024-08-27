import React from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { View, TextInput, TouchableOpacity } from 'react-native';
import {colors} from '../common/styles';
const SearchBar = ()  => {
    return (
        <View className="flex-row items-center bg-optimistic-gray-10 rounded-full mt-4">
          <TextInput
            placeholder="Search anything..."
            placeholderTextColor={colors.optimisticGray60}
            className="flex-1 font-urbanist-bold text-optimistic-gray-60 mx-4"
          />
          <TouchableOpacity className="ml-2 p-3 rounded-full">
            <MaterialIcons name="search" size={24} color={colors.mindfulBrown80} />
          </TouchableOpacity>
        </View>
    );
};

export default SearchBar;
