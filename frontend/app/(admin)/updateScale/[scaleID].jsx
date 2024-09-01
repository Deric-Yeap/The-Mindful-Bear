import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, Button } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../../components/formField'
import BrownPageTitlePortion from '../../../components/brownPageTitlePortion'
import StatusBarComponent from '../../../components/darkThemStatusBar'
import axiosInstance from '../../../common/axiosInstance'
import { useLocalSearchParams } from 'expo-router'
import CustomButton from '../../../components/customButton';

const UpdateScale = () => {
  const { scaleID } = useLocalSearchParams()

  const [loading, setLoading] = useState(false)
  const [forms, setForms] = useState([])
  const [error, setError] = useState(null)
  const [description, setDescription] = useState({
    description: '',
  })
  const [request, setRequest] = useState({
    scale_name: '',
    form_names: ['', '', '', '', ''],
  })
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    // Your submission logic here
    console.log('Form submitted');
  };
  useEffect(() => {
    const fetchForms = async () => {
      setLoading(true);
      if (!scaleID) {
        console.warn('scaleID is undefined. Cannot fetch forms.');
        setLoading(false);
        return;
      }
  
      try {
        const url = `/option_set/get/${scaleID}`;
        console.log('Fetching from URL:', url);
        const response = await axiosInstance.get(url);
        console.log('Full Axios response:', response); // Log the entire Axios response
        console.log('Response description:', response.description); // Log just the data
        setDescription({description: response.description || '',});
      } finally {
        setLoading(false);
      }
    };
  
    fetchForms();
  }, [scaleID]);

  return (
    <SafeAreaView className="flex-1 bg-optimistic-gray-10">
      <StatusBarComponent barStyle="light-content" backgroundColor="#251404" />
      <BrownPageTitlePortion title="Form Management" />
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <FormField
          title="Scale Name"
          iconName="form-select"
          value={description.description} // Bind the description state
          handleChange={(value) =>
            setDescription({ ...request, description: value }) // Update description in state
          }
          customStyles="mb-4 m-4"
          editable={true}
        />
       {/* <View className="mx-4 mt-4">
          {request.form_names.map((formName, index) => (
            <View key={index} className="flex-row items-center mb-2">
              <Text className="text-mindful-brown-80 font-bold text-lg mr-2">
                {index + 1}
              </Text>
              <FormField
                value={formName }
                handleChange={(value) => handleInputChange(index, value)}
                customStyles="mb-4 m-4 w-1/2"
                editable={true}
              />
            </View>
          ))}
        </View> */}

         {/* Save Button */}
         <CustomButton
          title="Save"
          // handlePress={handleSave}
          buttonStyle="mx-4"
        />
        {error && (
          <Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>
            {error}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default UpdateScale
