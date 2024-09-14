import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native'
import { useEffect, useState } from 'react'
import { router } from 'expo-router'

import BackButton from '../../components/backButton'
import CustomButton from '../../components/customButton'
import FormField from '../../components/formField'
import TextBox from '../../components/textBox'
import { createJournal } from '../../api/journal'
import { listEmotion } from '../../api/emotion'
import Loading from '../../components/loading'
import ConfirmModal from '../../components/confirmModal'

const TextJournal = () => {
  const [form, setForm] = useState({
    title: '',
    journal_text: '',
    emotion_id: [],
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [emotions, setEmotions] = useState([])
  const [selectedEmotion, setSelectedEmotion] = useState(1)
  const [selectedFeelings, setSelectedFeelings] = useState([])

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

  const handleCreateJournal = async () => {
    setIsLoading(true)
    let emotionList = [...selectedFeelings]
    emotionList.push(selectedEmotion)
    setForm({ ...form, emotion_id: emotionList })
    try {
      const response = await createJournal(form)
      setIsLoading(false)
      setIsModalVisible(true)
    } catch (error) {
      console.error(error)
      setIsLoading(false)
    }
  }

  return (
    <View className="flex-1">
      <StatusBar barStyle="light-content" />
      <View className="h-[20vh] bg-mindful-brown-70 justify-center p-4 pt-6">
        <BackButton buttonStyle="mb-4" />
        <Text className="font-urbanist-extra-bold text-3xl text-white">
          Add New Journal
        </Text>
      </View>
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
      <ScrollView className="p-4 flex-1 py-5">
        <FormField
          title="Journal Title"
          iconName="notebook-outline"
          value={form.title}
          handleChange={(value) => setForm({ ...form, title: value })}
          customStyles="w-full pb-4"
          placeHolder="Enter Journal Title"
        />

        <TextBox
          title="Write Your Entry"
          value={form.journal_text}
          handleChange={(value) => setForm({ ...form, journal_text: value })}
          placeHolder="Write your thoughts here..."
        />

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
        <View className="pb-5">
          <CustomButton
            title="Create Journal"
            buttonStyle="mb-4 mt-2"
            handlePress={handleCreateJournal}
          />
        </View>
      </ScrollView>
    </View>
  )
}

export default TextJournal
