import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { useEffect, useState } from 'react'
import { Audio } from 'expo-av'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import CustomButton from '../../components/customButton'
import { audioUpload, speechToText } from '../../api/journal'
import TextBox from '../../components/textBox'
import { colors } from '../../common/styles'
import { listEmotion } from '../../api/emotion'
import Loading from '../../components/loading'
import ConfirmModal from '../../components/confirmModal'
import BackButton from '../../components/backButton'

const VoiceJournal = () => {
  const [recording, setRecording] = useState()
  const [isRecording, setIsRecording] = useState(false)
  const [permissionResponse, requestPermission] = Audio.usePermissions()
  const [currentStep, setCurrentStep] = useState(1)

  const [isLoading, setIsLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [transcribedText, setTranscribedText] = useState('')
  const [emotions, setEmotions] = useState([])
  const [selectedEmotion, setSelectedEmotion] = useState(1)
  const [selectedFeelings, setSelectedFeelings] = useState([])

  async function startRecording() {
    try {
      if (permissionResponse.status !== 'granted') {
        await requestPermission()
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })
      setIsRecording(true)
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      )
      setRecording(recording)
    } catch (err) {
      console.error('Failed to start recording', err)
    }
  }

  async function stopRecording() {
    await recording.stopAndUnloadAsync()
    setIsRecording(false)
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    })
    const uri = recording.getURI()
    await playRecording(uri)
    handleSpeechToText()
  }

  const playRecording = async (uri) => {
    const { sound } = await Audio.Sound.createAsync({ uri })
    await sound.playAsync()
  }

  const handleSpeechToText = async () => {
    const formData = new FormData()
    formData.append('audio_file', {
      uri: recording.getURI(),
      name: 'audio.m4a',
      type: 'audio/m4a',
    })
    try {
      const response = await speechToText(formData)
      setTranscribedText(response.transcription)
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    const formData = new FormData()
    formData.append('audio_file', {
      uri: recording.getURI(),
      name: 'audio.m4a',
      type: 'audio/m4a',
    })
    formData.append('journal_text', transcribedText)
    formData.append('title', title)
    formData.append('emotion_id', selectedEmotion)
    selectedFeelings.forEach((feeling) => {
      formData.append('emotion_id', feeling)
    })
    try {
      const response = await audioUpload(formData)
      setIsLoading(false)
      setIsModalVisible(true)
    } catch (error) {
      console.error(error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const emotionResponse = await listEmotion()
        setEmotions(emotionResponse)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  // form parts
  const renderStep1 = () => (
    <View className="items-center justify-center h-full space-y-10">
      <Text className="font-urbanist-extra-bold  text-mindful-brown-80 text-4xl text-center flex-wrap w-[90vw] pb-10">
        What would you name your journal?
      </Text>
      <TextInput
        value={title}
        onChangeText={(value) => setTitle(value)}
        placeholder="Enter your journal name"
        placeholderTextColor={colors.empathyOrange40}
        className="font-urbanist-bold text-xl text-empathy-orange-40 w-[80vw] text-center"
      />
      <View className="self-end">
        <CustomButton
          iconName={'arrow-right'}
          handlePress={() => {
            if (title) handleNext()
          }}
          buttonStyle={`rounded-full w-[15vw] h-[15vw] bg-mindful-brown-80 self-end mt-2`}
          iconSize={35}
          isLoading={!title}
        />
      </View>
    </View>
  )

  const renderStep2 = () => (
    <View className="items-center">
      <View className="h-[80vh] p-4 pt-10 justify-center items">
        <Text className="font-urbanist-extra-bold text-mindful-brown-80 text-4xl text-center flex-wrap w-[80vw] pb-10">
          Say anything that's on your mind!
        </Text>
        <View>
          <TextBox
            value={transcribedText}
            handleChange={(value) => setTranscribedText(value)}
            placeHolder="Speak into the microphone!"
          />
          <View className="flex-row justify-between mt-4">
            <CustomButton
              iconName={'arrow-u-left-bottom'}
              handlePress={() => handleBack()}
              buttonStyle={`rounded-full w-[15vw] h-[15vw] bg-mindful-brown-80`}
              iconSize={35}
            />
            <CustomButton
              iconName={'arrow-right'}
              handlePress={() => {
                if (transcribedText) handleNext()
              }}
              buttonStyle={`rounded-full w-[15vw] h-[15vw] bg-mindful-brown-80 `}
              iconSize={35}
              isLoading={!transcribedText}
            />
          </View>
        </View>
      </View>
      <View className="bg-serenity-green-30 p-4 h-full items-center -mt-1 rounded-t-full w-[250vw]">
        <CustomButton
          iconName={isRecording ? 'stop' : 'microphone'}
          handlePress={isRecording ? stopRecording : startRecording}
          buttonStyle={`rounded-full w-[25vw] h-[25vw] -mt-20 shadow-lg`}
          iconSize={35}
        />
      </View>
    </View>
  )

  const renderStep3 = () => (
    <View className="px-4">
      <CustomButton
        iconName={'arrow-u-left-bottom'}
        handlePress={() => handleBack()}
        buttonStyle={`rounded-full w-[15vw] h-[15vw] bg-mindful-brown-80`}
        iconSize={35}
      />
      <Text className="font-urbanist-extra-bold text-mindful-brown-80 text-4xl text-center flex-wrap w-[80vw] pb-5 pt-16">
        Select your emotions!
      </Text>
      {emotions.length > 0 && (
        <View className="space-y-4 my-2">
          <View>
            <Text className="font-urbanist-bold text-lg">
              Select your emotion
            </Text>
            <View className="flex flex-wrap flex-row">
              {emotions
                .filter((emotion) => emotion.level === 'Inner')
                .map((emotion) => (
                  <TouchableOpacity
                    key={emotion.id}
                    className="flex-row items-center bg-white rounded-full px-3 py-2 m-1 space-x-3 flex-grow-0 flex-shrink"
                    onPress={() => {
                      setSelectedEmotion(emotion.id)
                      setSelectedFeelings([])
                    }}
                  >
                    <Text className="font-urbanist-semi-bold text-mindful-brown-80">
                      {emotion.name}
                    </Text>
                    <View
                      className={`h-4 w-4 rounded-full border border-black mr-2 ${
                        selectedEmotion === emotion.id
                          ? 'bg-mindful-brown-80'
                          : 'bg-white'
                      }`}
                    />
                  </TouchableOpacity>
                ))}
            </View>
          </View>

          <View>
            <Text className="font-urbanist-bold text-lg">
              Select associated feelings
            </Text>
            <View className="flex flex-wrap flex-row">
              {emotions
                .filter((emotion) => emotion.parentID === selectedEmotion)
                .map((emotion) => (
                  <TouchableOpacity
                    key={emotion.id}
                    className="flex-row items-center bg-white rounded-full px-3 py-2 m-1 space-x-3 flex-grow-0 flex-shrink"
                    onPress={() => {
                      setSelectedFeelings((prev) => {
                        if (prev.includes(emotion.id)) {
                          return prev.filter((id) => id !== emotion.id)
                        } else {
                          return [...prev, emotion.id]
                        }
                      })
                    }}
                  >
                    <Text className="font-urbanist-semi-bold text-mindful-brown-80">
                      {emotion.name}
                    </Text>
                    <View
                      className={`h-4 w-4 rounded-md border border-black mr-2 ${
                        selectedFeelings.includes(emotion.id)
                          ? 'bg-mindful-brown-80'
                          : 'bg-white'
                      }`}
                    />
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        </View>
      )}
      <CustomButton
        title="Create Journal"
        buttonStyle="mb-4 mt-2"
        handlePress={() => handleSubmit()}
      />
    </View>
  )

  const handleNext = () => {
    if (currentStep + 1 <= 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep - 1 >= 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1()
      case 2:
        return renderStep2()
      case 3:
        return renderStep3()
      default:
        return null
    }
  }

  return (
    <SafeAreaView className="bg-mindful-brown-10 h-full items-center">
      {currentStep === 1 && <BackButton buttonStyle="mx-4 self-start" />}
      {isLoading && (
        <View className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center z-10 bg-optimistic-gray-80/90">
          <Loading />
        </View>
      )}
      {isModalVisible && (
        <ConfirmModal
          title="Journal Created!"
          subTitle={`You’ve completed your journal entry. Congratulations!`}
          confirmButtonTitle="Ok, Thanks!"
          isConfirmButton={true}
          handleConfirm={() => {
            setIsModalVisible(false)
            router.push('/journal-home')
          }}
        />
      )}
      {renderCurrentStep()}
    </SafeAreaView>
  )
}

export default VoiceJournal
