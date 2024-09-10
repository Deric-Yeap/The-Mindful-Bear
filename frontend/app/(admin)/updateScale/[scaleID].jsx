import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../../components/formField';
import BrownPageTitlePortion from '../../../components/brownPageTitlePortion';
import StatusBarComponent from '../../../components/darkThemStatusBar';
import axiosInstance from '../../../common/axiosInstance';
import { useLocalSearchParams } from 'expo-router';
import CustomButton from '../../../components/customButton';
import { colors } from '../../../common/styles';
import Loading from '../../../components/loading';

const UpdateScale = () => {
  const { scaleID } = useLocalSearchParams();

  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [error, setError] = useState(null);
  const [description, setDescription] = useState({ description: '' });

  // Store previous values for comparison
  const [previousDescription, setPreviousDescription] = useState('');
  const [previousOptions, setPreviousOptions] = useState([]);

  const handleInputChange = (id, value) => {
    const newOptions = options.map((option) => {
      if (option.id === id) {
        return { ...option, description: value };
      }
      return option;
    });

    setOptions(newOptions);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Check if the description has changed
      if (previousDescription !== description.description) {
        const url = `/option_set/update/${scaleID}/`; // Update the scale name
        console.log(`Updating scale ID: ${scaleID} with new description: ${description.description}`);
        await axiosInstance.put(url, {
          description: description.description,
        });
      }

      await Promise.all(
        options.map(async (option) => {
          // Check if the value has changed
          const previousOption = previousOptions.find(prev => prev.id === option.id);
          if (previousOption && previousOption.description !== option.description) {
            const url = `/option/update/${option.id}/`;
            console.log(`Updating option ID: ${option.id} with new value: ${option.description}`);
            return await axiosInstance.put(url, {
              description: option.description,
              value: option.value,
              OptionSetID: option.OptionSetID,
            });
          }
        })
      );

      Alert.alert('Success', 'Options updated successfully');
      // Update previous values after saving
      setPreviousDescription(description.description);
      setPreviousOptions(options);
    } catch (error) {
      console.error('Error saving options:', error);
      setError('Error saving options. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteScale = async () => {
    if (!scaleID) {
      console.warn('scaleID is undefined. Cannot delete scale.');
      return;
    }

    try {
      const url = `/option_set/delete/${scaleID}/`;
      const response = await axiosInstance.delete(url);
      if (response.status === 204) {
        Alert.alert('Success', 'Scale deleted successfully');
        setOptions([]);
        setDescription({ description: '' });
      } else {
        setError('Error: Unexpected response from server.');
      }
    } catch (error) {
      console.error('Error deleting scale:', error);
      setError('Error deleting scale. Please try again.');
    }
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
        const response = await axiosInstance.get(url);
        setDescription({ description: response.description || '' });
        setPreviousDescription(response.description || ''); // Initialize previous description
      } catch (error) {
        console.error('Error fetching forms:', error);
        setError('Error fetching forms. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, [scaleID]);

  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      if (!scaleID) {
        console.warn('scaleID is undefined. Cannot fetch options.');
        setLoading(false);
        return;
      }

      try {
        const url = `/option/getOptions/${scaleID}`;
        const response = await axiosInstance.get(url);
        setOptions(response);
        setPreviousOptions(response); // Initialize previous options
      } catch (error) {
        console.error('Error fetching options:', error);
        setError('Error fetching options. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [scaleID]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.optimisticGray10,
        }}
      >
        <Loading />
      </View>
    );
  }

  const trimmedDescription = description.description.slice(15);

  return (
    <SafeAreaView className="flex-1 bg-optimistic-gray-10">
      <StatusBarComponent
        barStyle="light-content"
        backgroundColor={colors.mindfulBrown100}
      />
      <BrownPageTitlePortion title="Form Management" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <FormField
            title="Scale Name"
            iconName="form-select"
            value={`Likert Scale - ${trimmedDescription}`}
            handleChange={(value) => {
              setDescription({ description: value }); // Update description directly
            }}
            customStyles="mb-4 m-4"
            editable={true}
            multiline={true} // Enable multiline for Scale Name
          />

          <View className="mx-4">
            {options
              .slice()
              .sort((a, b) => a.value - b.value)
              .map((option) => (
                <View
                  key={option.id} // Use unique ID as key
                  className="flex-row items-center mt-0"
                >
                  <Text className="text-mindful-brown-80 font-bold text-lg mr-2">
                    {option.value}
                  </Text>
                  <FormField
                    value={option.description}
                    handleChange={(value) => handleInputChange(option.id, value)}
                    customStyles="mb-4 m-4 w-1/2"
                    editable={true}
                    multiline={true} // Enable multiline for option descriptions
                  />
                </View>
              ))}
          </View>
          {/* Save Button */}
          <CustomButton
            title="Save"
            handlePress={handleSave}
            buttonStyle="mx-4"
          />
          <CustomButton
            title="Delete"
            handlePress={deleteScale}
            buttonStyle="mx-4 mt-2"
          />
          {error && (
            <Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>
              {error}
            </Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UpdateScale;