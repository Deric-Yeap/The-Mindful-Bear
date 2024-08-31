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

const UpdateForm = ({ route }) => {
  const { id } = route.params; // Extract id from route params
  const [loading, setLoading] = useState(false); // Initialize loading state
  const [forms, setForms] = useState([]); // Initialize forms state
  const [error, setError] = useState(null); // Initialize error state

  const [request, setRequest] = useState({
    scale_name: '',
    form_names: ['', '', '', '', ''],
  });
  
  const [errors, setErrors] = useState({}); // Initialize errors as an empty object

  // useEffect(() => {
  //   const fetchForms = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await axiosInstance.get(`/option_set/get/${id}`); // Corrected API call
  //       console.log('Full response:', response);

  //       // Check if response.data is an array
  //       if (Array.isArray(response.data)) {
  //         setForms(response.data);
  //         console.log('Forms state updated:', response.data);
  //         // Populate request with fetched data
  //         if (response.data.length > 0) {
  //           setRequest({
  //             scale_name: response.data[0].scale_name || '', // Assuming scale_name is part of the fetched data
  //             form_names: response.data.map(form => form.form_name || ''), // Adjust based on actual data structure
  //           });
  //         }
  //       } else {
  //         console.warn('Expected an array but got:', response.data);
  //         setForms([]);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //       if (error.response) {
  //         console.error('Response data:', error.response.data);
  //         setError(error.response.data);
  //       } else if (error.request) {
  //         console.error('Request made but no response received:', error.request);
  //         setError('No response received from the server.');
  //       } else {
  //         console.error('Error setting up the request:', error.message);
  //         setError(error.message);
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchForms(); // Call the fetch function
  // }, [id]); // Dependency array includes id to refetch when it changes

  const handleChange = (index, value) => {
    if (index === 0) {
      const newValue = value.trim() === '' ? '' : value.replace('Liker Scale - ', '');
      setRequest((prev) => ({
        ...prev,
        scale_name: newValue,
      }));
    } else {
      const updatedFormNames = [...request.form_names];
      updatedFormNames[index - 1] = value; // Update the value at the specific index (index - 1 for form_names)
      setRequest((prev) => ({
        ...prev,
        form_names: updatedFormNames,
      }));
    }
    setErrors((prev) => ({ ...prev, [`form_name_${index}`]: '' })); // Clear any existing error for the specific input
  };

  if (loading) {
    return <Text>Loading...</Text>; // Show loading state
  }

  if (error) {
    return <Text style={{ color: 'red' }}>{error}</Text>; // Show error message
  }

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
        {errors.form_name_0 && (
          <Text style={{ color: 'red', marginLeft: 16 }}>
            {errors.form_name_0}
          </Text>
        )}

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
              {errors[`form_name_${index + 1}`] && (
                <Text style={{ color: 'red', marginLeft: 16 }}>
                  {errors[`form_name_${index + 1}`]}
                </Text>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default UpdateForm;