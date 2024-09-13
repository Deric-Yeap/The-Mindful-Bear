import React, { useState, useEffect } from 'react';
import {View, Text, TouchableOpacity, FlatList, ActivityIndicator,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBrownSearchBar from '../../components/topBrownSearchBar';
import StatusBarComponent from '../../components/darkThemStatusBar';
import Toggle from '../../components/toggle';
import { Link } from 'expo-router';
import { router } from 'expo-router';
import axiosInstance from '../../common/axiosInstance';
import { colors } from '../../common/styles';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon
import Loading from '../../components/loading'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const Forms = () => {
  const [loading, setLoading] = useState(true); // Loading state // Loading state
  const [error, setError] = useState(null); // Error state // Error state
  const [forms, setForms] = useState([]); // State to hold fetched forms // State to hold fetched forms
  const [likertOptions, setLikertOptions] = useState([]); // State to hold fetched Likert options
  const [selectedOption, setSelectedOption] = useState(1); // State to handle toggle selection

  const onSelectSwitch = (index) => {
    setSelectedOption(index);
    AsyncStorage.setItem('selectedOption', index.toString()); // Save the selected option
  };

  useEffect(() => {
    const loadSelectedOption = async () => {
      const savedOption = await AsyncStorage.getItem('selectedOption');
      if (savedOption !== null) {
        setSelectedOption(Number(savedOption)); // Load saved option
      } else {
        setSelectedOption(1); // Default to 1 if no saved option
      }
    };
  
    loadSelectedOption(); // Load the selected option when component mounts
    

    const fetchForms = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const response = await axiosInstance.get('form/get'); // Use axiosInstance
        console.log('Full response:', response); // Log the full response

        // Directly set forms from the response if it's an array
        if (Array.isArray(response)) {
          setForms(response); // Set the fetched data to state
          console.log('Forms state updated:', response); // Log the updated forms state
        } else {
          console.warn('Expected an array but got:', response);
          setForms([]); // Set to empty array if not an array
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          setError(error.response.data); // Set error if fetching fails
        } else if (error.request) {
          console.error('Request made but no response received:', error.request);
          setError('No response received from the server.');
        } else {
          console.error('Error setting up the request:', error.message);
          setError(error.message);
        }
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
    const fetchLikertOptions = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const response = await axiosInstance.get('option_set/get'); // Fetch Likert options
        console.log('Likert options response:', response); // Log the full response
    
        // Check if the response is an array
        if (Array.isArray(response)) {
          // Map the response to the desired format
          const options = response.map(item => ({
            key: item.id, // Use 'id' as the key
            value: item.description // Use 'description' as the value
          }));
          setLikertOptions(options); // Set the fetched Likert options to state
          console.log('Likert options state updated:', options); // Log the updated state
        } else {
          console.warn('Expected an array but got:', response.data);
          setLikertOptions([]); // Set to empty array if not an array
        }
      } catch (error) {
        console.error('Error fetching Likert options:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
        }
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
    if (selectedOption === 1) {
      fetchForms(); // Fetch forms only if Forms is selected
    } else if (selectedOption === 2) {
      fetchLikertOptions(); // Fetch Likert options if Likert-Scales is selected
    }
  }, [selectedOption]); // Fetch data when selectedOption changes

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.optimisticGray10 }}>
        <Loading /> 
      </View>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-optimistic-gray-10 justify-center items-center">
        <Text>Error fetching data: {error}</Text>
      </SafeAreaView>
    );
  }

  const handleFormPress = (form) => {
    console.log(`Navigating to update form:`, form);
    router.push({
      pathname: '/updateform',
      params: { formId: form.id },
    });
  };

  // Log the forms state before rendering
  console.log('Forms to render:', forms);
  console.log('Likert options to render:', likertOptions);

  return (
    <SafeAreaView className="flex-1 bg-optimistic-gray-10">
      <StatusBarComponent barStyle="light-content" backgroundColor={colors.mindfulBrown100}/>
      <TopBrownSearchBar title="Form Management" />
      <View style={{ alignItems: 'center', margin: 20 }}>
        <Toggle
          selectionMode={selectedOption}
          roundCorner={true}
          option1={'Forms'}
          option2={'Likert-Scales'}
          onSelectSwitch={onSelectSwitch}
          selectionColor={colors.mindfulBrown80}
        />
      </View>
      <View className="flex-row justify-between items-center pt-4 pb-0 px-4">
        <Text className="text-mindful-brown-80 font-bold text-3xl">
          {selectedOption === 1 ? 'Forms' : 'Likert-Scales'}
        </Text>
        {selectedOption === 1 && (
          <Link href="/create-form" asChild>
            <TouchableOpacity className="bg-mindful-brown-80 px-4 py-1 rounded-full">
              <Text className="text-white font-bold text-base">Create Form</Text>
            </TouchableOpacity>
          </Link>
        )}
        {selectedOption === 2 && (
          <Link href="/create-scale" asChild>
            <TouchableOpacity className="bg-mindful-brown-80 px-4 py-1 rounded-full">
              <Text className="text-white font-bold text-base">Create Scale</Text>
            </TouchableOpacity>
          </Link>
        )}
      </View>

      {selectedOption === 1 ? (
        forms.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-mindful-brown-80 font-bold text-lg">
              No forms available
            </Text>
          </View>
        ) : (
          <FlatList
            data={forms}
            renderItem={({ item }) => (
              //<Link href={`/updateform/${item.id}`} asChild>
                <TouchableOpacity  className="w-full h-auto p-4 items-center bg-[#9BB167] shadow-lg mt-6 rounded-[15px] flex-row justify-between"
                onPress={() => handleFormPress(item)}>
                  <View style={{ flex: 1 }}>
                    <Text className="text-mindful-brown-10 font-bold text-lg">
                      {item.form_name}
                    </Text>
                    <Text className="text-mindful-brown-10 text-md font-bold">
                      {item.store_responses
                        ? 'Store User Response'
                        : "Don't Store Response"}
                    </Text>
                  </View>
                  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Icon name="chevron-right" size={20} color={colors.mindfulBrown10} /> 
                  </View>
                </TouchableOpacity>
              //</Link>
            )}
            keyExtractor={(item) => item.id.toString()} // Ensure unique key extraction
            contentContainerStyle={{ paddingHorizontal: 16 }}
          />
        )
      ) : (
        likertOptions.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-mindful-brown-80 font-bold text-lg">
              No Likert options available
            </Text>
          </View>
        ) : (
          <FlatList
          data={likertOptions.filter(item => item.value.startsWith("Likert Scale"))} 
          renderItem={({ item }) => (
            <Link href={`/updateScale/${item.key}`} asChild>
              <TouchableOpacity className="w-full h-auto p-4 items-center bg-[#9BB167] shadow-lg mt-6 rounded-[15px] flex-row justify-between">
                <View style={{ flex: 1 }}>
                  <Text className="text-mindful-brown-10 font-bold text-lg">
                    {item.value}
                  </Text>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Icon name="chevron-right" size={20} color={colors.mindfulBrown10} /> 
                </View>
              </TouchableOpacity>
            </Link>
          )}
          keyExtractor={(item) => item.key.toString()} 
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
        )
      )}
    </SafeAreaView>
  );
};

export default Forms;