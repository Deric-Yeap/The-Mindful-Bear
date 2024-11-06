import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import AvatarCard from '../../../components/avatar/avatarCard'
import BackButton from '../../../components/backButton'
import { getAchievementsByUserId } from '../../../api/achievement'
import { StatusBar } from 'react-native'
import Loading from '../../../components/loading'
import { useSelector } from 'react-redux'
import ConfirmModal from '../../../components/confirmModal'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { colors } from '../../../common/styles'

const Achievement = () => {
  const [isLoading, setIsLoading] = useState(false)
  const user = useSelector((state) => state.user)
  const userAchievements = useSelector(
    (state) => state.achievements.userAchievements
  )
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  // const fetchData = async () => {
  //   try {
  //     setIsLoading(true)
  //     const userAchievements = await getAchievementsByUserId(user.userId)
  //     setUserAchievement(userAchievements)
  //   } catch (error) {
  //     console.error(error)
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  // useEffect(() => {
  //   fetchData()
  // }, [])

  if (isLoading) {
    return (
      <View className="flex-1 p-4 bg-white">
        <StatusBar barStyle="dark-content" />
        <View className="flex-1 justify-center items-center">
          <Loading />
        </View>
      </View>
    )
  }
  return (
    <SafeAreaView className="flex-1 p-4 bg-mindful-brown-10 mt-14">
      <View id="title-row" className="flex flex-row items-center mb-8  ">
        <BackButton buttonStyle="mr-2" tabName="(tabs)" screenName="home" />
      </View>
      <Text className="text-3xl font-urbanist-extra-bold text-mindful-brown-80 text-center">
        My Achievements
      </Text>
      <View className="mt-4">
        <Text className="text-lg font-urbanist-medium text-mindful-brown-80 text-center">
          You currently have {userAchievements.length} achievements
        </Text>
        {userAchievements.length === 0 ? (
          <Text className="text-lg font-urbanist-medium text-mindful-brown-80 text-center">
            Let's do more for our mental health journey!
          </Text>
        ) : (
          <Text className="text-lg font-urbanist-medium text-mindful-brown-80 text-center">
            Congratulations on your mental health journey!
          </Text>
        )}
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}></ScrollView>

      {/* <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex flex-row flex-wrap gap-y-4 xs:ml-3">
          {userAvatars.map((avatar) => (
            <View key={avatar.id} className="w-6/12">
              <AvatarCard
                isPurchaseButton={false}
                imageSource={{ uri: avatar.avatar.avatar_url }}
                title={avatar.avatar.title || 'No Title'}
                handleConfirm={() => {
                  setShowConfirmModal(true)
                  setSelectedAvatar(avatar)
                }}
                isSelected={avatar.is_selected}
              />
            </View>
          ))}
        </View>
      </ScrollView> */}
      {/* {showConfirmModal && (
        <ConfirmModal
          isConfirmButton={true}
          isCancelButton={true}
          confirmButtonTitle={'Confirm'}
          cancelButtonTitle={'Cancel'}
          title={'Are you sure you want to select this avatar?'}
          handleConfirm={equipAvatar}
          handleCancel={() => {
            setShowConfirmModal(false)
          }}
        />
      )} */}
    </SafeAreaView>
  )
}

export default Achievement
