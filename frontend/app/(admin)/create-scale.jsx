import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import FormField from '../../components/formField';
import BrownPageTitlePortion from '../../components/brownPageTitlePortion';
import StatusBarComponent from '../../components/darkThemStatusBar';
import axiosInstance from '../../common/axiosInstance';
import CustomButton from '../../components/customButton';

const CreateForm = () => {
  const [loading, setLoading] = useState(false); // Initialize loading state
  const [forms, setForms] = useState([]); // Initialize forms state
  const [error, setError] = useState(null); // Initialize error state

  const [request, setRequest] = useState({
    scale_name: '',
    form_names: ['', '', '', '', ''],
  });
  
  const [errors, setErrors] = useState({});

//   useEffect(() => {
//     const fetchForms = async () => {
//       setLoading(true);
//       try {
//         const response = await axiosInstance.get(`/option_set/get/`);
//         console.log('Full response:', response);

//         // Check if response.data is an array
//         if (Array.isArray(response.data)) {
//           setForms(response.data);
//           console.log('Forms state updated:', response.data);
//         } else {
//           console.warn('Expected an array but got:', response.data);
//           setForms([]);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         if (error.response) {
//           console.error('Response data:', error.response.data);
//           setError(error.response.data);
//         } else if (error.request) {
//           console.error('Request made but no response received:', error.request);
//           setError('No response received from the server.');
//         } else {
//           console.error('Error setting up the request:', error.message);
//           setError(error.message);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchForms(); // Call the fetch function
//   }, []); // Empty dependency array to run once on mount

  const handleChange = (index, value) => {
    if (index === 0) {
      const newValue = value.trim() === '' ? '' : value.replace('Likert Scale - ', '');
      setRequest((prev) => ({
        ...prev,
        scale_name: newValue,
      }));
    } else {
      const updatedFormNames = [...request.form_names];
      updatedFormNames[index - 1] = value;
      setRequest((prev) => ({
        ...prev,
        form_names: updatedFormNames,
      }));
    }
    setErrors((prev) => ({ ...prev, [`form_name_${index}`]: '' }));
  };

  return (
    <SafeAreaView className="flex-1 bg-optimistic-gray-10">
      <StatusBarComponent barStyle="light-content" backgroundColor="#251404" />
      <BrownPageTitlePortion title="Form Management" />
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <FormField
          title="Scale Name"
          iconName="form-select"
          value={`Likert Scale - ${request.scale_name}`}
          handleChange={(value) => handleChange(0, value)}
          customStyles="mb-4 m-4"
          editable={true}
        />
        {errors.form_name_0 && (
          <Text style={{ color: 'red', marginLeft: 16 }}>
            {errors.form_name_0}
          </Text>
        )}

        <View className="mx-4 mt-4">
          {request.form_names.map((formName, index) => (
            <View key={index} className="flex-row items-center mb-2">
              <Text className="text-mindful-brown-80 font-bold text-lg mr-2">
                {index + 1}
              </Text>
              <FormField
                value={formName}
                handleChange={(value) => handleChange(index + 1, value)}
                customStyles="mb-4 m-4 w-1/2"
                editable={true}
              />
              {errors[`form_name_${index + 1}`] && (
                <Text style={{ color: 'red', marginLeft: 16 }}>
                  {errors[`form_name_${index + 1}`]}
                </Text>
              )}
            </View>
          ))}
        </View>
        <CustomButton
          title="Save"
        //   handlePress={handleSave}
          buttonStyle="mx-4"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

export default CreateForm;