import React, { useEffect, useState, useRef } from 'react'
import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import { mindfulBear } from '../../../assets/image'
import AvatarCard from '../../../components/avatar/avatarCard'
import BackButton from '../../../components/backButton'
import { getUserAvatars } from '../../../api/userAvatar'
import { StatusBar } from 'react-native'
import Loading from '../../../components/loading'
import { useSelector } from 'react-redux'

const Avatar = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [userAvatars, setUserAvatars] = useState([])
  const user = useSelector((state) => state.user)
  console.log(user)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const userAvatars = await getUserAvatars(user.userId)
        setUserAvatars(userAvatars)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

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
  console.log(userAvatars)
  return (
    <SafeAreaView className="flex-1 p-4 bg-mindful-brown-10 mt-14">
      <View id="title-row" className="flex flex-row items-center mb-6">
        <BackButton buttonStyle="mr-2" tabName="(tabs)" screenName="home" />
        <Text className="text-xl font-bold text-mindful-brown-80">
          User Avatars
        </Text>
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex flex-row flex-wrap gap-y-4 xs:ml-3">
          {userAvatars.map((avatar) => (
            <View key={avatar.id} className="w-6/12">
              <AvatarCard
                isPurchaseButton={false}
                imageSource={{ uri: avatar.avatar.avatar_url }}
                title={avatar.avatar.title || 'No Title'}
                handleConfirm={() =>
                  console.log('Avatar selected:', avatar.avatar.title)
                }
                isSelected={avatar.is_selected}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Avatar
