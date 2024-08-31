import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import FormField from '../../components/formField'
import Dropdown from '../../components/dropdown'
import BrownPageTitlePortion from '../../components/brownPageTitlePortion'
import StatusBarComponent from '../../components/darkThemStatusBar'
import CustomButton from '../../components/customButton'
import { CreateFormAndQuestion } from '../../api/form'
import { listOptionSet } from '../../api/option-set'

const CreateForm = () => {
    const [request, setRequest] = useState({ form_names: ['', '', '', '', ''] });
    const [errors, setErrors] = useState({}); // Initialize errors as an empty object
  
    const handleChange = (index, value) => {
      const updatedFormNames = [...request.form_names];
      updatedFormNames[index] = value;
      setRequest({ ...request, form_names: updatedFormNames });
      setErrors((prev) => ({ ...prev, [`form_name_${index}`]: '' })); // Clear error on change
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
          value={request.form_names[0]} // Assuming the first input is for Scale Name
          handleChange={(value) => handleChange(0, value)} // Use index 0 for Scale Name
          customStyles="mb-4 m-4"
        />
        {errors.form_name_0 ? (
          <Text style={{ color: 'red', marginLeft: 16 }}>
            {errors.form_name_0}
          </Text>
        ) : null}

        {/* Column of Numbers with Text Boxes for 0 to 4 */}
        <View className="mx-4 mt-4">
          {Array.from({ length: 5 }, (_, index) => (
            <View key={index} className="flex-row items-center mb-2">
              <Text className="text-mindful-brown-80 font-bold text-lg mr-2">
                {index}
              </Text>
              <FormField
                value={request.form_names[index]} // Access the specific index
                handleChange={(value) => handleChange(index, value)} // Pass index and value
                customStyles="mb-4 m-4 w-1/2"
              />
              {errors[`form_name_${index}`] ? ( // Check if the error exists
                <Text style={{ color: 'red', marginLeft: 16 }}>
                  {errors[`form_name_${index}`]}
                </Text>
              ) : null}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default CreateForm
