import React, { useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '../../common/styles'
import FormField from '../../components/formField'
import BrownPageTitlePortion from '../../components/brownPageTitlePortion'
import StatusBarComponent from '../../components/darkThemStatusBar'
import axiosInstance from '../../common/axiosInstance'
import CustomButton from '../../components/customButton'

const CreateScale = () => {
  const [loading, setLoading] = useState(false) // Initialize loading state
  const [error, setError] = useState(null) // Initialize error state

  const [request, setRequest] = useState({
    scale_name: '',
    form_names: ['', '', '', '', ''],
  })

  const [errors, setErrors] = useState({})

  const handleChange = (index, value) => {
    if (index === 0) {
      const newValue =
        value.trim() === '' ? '' : value.replace('Likert Scale - ', '')
      setRequest((prev) => ({
        ...prev,
        scale_name: newValue,
      }))
    } else {
      const updatedFormNames = [...request.form_names]
      updatedFormNames[index - 1] = value
      setRequest((prev) => ({
        ...prev,
        form_names: updatedFormNames,
      }))
    }
    setErrors((prev) => ({ ...prev, [`form_name_${index}`]: '' }))
  }

  const handleSave = async () => {
    setLoading(true)
    setError(null) // Reset error state

    try {
      // Step 1: Create the option set
      const optionSetData = {
        description: `Likert Scale - ${request.scale_name}`,
      }

      const optionSetResponse = await axiosInstance.post(
        '/option_set/create/',
        optionSetData
      )
      const optionSetId = optionSetResponse.id
      console.log('optionSetResponse', optionSetResponse)
      // Step 2: Create options for each form name
      const optionPromises = request.form_names.map(async (formName, index) => {
        if (formName.trim() !== '') {
          const optionData = {
            description: formName,
            OptionSetID: optionSetId, // Pass the optionSetId directly
            value: index,
          }

          const optionResponse = await axiosInstance.post(
            `/option/create/${optionSetId}/`,
            optionData
          )
          console.log(
            `Option created for form name "${formName}":`,
            optionResponse.data
          )
        }
      })

      await Promise.all(optionPromises)

      // Optionally, you can reset the form or navigate to another screen after successful creation
      // Resetting the form
      setRequest({
        scale_name: '',
        form_names: ['', '', '', '', ''],
      })
    } catch (error) {
      console.error('Error creating options or option set:', error)
      if (error.response) {
        setError(
          error.response.data || 'Failed to create options or option set.'
        )
      } else {
        setError('An unexpected error occurred.')
      }
    } finally {
      setLoading(false)
    }
  }
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
                {index}
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
          handlePress={handleSave} // Attach the handleSave function to the button
          buttonStyle="mx-4"
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default CreateScale
