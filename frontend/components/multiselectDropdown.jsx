import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SelectList } from 'react-native-dropdown-select-list';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const MultiselectDropdown = ({
  title,
  data,
  placeHolder,
  handleSelect,
  iconName,
  customStyles,
  dropdownShown,
  notFoundText,
  errorMessage,
  ...props
}) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleSelection = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems((prevItems) =>
        prevItems.filter((selectedItem) => selectedItem !== item)
      );
    } else {
      setSelectedItems((prevItems) => [...prevItems, item]);
    }
    handleSelect(selectedItems);
  };

  return (
    <View className={`space-y-2 ${customStyles}`}>
      <Text className="text-mindful-brown-80 font-urbanist-extra-bold text-lg">
        {title}
      </Text>
      <View>
        <SelectList
          setSelected={toggleSelection}
          data={data}
          placeholder={placeHolder}
          save="key"
          boxStyles={{ borderRadius: 100 }}
          dropdownStyles={{ borderRadius: 20 }}
          dropdownShown={dropdownShown}
          notFoundText={notFoundText}          
        />
      </View>
      {selectedItems.length > 0 && (
        <ScrollView horizontal className="flex-row mt-2">
          {selectedItems.map((item, index) => (
            <View
              key={index}
              className="bg-mindful-brown-10 border border-mindful-brown-50 rounded-full px-3 py-1 mr-2"
            >
              <Text className="text-mindful-brown-80">{item}</Text>
            </View>
          ))}
        </ScrollView>
      )}
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
  );
};

export default MultiselectDropdown;
