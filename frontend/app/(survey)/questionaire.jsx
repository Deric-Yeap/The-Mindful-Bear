import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import { getForms } from '../../api/form'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useSelector } from 'react-redux'
import { setIsShownNav } from '../../redux/slices/isShownNavSlice'

const Questionaire = () => {
  const {    
    isRedirectedForms,
    selectedLandmarkData,
    sessionID,
    sessionStarted,      
    start,
    completedForms: initialCompletedForms,    
  } = useLocalSearchParams()  
  const isShownNav = useSelector((state) => state.isShownNav).isShownNav
  const [forms, setForms] = useState([])
  const [completedForms, setCompletedForms] = useState(() => {
    try {
      return initialCompletedForms ? JSON.parse(initialCompletedForms) : []
    } catch (error) {
      console.error('Failed to parse initialCompletedForms:', error)
      return []
    }
  })
  const [showError, setShowError] = useState(false)
  const [startPressed, setStartPressed] = useState(false)
  const router = useRouter()
  const images = [
    require('../../../frontend/assets/young-man-practicing-yoga-exercises-mental-body-health.png'),
    require('../../../frontend/assets/self-care-health-concept.png'),
  ]
  let filteredForms

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getForms()
        if (start === 'true') {
          filteredForms = response.filter((form) => form.is_presession)
        } else {
          filteredForms = response.filter((form) => form.is_postsession)
        }

        setForms(filteredForms)
      } catch (error) {
        console.error('Error fetching form data:', error)
      }
    }

    fetchData()
  }, [])

  const handleFormComplete = (formId) => {
    setCompletedForms((prevCompletedForms) => {
      const updatedCompletedForms = [...prevCompletedForms, formId]
      return updatedCompletedForms
    })
  }

  const navigateToForm = (formId) => {
    const updatedCompletedForms = [...completedForms, formId]

    router.push({
      pathname: `/questions/${formId}`,
      params: {        
        isRedirectedForms: isRedirectedForms,
        selectedLandmarkData: selectedLandmarkData, 
        sessionID: sessionID,
        sessionStarted: sessionStarted,        
        start: start,
        completedForms: JSON.stringify(updatedCompletedForms),        
      },
    })
  }

  const handleStart = () => {
    setStartPressed(true)
    const uncompletedCompulsoryForms = forms.filter(
      (form) => form.is_compulsory && !completedForms.includes(form.id)
    )
    if (uncompletedCompulsoryForms.length === 0) {
      if (start === 'true') {
        if (!isShownNav) {
          dispatch(setIsShownNav())
        }
        router.push({
          pathname: '/map',
          params: {            
            isRedirectedForms: isRedirectedForms,
            selectedLandmarkData: selectedLandmarkData, 
            sessionID: sessionID,
            sessionStarted: true,            
          },
        })
      } else {
        router.push('/home')
      }
    } else {
      setShowError(true)
    }
  }

  return (
    <ScrollView className="flex-1 bg-optimistic-gray-10">
      <View className="flex-1 p-6 bg-optimistic-gray-10">
        {/* Title */}
        <Text className="text-center text-2xl font-urbanist-bold text-mindful-brown-90">
          {start === 'true' ? 'Before We Begin...' : 'Before We End...'}
        </Text>
        {/* Subtitle */}
        <Text className="text-center text-lg font-urbanist-bold text-optimistic-gray-80 mt-4 mb-8">
          We will be assessing your mood based on the following questionnaires.
        </Text>

        <View className="space-y-4">
          {forms.map((form, index) => {
            const isCompleted = completedForms.includes(form.id)
            const isCompulsory = form.is_compulsory
            const isUncompletedCompulsory =
              isCompulsory && !isCompleted && startPressed

            return (
              <TouchableOpacity
                key={form.id}
                className={`relative p-2 rounded-3xl flex-row items-start justify-between h-48 ${
                  isCompleted
                    ? 'border-2 border-green-500 bg-green-100'
                    : isUncompletedCompulsory
                      ? 'border-2 border-red-500'
                      : 'bg-white'
                }`}
                onPress={() => {
                  handleFormComplete(form.id)
                  navigateToForm(form.id)
                }}
                disabled={isCompleted}
                style={{ overflow: 'hidden' }}
              >
                {/* Background Image */}
                <Image
                  source={images[index % 2]}
                  className="absolute right-0 w-48 h-48"
                  style={{
                    opacity: 0.8,
                  }}
                  resizeMode="contain"
                />

                {/* Text Content */}
                <View className="flex-1">
                  <Text className="text-xl font-urbanist-bold text-mindful-brown-100 ml-4 mt-4">
                    {form.form_name} {isCompulsory ? '' : '(Optional)'}
                  </Text>
                </View>
              </TouchableOpacity>
            )
          })}
        </View>

        {/* Notification for uncompleted compulsory forms */}
        {showError && (
          <Text className="text-red-500 text-center mt-4">
            Please complete all required forms
          </Text>
        )}

        {/* Start Button */}
        <TouchableOpacity
          className="mt-8 bg-mindful-brown-80 py-4 rounded-full items-center"
          onPress={handleStart}
        >
          <Text className="text-white text-lg font-urbanist-bold">
            {start === 'true' ? 'Start →' : 'End →'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default Questionaire
