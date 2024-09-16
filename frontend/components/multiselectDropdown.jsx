import { View, Text, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SelectList } from 'react-native-dropdown-select-list';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const MultiselectDropdown = ({
  title,
  data,
  placeHolder,
  handleSelect,
  selectedItems = [],
  disabled = false, // Add a disabled prop
  customStyles,
  dropdownShown,
  notFoundText,
  errorMessage,
  ...props
}) => {
  const [internalSelectedItems, setInternalSelectedItems] = useState(selectedItems);

  useEffect(() => {
    setInternalSelectedItems(selectedItems);
  }, [selectedItems]);

  const toggleSelection = (item) => {
    if (!disabled) { // Prevent selection if disabled
      const newSelectedItems = internalSelectedItems.includes(item)
        ? internalSelectedItems.filter((selectedItem) => selectedItem !== item)
        : [...internalSelectedItems, item];

      setInternalSelectedItems(newSelectedItems);
      handleSelect(newSelectedItems);
    }
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
          save="value"
          boxStyles={{ borderRadius: 100 }}
          dropdownStyles={{ borderRadius: 20 }}
          dropdownShown={dropdownShown}
          notFoundText={notFoundText}
          disabled={disabled} // Apply the disabled prop to SelectList
        />
      </View>
      {internalSelectedItems.length > 0 && (
        <ScrollView horizontal className="flex-row mt-2">
          {internalSelectedItems.map((item, index) => (
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
