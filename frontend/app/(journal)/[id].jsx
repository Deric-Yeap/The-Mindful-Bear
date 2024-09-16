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
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Audio } from 'expo-av'
import Slider from '@react-native-community/slider'

import { journalEntryById } from '../../api/journal'
import { adjustHexColor } from '../../common/hexColor'
import Loading from '../../components/loading'
import BackButton from '../../components/backButton'

const JournalDetail = () => {
  const { id } = useLocalSearchParams()
  const [journal, setJournal] = useState(null)
  const [sound, setSound] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [position, setPosition] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await journalEntryById(id)
        setJournal(response)
        if (response.file_url) {
          await loadAudio(response.file_url)
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [id])

  useEffect(() => {
    return sound
      ? () => {
          sound
            .unloadAsync()
            .catch((error) => console.error('Error unloading sound:', error))
        }
      : undefined
  }, [sound])

  const getEmotionIcon = (sentiment) => {
    if (sentiment === 'Positive') return 'emoticon-happy'
    if (sentiment === 'Negative') return 'emoticon-sad'
    return 'emoticon-neutral'
  }

  const loadAudio = async (audioPath) => {
    const sound = new Audio.Sound()
    try {
      await sound.loadAsync({ uri: audioPath })
      sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
      setSound(sound)
    } catch (error) {
      console.error('Error loading audio:', error)
    }
  }

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis)
      setDuration(status.durationMillis)
      setIsPlaying(status.isPlaying)
    }
  }

  const handlePlayPause = async () => {
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync()
        } else {
          await sound.playAsync()
        }
      } else {
        console.error('Sound object is null')
      }
    } catch (error) {
      console.error('Error playing/pausing audio:', error)
    }
  }

  const handleSliderChange = async (value) => {
    if (sound) {
      const positionMillis = value * duration
      await sound
        .setPositionAsync(positionMillis)
        .catch((error) => console.error('Error setting position:', error))
    }
  }

  if (!journal) {
    return (
      <SafeAreaView className="flex-1 p-4 bg-optimistic-gray-10">
        <StatusBar barStyle="dark-content" />
        <View className="flex-1 justify-center items-center">
          <Loading />
        </View>
      </SafeAreaView>
    )
  }

  const innerEmotion = journal.emotion_id.find(
    (emotion) => emotion.level === 'Inner'
  )
  const color = innerEmotion ? innerEmotion.colorID.hexcode : 'black'
  const darkerHex = innerEmotion ? adjustHexColor(color, -0.5) : 'black'
  const lighterHex = innerEmotion ? adjustHexColor(color, 0.2) : 'black'

  return (
    <SafeAreaView className="flex-1 bg-optimistic-gray-10">
      <StatusBar barStyle="dark-content" />
      <BackButton buttonStyle="mx-4" />
      <ScrollView className="flex-1 p-4 space-y-4 pb-5">
        <View className="flex-row justify-between items-center">
          <Text className="font-urbanist-extra-bold text-3xl text-mindful-brown-80">
            {journal.title}
          </Text>
          <View
            className="h-14 w-14 rounded-full items-center justify-center"
            style={{ backgroundColor: darkerHex }}
          >
            <MaterialCommunityIcons
              name={getEmotionIcon(journal.sentiment_analysis_result)}
              size={30}
              color="white"
            />
          </View>
        </View>
        <Text className="font-urbanist-regular text-lg text-mindful-brown-80">
          {journal.journal_text}
        </Text>
        <View className="mt-4 space-y-2">
          <Text className="font-urbanist-semi-bold text-mindful-brown-80">
            <Text className="font-urbanist-extra-bold text-mindful-brown-80">
              Upload Date:
            </Text>{' '}
            {new Date(journal.upload_date).toLocaleString()}
          </Text>
        </View>
        {journal.file_url && (
          <View className="mt-4 mb-4">
            <Slider
              value={position / duration}
              onValueChange={handleSliderChange}
              minimumTrackTintColor={darkerHex}
              maximumTrackTintColor={lighterHex}
              thumbTintColor={darkerHex}
            />
            <TouchableOpacity
              onPress={handlePlayPause}
              className="bg-mindful-brown-80 p-4 rounded-full items-center"
            >
              <MaterialCommunityIcons
                name={isPlaying ? 'pause' : 'play'}
                size={30}
                color="white"
              />
            </TouchableOpacity>
          </View>
        )}
        {journal.emotion_id && journal.emotion_id.length > 0 && (
          <View className="mb-10">
            <View className="w-full h-[1px] bg-optimistic-gray-30 mb-4 mx-2"></View>
            <View className="flex-row flex-wrap">
              {journal.emotion_id.map((emotion) => {
                const color = emotion.colorID.hexcode
                const lighterHex = adjustHexColor(color, 0.8)
                const darkerHex = adjustHexColor(color, -0.5)
                return (
                  <View
                    key={emotion.id}
                    className="item-center justify-center min-w-[15vw] py-1 px-3 rounded-full mt-2 mr-2"
                    style={{ backgroundColor: lighterHex }}
                  >
                    <Text
                      className="font-urbanist-bold text-md text-center"
                      style={{ color: darkerHex }}
                    >
                      {emotion.name}
                    </Text>
                  </View>
                )
              })}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default JournalDetail
