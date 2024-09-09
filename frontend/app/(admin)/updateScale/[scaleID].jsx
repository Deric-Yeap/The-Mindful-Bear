import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../../components/formField'
import BrownPageTitlePortion from '../../../components/brownPageTitlePortion'
import StatusBarComponent from '../../../components/darkThemStatusBar'
import axiosInstance from '../../../common/axiosInstance'
import { useLocalSearchParams } from 'expo-router'
import CustomButton from '../../../components/customButton'
import { colors } from '../../../common/styles'
import Loading from '../../../components/loading'

const UpdateScale = () => {
  const { scaleID } = useLocalSearchParams()

  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState([])
  const [error, setError] = useState(null)
  const [description, setDescription] = useState({ description: '' })
  const [optionSetID, setOptionSetID] = useState(null)

  const handleInputChange = (id, value) => {
    const newOptions = options.map((option) => {
      if (option.id === id) {
        return { ...option, description: value }
      }
      return option
    })

    setOptions(newOptions)
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await Promise.all(
        options.map(async (option) => {
          const url = `/option/update/${option.id}/`
          return await axiosInstance.put(url, {
            description: option.description,
            value: option.value,
            OptionSetID: optionSetID,
          })
        })
      )
      Alert.alert('Success', 'Options updated successfully')
    } catch (error) {
      console.error('Error saving options:', error)
      setError('Error saving options')
    } finally {
      setLoading(false)
    }
  }

  const deleteScale = async () => {
    if (!scaleID) {
      console.warn('scaleID is undefined. Cannot delete scale.')
      return
    }

    try {
      const url = `/option_set/delete/${scaleID}/`
      const response = await axiosInstance.delete(url)
      console.log('Delete response:', response)

      if (response.status === 204) {
        Alert.alert('Success', 'Scale deleted successfully')
        setOptions([])
        setDescription({ description: '' })
      } else {
        setError('Error: Unexpected response from server.')
      }
    } catch (error) {
      console.error('Error deleting scale:', error)
      setError('Error deleting scale')
    }
  }

  useEffect(() => {
    const fetchForms = async () => {
      setLoading(true)
      if (!scaleID) {
        console.warn('scaleID is undefined. Cannot fetch forms.')
        setLoading(false)
        return
      }

      try {
        const url = `/option_set/get/${scaleID}`
        console.log('Fetching from URL:', url)
        const response = await axiosInstance.get(url)
        console.log('Full Axios response:', response)
        setDescription({ description: response.description || '' })
      } finally {
        setLoading(false)
      }
    }

    fetchForms()
  }, [scaleID])

  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true)

      if (!scaleID) {
        console.warn('scaleID is undefined. Cannot fetch options.')
        setLoading(false)
        return
      }

      try {
        const url = `/option/getOptions/${scaleID}`
        console.log('Fetching from URL:', url)
        const response = await axiosInstance.get(url)
        console.log('Full Axios response:', response)
        setOptions(response)
        setOptionSetID(response.OptionSetID)
      } catch (error) {
        console.error('Error fetching options:', error)
        setError('Error fetching options')
      } finally {
        setLoading(false)
      }
    }

    fetchOptions()
  }, [scaleID])

  // Use the custom Loading component
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
    )
  }

  const trimmedDescription = description.description.slice(15)
  return (
    <SafeAreaView className="flex-1 bg-optimistic-gray-10">
      <StatusBarComponent
        barStyle="light-content"
        backgroundColor={colors.mindfulBrown100}
      />
      <BrownPageTitlePortion title="Form Management" />
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <FormField
          title="Scale Name"
          iconName="form-select"
          value={`Likert Scale - ${trimmedDescription}`}
          handleChange={(value) =>
            setDescription({ ...description, description: value })
          }
          customStyles="mb-4 m-4"
          editable={true}
        />

        <View className="mx-4">
          {options
            .slice()
            .sort((a, b) => a.value - b.value)
            .map((option, index) => (
              <View
                key={`${option.id}-${option.description}-${index}`} // Concatenate multiple properties
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
    </SafeAreaView>
  )
}

export default UpdateScale
