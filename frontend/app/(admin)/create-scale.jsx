import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import FormField from '../../components/formField';
import BrownPageTitlePortion from '../../components/brownPageTitlePortion';
import StatusBarComponent from '../../components/darkThemStatusBar';

const CreateForm = () => {
  const [request, setRequest] = useState({
    scale_name: '', // Store the scale name separately
    form_names: ['', '', '', '', ''], // Initialize an array for the form names
  });
  const [errors, setErrors] = useState({}); // Initialize errors as an empty object

  const handleChange = (index, value) => {
    if (index === 0) {
      // For the scale name input
      if (value.trim() === '') {
        // If the input is empty, reset the scale_name
        setRequest((prev) => ({
          ...prev,
          scale_name: '', // Clear the scale name
        }));
      } else {
        // Store the input without the prefix for internal state
        const newValue = value.replace('Liker Scale - ', ''); // Remove prefix for internal state
        setRequest((prev) => ({
          ...prev,
          scale_name: newValue, // Store only the user input
        }));
      }
    } else {
      // Update the specific form name
      const updatedFormNames = [...request.form_names];
      updatedFormNames[index - 1] = value; // Update the value at the specific index (index - 1 for form_names)
      setRequest((prev) => ({
        ...prev,
        form_names: updatedFormNames,
      }));
    }
    // Clear any existing error for the specific input
    setErrors((prev) => ({ ...prev, [`form_name_${index}`]: '' }));
  };

  return (
    <SafeAreaView className="flex-1 bg-optimistic-gray-10">
      <StatusBarComponent barStyle="light-content" backgroundColor="#251404" />
      <BrownPageTitlePortion title="Form Management" />
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Scale Name Field */}
        <FormField
          title="Scale Name"
          iconName="form-select"
          value={`Liker Scale - ${request.scale_name}`} // Display the scale name with prefix
          handleChange={(value) => handleChange(0, value)} // Pass index 0 for Scale Name
          customStyles="mb-4 m-4"
          editable={true} // Allow editing the scale name
        />
        {errors.form_name_0 ? (
          <Text style={{ color: 'red', marginLeft: 16 }}>
            {errors.form_name_0}
          </Text>
        ) : null}

        {/* Column of Numbers with Text Boxes for 1 to 5 */}
        <View className="mx-4 mt-4">
          {request.form_names.map((formName, index) => (
            <View key={index} className="flex-row items-center mb-2">
              <Text className="text-mindful-brown-80 font-bold text-lg mr-2">
                {index + 1} {/* Display index starting from 1 */}
              </Text>
              <FormField
                value={formName} // Use the specific index
                handleChange={(value) => handleChange(index + 1, value)} // Pass index + 1 for form names
                customStyles="mb-4 m-4 w-1/2"
                editable={true} // Allow editing the form names
              />
              {errors[`form_name_${index + 1}`] ? ( // Display error for the specific input
                <Text style={{ color: 'red', marginLeft: 16 }}>
                  {errors[`form_name_${index + 1}`]}
                </Text>
              ) : null}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default CreateForm;