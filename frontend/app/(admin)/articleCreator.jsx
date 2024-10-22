import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/formField'
import BrownPageTitlePortion from '../../components/brownPageTitlePortion'
import StatusBarComponent from '../../components/darkThemStatusBar'
import CustomButton from '../../components/customButton'
import {
  createExercise,
  updateExercise,
  deleteExercise,
} from '../../api/exercise'
import { getLandmarks } from '../../api/landmark'
import ConfirmModal from '../../components/confirmModal'
import { confirmModal } from '../../assets/image'
import { useRoute } from '@react-navigation/native'
import { useRouter } from 'expo-router'
import * as DocumentPicker from 'expo-document-picker'
import MultiselectDropdown from '../../components/multiselectDropdown'

const ArticleCreator = () => {
  const route = useRoute()
  const router = useRouter()
  var { exercise } = route.params || {}

  if (exercise) {
    try {
      exercise = JSON.parse(exercise)
    } catch (error) {
      console.error('Error parsing exercise:', error)
      exercise = null
    }
  }

  const [articleName, setArticleName] = useState(exercise?.exercise_name || '')
  const [content, setDescription] = useState(exercise?.content || '')
  const [audioFile, setAudioFile] = useState(
    exercise
      ? {
          uri: exercise.file_url,
          name: exercise.audio_url?.split('/').pop(),
          type: `audio/${exercise.audio_url?.split('.').pop()}`,
        }
      : {}
  )
  const [landmarkList, setLandmarkList] = useState([])
  const [selectedLandmarks, setSelectedLandmarks] = useState([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [allLandmarksAssigned, setAllLandmarksAssigned] = useState(false)
  const [modalMessage, setModalMessage] = useState('')

  useEffect(() => {
    const fetchLandmarks = async () => {
      try {
        const data = await getLandmarks()
        const formattedData = data.map((item) => ({
          key: item.landmark_id,
          value: item.landmark_name,
          exercise_id: item.exercise?.exercise_id,
        }))

        const availableLandmarks = formattedData.filter(
          (item) =>
            !item.exercise_id ||
            (exercise && exercise.landmarks.includes(item.key))
        )

        setLandmarkList(availableLandmarks)
        setAllLandmarksAssigned(availableLandmarks.length === 0)

        if (exercise?.landmarks) {
          const selected = availableLandmarks
            .filter((item) => exercise.landmarks.includes(item.key))
            .map((item) => item.value)

          setSelectedLandmarks(selected)
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchLandmarks()
  }, [])

  const handleSubmit = async () => {
    if (!articleName || !content || !audioFile?.uri) {
      Alert.alert('Please fill in all fields and upload an audio file.')
      return
    }

    const landmarkKeys = selectedLandmarks
      .map((name) => {
        const landmark = landmarkList.find((item) => item.value === name)
        return landmark ? landmark.key : null
      })
      .filter((key) => key !== null)

    const exerciseData = {
      exercise_name: articleName,
      content: content,
      audio_file: audioFile,
      landmarks: landmarkKeys,
    }

    try {
      if (exercise) {
        await updateExercise(exercise.exercise_id, exerciseData)
        setModalMessage('updated')
        setShowSuccess(true)
      } else {
        await createExercise(exerciseData)
        setModalMessage('created')
        setShowSuccess(true)
        resetForm()
      }
    } catch (error) {
      console.error(error)
      Alert.alert(
        `Error ${exercise ? 'updating' : 'creating'} exercise:`,
        error.message
      )
    }
  }

  const handleDelete = async () => {
    try {
      await deleteExercise(exercise.exercise_id)
      setModalMessage('deleted')
      setShowSuccess(true)
    } catch (error) {
      console.error('Error deleting exercise:', error)
    }
  }

  const resetForm = () => {
    setArticleName('')
    setDescription('')
    setAudioFile({})
    setSelectedLandmarks([])
  }

  const truncateFileName = (fileName) => {
    if (!fileName) return 'No Audio File'
    const maxLength = 20
    return fileName.length > maxLength
      ? `${fileName.substring(0, maxLength)}...`
      : fileName
  }

  const handlePDFUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedFile = result.assets[0]

        setAudioFile({
          uri: selectedFile.uri,
          name: selectedFile.name,
          type: selectedFile.mimeType,
        })
      } else {
        console.error('Server returned an error:', result.error)
      }
    } catch (error) {
      console.error('Error picking audio file:', error)
    }
  }

  const handleConfirm = () => {
    setShowSuccess(false)
    if (exercise || modalMessage === 'deleted') {
      router.push('/exercisemanagement')
    }
  }

  const handleLandmarkSelect = (newSelectedItems) => {
    setSelectedLandmarks(newSelectedItems)
  }

  return (
    <SafeAreaView className="flex-1 bg-optimistic-gray-10">
      <StatusBarComponent barStyle="light-content" backgroundColor="#251404" />
      <BrownPageTitlePortion title="Article Management" />
      <ScrollView className="pb-20 mt-4">
        <FormField
          title="Article Title"
          iconName="form-select"
          value={articleName}
          handleChange={setArticleName}
          customStyles="m-4"
        />
        <FormField
          title="Content"
          iconName="text-box-outline"
          value={content}
          handleChange={setDescription}
          customStyles="m-4"
        />
        <FormField
          title="Topic"
          iconName="text-box-outline"
          value={content}
          customStyles="m-4"
        />
        <FormField
          title="Image Address"
          iconName="text-box-outline"
          value={content}
          customStyles="m-4"
        />
        <View className="flex-row items-center mb-4 px-4 justify-between w-full">
          <Text className="text-xl font-bold">or</Text>
          <TouchableOpacity
            className="bg-serenity-green-50 rounded-full py-2 px-4 ml-4 shadow-lg"
            onPress={handlePDFUpload}
          >
            <Text className="text-white text-lg">Upload Article Image</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-xl font-bold">Article Image</Text>
        <TouchableOpacity
          className="bg-serenity-green-50 rounded-full min-h-[50px] flex flex-row justify-center items-center"
          onPress={handlePDFUpload}
        >
          <Text className="text-white text-lg">Upload PDF</Text>
        </TouchableOpacity>
        <View className="mb-4 px-4 w-full mt-5">
          <CustomButton
            className="mt-2 w-full"
            handlePress={handleSubmit}
            title={'Create Article'}
          />
        </View>
      </ScrollView>
      {showSuccess && (
        <ConfirmModal
          isConfirmButton={true}
          isCancelButton={false}
          imageSource={confirmModal}
          confirmButtonTitle={'Confirm'}
          title={'Success!'}
          subTitle={`Exercise ${modalMessage} successfully.`}
          handleConfirm={handleConfirm}
        />
      )}
    </SafeAreaView>
  )
}

export default ArticleCreator
