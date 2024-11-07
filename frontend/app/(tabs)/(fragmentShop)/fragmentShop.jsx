import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import AvatarCard from '../../../components/avatar/avatarCard'
import {
  createUserAvatar,
  getUserAvatars,
  updateUserAvatar,
} from '../../../api/userAvatar'
import {
  deleteUserFragments,
  getUserFragments,
  updateUserFragment,
} from '../../../api/userFragment'
import { useNavigation, useFocusEffect } from 'expo-router'
import { getAvatars } from '../../../api/avatar'
import { useSelector } from 'react-redux'
import BackButton from '../../../components/backButton'
import ConfirmModal from '../../../components/confirmModal'
import Loading from '../../../components/loading'
import { getCombinedUserAvatars } from '../../../common/getCombinedUserAvatars'
import ShopPoints from '../../../components/shop/shopPoints'

const FragmentShop = () => {
  const navigation = useNavigation()
  const user = useSelector((state) => state.user)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [avatars, setAvatars] = useState([])
  const [selectedAvatar, setSelectedAvatar] = useState()
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [showFailedPurchaseModal, setShowFailedPurchaseModal] = useState(false)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const userAvatars = await getUserAvatars(user.userId)
      const userFragments = await getUserFragments(user.userId)

      const avatarList = await getAvatars()
      updatedFilteredAvatars = getCombinedUserAvatars(
        userAvatars,
        avatarList,
        userFragments
      )
      setAvatars(updatedFilteredAvatars)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    fetchData()
  }, [])
  useFocusEffect(
    React.useCallback(() => {
      fetchData()
    }, [])
  )

  const handleConfirm = async () => {
    if (!selectedAvatar) return
    const {
      current_quantity: currentUserFragmentQuantity,
      fragments_required: required,
      fragment_id,
    } = selectedAvatar

    try {
      if (currentUserFragmentQuantity === required) {
        await handleExactFragmentMatch(fragment_id)
      } else if (currentUserFragmentQuantity > required) {
        await handleExcessFragments(
          fragment_id,
          currentUserFragmentQuantity - required
        )
      } else {
        handleInsufficientFragments()
      }
    } catch (error) {
      console.error('Error updating fragments:', error)
      alert(
        'An error occurred while processing your purchase. Please try again.'
      )
    }
  }

  const handleExactFragmentMatch = async (fragmentId) => {
    const userAvatarData = {
      user: user.userId,
      avatar: selectedAvatar.avatar_id,
    }
    try {
      await createUserAvatar(userAvatarData)
      await deleteUserFragments(fragmentId)
      setShowConfirmModal(false)
      setShowPurchaseModal(true)
    } catch (error) {
      console.error('Error in handling exact fragment match:', error)
    }
  }

  const handleExcessFragments = async (fragmentId, updatedQuantity) => {
    const updatedFragmentData = { quantity: updatedQuantity }
    const userAvatarData = {
      user: user.userId,
      avatar: selectedAvatar.avatar_id,
    }
    try {
      await createUserAvatar(userAvatarData)
      await updateUserFragment(fragmentId, updatedFragmentData)

      setShowConfirmModal(false)
      setShowPurchaseModal(true)
    } catch (error) {
      console.error('Error in handling excess fragments:', error)
    }
  }

  const handleInsufficientFragments = () => {
    setShowConfirmModal(false)
    setShowFailedPurchaseModal(true)
  }

  const handleConfirmPurchase = () => {
    try {
      setShowPurchaseModal(false)
      navigation.navigate('(avatar)')
    } catch (error) {
      console.error('Error updating user fragments:', error)
    }
  }

  if (isLoading) {
    return (
      <View className="flex-1 p-4 bg-white">
        <View className="flex-1 justify-center items-center">
          <Loading />
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 p-4 bg-mindful-brown-10 mt-14">
      <View id="title-row" className="flex flex-row items-center mb-8  ">
        <BackButton buttonStyle="mr-2" tabName="(tabs)" screenName="(avatar)" />
        <Text className="text-xl font-bold text-mindful-brown-80">
          Shop for Avatars
        </Text>
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex flex-row flex-wrap gap-y-4 xs:ml-3">
          {avatars.map((avatar) => (
            <View key={avatar.avatar_id} className="w-6/12">
              <AvatarCard
                isPurchaseButton={true}
                imageSource={{ uri: avatar.avatar_url }}
                points={
                  <ShopPoints
                    userFragmentQuantity={avatar.current_quantity}
                    noOfFragmentsRequired={avatar.fragments_required}
                  />
                }
                isSelected={avatar.current_quantity < avatar.fragments_required}
                title={avatar.title || 'No Title'}
                handleConfirm={() => {
                  setShowConfirmModal(true)
                  setSelectedAvatar(avatar)
                }}
              />
            </View>
          ))}
        </View>
      </ScrollView>
      {showConfirmModal && (
        <ConfirmModal
          isConfirmButton={true}
          isCancelButton={true}
          lottieSource={{ uri: selectedAvatar.avatar_url }}
          confirmButtonTitle={'Confirm'}
          cancelButtonTitle={'Cancel'}
          title={'Are you sure you want to purchase this avatar?'}
          handleConfirm={handleConfirm}
          handleCancel={() => {
            setShowConfirmModal(false)
          }}
        />
      )}
      {showPurchaseModal && (
        <ConfirmModal
          isConfirmButton={true}
          isCancelButton={false}
          lottieSource={{ uri: selectedAvatar.avatar_url }}
          confirmButtonTitle={'Confirm'}
          title={'Purchase Complete!'}
          subTitle={'Great Job!'}
          handleConfirm={handleConfirmPurchase}
        />
      )}
      {showFailedPurchaseModal && (
        <ConfirmModal
          isConfirmButton={false}
          isCancelButton={true}
          lottieSource={{ uri: selectedAvatar.avatar_url }}
          confirmButtonTitle={'Confirm'}
          cancelButtonTitle={'Close'}
          title={'Purchase Failed!'}
          subTitle={'You do not have enough fragments!'}
          handleCancel={() => {
            setShowFailedPurchaseModal(false)
            setShowPurchaseModal(false)
          }}
        />
      )}
    </SafeAreaView>
  )
}

export default FragmentShop
