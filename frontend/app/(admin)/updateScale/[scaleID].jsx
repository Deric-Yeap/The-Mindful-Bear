import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../../components/formField'
import BrownPageTitlePortion from '../../../components/brownPageTitlePortion'
import StatusBarComponent from '../../../components/darkThemStatusBar'
import axiosInstance from '../../../common/axiosInstance'
import { useLocalSearchParams } from 'expo-router'
import CustomButton from '../../../components/customButton'
import { colors } from '../../../common/styles'
import Loading from '../../../components/loading'
import ConfirmModal from '../../../components/confirmModal' // Ensure this component exists
import { confirmModal } from '../../../assets/image'

const UpdateScale = () => {
  const { scaleID } = useLocalSearchParams()

  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState([])
  const [error, setError] = useState(null)
  const [description, setDescription] = useState({ description: '' })
  const [errors, setErrors] = useState({ description: '', options: [] })
  const [hasChanges, setHasChanges] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [isNoChangesModalOpen, setIsNoChangesModalOpen] = useState(false)
  const [isDeleteConfirmationModalOpen, setDeleteConfirmationModalOpen] =
    useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [previousDescription, setPreviousDescription] = useState('')
  const [previousOptions, setPreviousOptions] = useState([])

  const handleInputChange = (id, value) => {
    const newOptions = options.map((option) => {
      if (option.id === id) {
        return { ...option, description: value }
      }
      return option
    })

    setOptions(newOptions)
    setErrors((prev) => ({
      ...prev,
      options: prev.options.map((err, index) => (index === id ? '' : err)),
    }))
    setHasChanges(true)
  }

  const validateForm = () => {
    let valid = true
    const newErrors = { description: '', options: [] }

    if (!description.description.trim()) {
      newErrors.description = 'Scale name cannot be empty.'
      valid = false
    }

    options.forEach((option, index) => {
      if (!option.description.trim()) {
        newErrors.options[index] = `Option ${option.value} cannot be empty.`
        valid = false
      } else {
        newErrors.options[index] = ''
      }
    })

    setErrors(newErrors)
    return valid
  }

  const handleSave = async () => {
    if (!validateForm()) {
      return
    }

    if (!hasChanges) {
      setIsNoChangesModalOpen(true)
      return
    }

    setLoading(true)
    try {
      if (previousDescription !== description.description) {
        const url = `/option_set/update/${scaleID}/`
        console.log(
          `Updating scale ID: ${scaleID} with new description: ${description.description}`
        )
        await axiosInstance.put(url, {
          description: description.description,
        })
      }

      await Promise.all(
        options.map(async (option) => {
          const previousOption = previousOptions.find(
            (prev) => prev.id === option.id
          )
          if (
            previousOption &&
            previousOption.description !== option.description
          ) {
            const url = `/option/update/${option.id}/`
            console.log(
              `Updating option ID: ${option.id} with new value: ${option.description}`
            )
            return await axiosInstance.put(url, {
              description: option.description,
              value: option.value,
              OptionSetID: option.OptionSetID,
            })
          }
        })
      )

      setSuccessMessage('Options updated successfully!')
      setIsSuccessModalOpen(true)

      setPreviousDescription(description.description)
      setPreviousOptions(options)
      setHasChanges(false)
    } catch (error) {
      console.error('Error saving options:', error)
      setError('Error saving options. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const deleteScale = () => {
    setDeleteConfirmationModalOpen(true)
  }

  const confirmDeleteScale = async () => {
    try {
      const url = `/option_set/delete/${scaleID}/`
      const response = await axiosInstance.delete(url)
      if (response.status === 204) {
        setOptions([])
        setDescription({ description: '' })
        setSuccessMessage('Scale deleted successfully!')
        setIsSuccessModalOpen(true)
      } else {
        setError('Error: Unexpected response from server.')
      }
    } catch (error) {
      console.error('Error deleting scale:', error)
      setError('Error deleting scale. Please try again.')
    } finally {
      setDeleteConfirmationModalOpen(false)
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
        const response = await axiosInstance.get(url)
        setDescription({ description: response.description || '' })
        setPreviousDescription(response.description || '')
      } catch (error) {
        console.error('Error fetching forms:', error)
        setError('Error fetching forms. Please try again.')
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
        const response = await axiosInstance.get(url)
        setOptions(response)
        setPreviousOptions(response)
      } catch (error) {
        console.error('Error fetching options:', error)
        setError('Error fetching options. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchOptions()
  }, [scaleID])

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
        <View className="mx-4">
          <FormField
            title="Scale Name"
            iconName="form-select"
            value={`Likert Scale - ${trimmedDescription}`}
            handleChange={(value) => {
              setDescription({ description: value })
              setErrors((prev) => ({ ...prev, description: '' }))
              setHasChanges(true)
            }}
            customStyles={`mb-1 ${errors.description ? 'border-red-500' : ''}`}
            editable={true}
          />
          {errors.description && (
            <Text style={{ color: 'red', marginLeft: 16 }}>
              {errors.description}
            </Text>
          )}
        </View>

        <View className="mx-4 mt-4">
          {options
            .slice()
            .sort((a, b) => a.value - b.value)
            .map((option, index) => {
              const hasError = !!errors.options[index]
              return (
                <View key={option.id} className="mb-4">
                  <View className="flex-row items-center">
                    <Text className="text-mindful-brown-80 font-bold text-lg mr-2">
                      {option.value}
                    </Text>
                    <FormField
                      value={option.description}
                      handleChange={(value) =>
                        handleInputChange(option.id, value)
                      }
                      customStyles={`mb-1 m-4 w-1/2 ${hasError ? 'border-red-500' : ''}`}
                      editable={true}
                    />
                  </View>
                  {hasError && (
                    <Text style={{ color: 'red', marginLeft: '10%' }}>
                      {errors.options[index]}
                    </Text>
                  )}
                </View>
              )
            })}
        </View>

        <CustomButton
          title="Save"
          handlePress={handleSave}
          buttonStyle="mx-4"
          loading={loading}
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

      {isNoChangesModalOpen && (
        <ConfirmModal
          isConfirmButton={true}
          isCancelButton={false}
          imageSource={confirmModal}
          confirmButtonTitle={'OK'}
          title={'No Changes'}
          subTitle={'There are no changes to save.'}
          handleConfirm={() => {
            setIsNoChangesModalOpen(false)
          }}
        />
      )}

      {isSuccessModalOpen && (
        <ConfirmModal
          isConfirmButton={true}
          isCancelButton={false}
          imageSource={confirmModal}
          confirmButtonTitle={'Exit'}
          title={'Success'}
          subTitle={successMessage}
          handleConfirm={() => {
            setIsSuccessModalOpen(false)
          }}
        />
      )}

      {isDeleteConfirmationModalOpen && (
        <ConfirmModal
          isCancelButton={true}
          isConfirmButton={true}
          imageSource={confirmModal}
          confirmButtonTitle={'Confirm'}
          cancelButtonTitle={'Cancel'}
          title={'Confirm Delete'}
          subTitle={'Are you sure you want to delete this scale?'}
          handleCancel={() => {
            setDeleteConfirmationModalOpen(false)
          }}
          handleConfirm={confirmDeleteScale}
        />
      )}
    </SafeAreaView>
  )
}

export default UpdateScale
