import React, { useEffect, useState } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { Audio } from 'expo-av'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import Slider from '@react-native-community/slider'
import { decrementUserCount } from '../../api/landmark'
const AudioPlayer = ({
  audioUri,
  imageUrl,
  toPlay,
  setIsExercise,
  handleSheetChange,
  setHasArrived,
  handleClose,
  openCompletedModal,
  landmarkId,
}) => {
  const [sound, setSound] = useState()
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackStatus, setPlaybackStatus] = useState(null)
  const [positionMillis, setPositionMillis] = useState(0)
  const [durationMillis, setDurationMillis] = useState(1)
  const handlePlayPause = async () => {
    try {
      if (isPlaying) {
        await sound.pauseAsync()
        setIsPlaying(false)
      } else {
        if (!sound) {
          const { sound: newSound, status } = await Audio.Sound.createAsync(
            { uri: audioUri },
            { shouldPlay: true }
          )
          setSound(newSound)
          setPlaybackStatus(status)
          setIsPlaying(true)
          newSound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
        } else {
          if (positionMillis == durationMillis) {
            setPositionMillis(0)
            await sound
              .setPositionAsync(0)
              .catch((error) => console.error('Error setting position:', error))
          }
          await sound.playAsync()
          setIsPlaying(true)
        }
      }
    } catch (error) {
      console.error('Error handling play/pause:', error)
    }
  }

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPositionMillis(status.positionMillis)
      setDurationMillis(status.durationMillis || 1)
      setPlaybackStatus(status)
      if (status.didJustFinish) {
        if (toPlay) {
          openCompletedModal(true)
          setIsExercise(false)
          handleSheetChange(0)
          setHasArrived(false)
          try{
            decrementUserCount(landmarkId)
          }
          catch (error){
            console.error('Error updating landmarkusercount:', error)
          }
          
          handleClose()
        }

        setIsPlaying(false)
      }
    }
  }

  const handleSliderValueChange = async (value) => {
    if (sound) {
      const newPosition = value * durationMillis
      await sound.setPositionAsync(newPosition)
      setPositionMillis(newPosition)
    }
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync()
        }
      : undefined
  }, [sound])
  useEffect(() => {
    if (toPlay) {
      handlePlayPause(true)
    }
  }, [toPlay])

  return (
    <View className="relative w-full h-48 justify-center items-center">
      {/* Play/Pause Button */}
      <Image source={imageUrl} className="w-full h-full" resizeMode="cover" />
      {!isPlaying ? (
        <>
          <TouchableOpacity
            onPress={handlePlayPause}
            className="absolute justify-center items-center"
          >
            <MaterialCommunityIcons
              name="play-circle-outline"
              size={60}
              color="white"
            />
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity
            onPress={handlePlayPause}
            className="absolute justify-center items-center"
          >
            <MaterialCommunityIcons
              name="pause-circle-outline"
              size={60}
              color="white"
            />
          </TouchableOpacity>
        </>
      )}
      <View className="absolute bottom-3 left-5 right-5">
        <Slider
          value={positionMillis / durationMillis}
          onValueChange={handleSliderValueChange}
          minimumTrackTintColor={'white'}
          maximumTrackTintColor={'white'}
          thumbTintColor={'white'}
        />
      </View>
    </View>
  )
}

export default AudioPlayer
