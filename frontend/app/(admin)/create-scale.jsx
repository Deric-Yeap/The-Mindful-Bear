import React, { useState } from 'react'
import { View, Text, ScrollView, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '../../common/styles'
import FormField from '../../components/formField'
import BrownPageTitlePortion from '../../components/brownPageTitlePortion'
import StatusBarComponent from '../../components/darkThemStatusBar'
import axiosInstance from '../../common/axiosInstance'
import CustomButton from '../../components/customButton'

const CreateScale = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [request, setRequest] = useState({
    scale_name: '',
    form_names: ['', '', '', '', ''],
  })

  const [errors, setErrors] = useState({})

  const handleChange = (index, value) => {
    if (index === 0) {
      const newValue = value.trim() === '' ? '' : value.replace('Likert Scale - ', '')
      setRequest((prev) => ({
        ...prev,
        scale_name: newValue,
      }))
      setErrors((prev) => ({ ...prev, scale_name: '' }))
    } else {
      const updatedFormNames = [...request.form_names]
      updatedFormNames[index - 1] = value
      setRequest((prev) => ({
        ...prev,
        form_names: updatedFormNames,
      }))
      setErrors((prev) => ({ ...prev, [`form_name_${index}`]: '' }))
    }
  }

  const validateForm = () => {
    let valid = true
    const newErrors = {
      scale_name: '',
      form_names: [],
    }

    if (!request.scale_name.trim()) {
      newErrors.scale_name = 'Please input scale name'
      valid = false
    }

    request.form_names.forEach((formName, index) => {
      if (formName.trim() === '') {
        newErrors[`form_name_${index + 1}`] = `Please input value for scale option ${index + 1}`
        valid = false
      }
    })

    setErrors(newErrors)
    return valid
  }

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill out all required fields.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const optionSetData = {
        description: `Likert Scale - ${request.scale_name}`,
      }

      const optionSetResponse = await axiosInstance.post('/option_set/create/', optionSetData)
      const optionSetId = optionSetResponse.id

      const optionPromises = request.form_names.map(async (formName, index) => {
        if (formName.trim() !== '') {
          const optionData = {
            description: formName,
            OptionSetID: optionSetId,
            value: index,
          }

          await axiosInstance.post(`/option/create/${optionSetId}/`, optionData)
        }
      })

      await Promise.all(optionPromises)

      setRequest({
        scale_name: '',
        form_names: ['', '', '', '', ''],
      })
      Alert.alert('Success', 'Scale created successfully!')
    } catch (error) {
      console.error('Error creating options or option set:', error)
      if (error.response) {
        setError(error.response.data || 'Failed to create options or option set.')
        Alert.alert('Error', error.response.data || 'Failed to create scale.')
      } else {
        setError('An unexpected error occurred.')
        Alert.alert('Error', 'An unexpected error occurred. Please try again later.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-optimistic-gray-10">
      <StatusBarComponent barStyle="light-content" backgroundColor={colors.mindfulBrown100} />
      <BrownPageTitlePortion title="Scale Management" />
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="mx-4">
          <FormField
            title="Scale Name"
            iconName="form-select"
            value={`Likert Scale - ${request.scale_name}`}
            handleChange={(value) => handleChange(0, value)}
            customStyles={`mb-1 ${errors.scale_name ? 'border-red-500' : ''}`} // Ensure red border on error
            editable={true}
          />
          {errors.scale_name && (
            <Text style={{ color: 'red', marginLeft: 16 }}>
              {errors.scale_name}
            </Text>
          )}
        </View>

        <View className="mx-4 mt-4">
          {request.form_names.map((formName, index) => {
            const hasError = !!errors[`form_name_${index + 1}`];
            return (
              <View key={index} className="mb-4">
                <View className="flex-row items-center">
                  <Text className="text-mindful-brown-80 font-bold text-lg mr-2">
                    {index}
                  </Text>
                  <FormField
                    value={formName}
                    handleChange={(value) => handleChange(index + 1, value)}
                    customStyles={`mb-1 m-4 w-1/2 ${hasError ? 'border-red-500' : ''}`} // Ensure red border on error
                    editable={true}
                  />
                </View>
                {hasError && (
                  <Text style={{ color: 'red', marginLeft: '10%' }}>
                    {errors[`form_name_${index + 1}`]}
                  </Text>
                )}
              </View>
            );
          })}
        </View>

        <CustomButton
          title="Save"
          handlePress={handleSave}
          buttonStyle="mx-4"
          loading={loading}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default CreateScale