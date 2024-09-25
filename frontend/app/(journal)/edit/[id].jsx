import { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams } from 'expo-router'
import { router } from 'expo-router'

import { journalEntryById, editJournal } from '../../../api/journal'
import { listEmotion } from '../../../api/emotion'
import Loading from '../../../components/loading'
import BackButton from '../../../components/backButton'
import CustomButton from '../../../components/customButton'
import ConfirmModal from '../../../components/confirmModal'
import FormField from '../../../components/formField'
import TextBox from '../../../components/textBox'
import emotionWheelImg from '../../../assets/emotionWheel.jpg'

const JournalDetail = () => {
  const { id } = useLocalSearchParams()
  const [form, setForm] = useState({
    title: '',
    journal_text: '',
    emotion_id: [],
  })
  const [journal, setJournal] = useState(null)
  const [isEmotionModalVisible, setIsEmotionModalVisible] = useState(false)
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false)
  const [emotions, setEmotions] = useState([])
  const [selectedEmotion, setSelectedEmotion] = useState(1)
  const [selectedFeelings, setSelectedFeelings] = useState([])
  const [errorMessages, setErrorMessages] = useState({
    title: '',
    journal_text: '',
    feelings: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await journalEntryById(id)
        const emotionResponse = await listEmotion()
        setEmotions(emotionResponse)
        setJournal(response)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [id])

  useEffect(() => {
    if (journal) {
      setForm({
        title: journal.title,
        journal_text: journal.journal_text,
      })
      const userEmotionList = journal.emotion_id
      setSelectedEmotion(
        userEmotionList.find((emotion) => emotion.level === 'Inner').id
      )
      setSelectedFeelings(
        userEmotionList
          .filter((emotion) => emotion.level != 'Inner')
          .map((emotion) => emotion.id)
      )
    }
  }, [journal])

  const validateForm = () => {
    let isValid = true
    const newErrorMessages = {
      title: '',
      journal_text: '',
      feelings: '',
    }

    if (!form.title) {
      newErrorMessages.title = 'Title cannot be empty'
      isValid = false
    }

    if (!form.journal_text) {
      newErrorMessages.journal_text = 'Text cannot be empty'
      isValid = false
    }

    if (selectedFeelings.length === 0) {
      newErrorMessages.feelings = 'Please select at least one feeling'
      isValid = false
    }

    setErrorMessages(newErrorMessages)
    return isValid
  }

  const handleSaveJournal = async () => {
    if (!validateForm()) {
      return
    }

    let emotionList = [...selectedFeelings]
    emotionList.push(selectedEmotion)
    const updatedForm = { ...form, emotion_id: emotionList }
    try {
      setSelectedFeelings([])
      setJournal(null)
      await editJournal(id, updatedForm)
      const response = await journalEntryById(id)
      setJournal(response)
      setIsSuccessModalVisible(true)
    } catch (error) {
      console.error('Error editing journal:', error)
    }
  }

  if (selectedFeelings.length === 0 && !journal) {
    return (
      <SafeAreaView className="flex-1 p-4 bg-optimistic-gray-10">
        <StatusBar barStyle="dark-content" />
        <View className="flex-1 justify-center items-center">
          <Loading />
        </View>
      </SafeAreaView>
    )
  }
  return (
    <SafeAreaView className="flex-1  p-4 bg-optimistic-gray-10">
      <StatusBar barStyle="dark-content" />
      <BackButton buttonStyle="pb-5" />
      <ScrollView className="flex-1 space-y-4 pb-5">
        <Text className="font-urbanist-extra-bold text-3xl text-mindful-brown-80 pb-5">
          Edit Your Journal
        </Text>
        <FormField
          title="Journal Title"
          iconName="notebook-outline"
          value={form.title}
          handleChange={(value) => setForm({ ...form, title: value })}
          customStyles="w-full pb-4"
          placeHolder="Enter Journal Title"
          errorMessage={errorMessages.title}
        />
        <TextBox
          title="Edit Your Entry"
          value={form.journal_text}
          handleChange={(value) => setForm({ ...form, journal_text: value })}
          placeHolder="Write your thoughts here..."
          errorMessage={errorMessages.journal_text}
        />

        {emotions.length > 0 && (
          <View className="space-y-4 my-2">
            <View>
              <Text className="font-urbanist-bold text-lg">
                Select your emotion
              </Text>
              <TouchableOpacity onPress={() => setIsEmotionModalVisible(true)}>
                <Text className="font-urbanist-semi-bold text-serenity-green-60">
                  View Wheel of Emotions
                </Text>
              </TouchableOpacity>
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
              {errorMessages.feelings && (
                <Text className="text-present-red-50 font-urbanist-semi-bold">
                  {errorMessages.feelings}
                </Text>
              )}
            </View>
          </View>
        )}

        <CustomButton
          title="Save Journal"
          handlePress={handleSaveJournal}
          buttonStyle="w-full mb-10 bg-serenity-green-50"
        />
      </ScrollView>
      {isSuccessModalVisible && (
        <ConfirmModal
          title="Journal Updated"
          subTitle="Your journal has been updated successfully"
          confirmButtonTitle="Ok, Thanks!"
          isConfirmButton={true}
          handleConfirm={() => {
            setIsSuccessModalVisible(false)
            router.push('/(journal)/journal-history')
          }}
        />
      )}
      {isEmotionModalVisible && (
        <ConfirmModal
          title="Wheel of Emotions"
          subTitle="How do you feel today?"
          imageSource={emotionWheelImg}
          confirmButtonTitle="Ok, Thanks!"
          isConfirmButton={true}
          handleConfirm={() => {
            setIsEmotionModalVisible(false)
          }}
        />
      )}
    </SafeAreaView>
  )
}

export default JournalDetail
