import { View, Text } from 'react-native'
import LottieView from 'lottie-react-native'
import { useRef, useState, useEffect } from 'react'
import { useNavigation } from 'expo-router'
import CustomButton from '../../components/customButton'
import BackButton from '../../components/backButton'
import { sumPoints } from '../../api/achievementPoint'
import { gachaFragment } from '../../api/userFragment'
import Loading from '../../components/loading'
import ConfirmModal from '../../components/confirmModal'

const Shop = () => {
  const navigation = useNavigation()
  const [points, setPoints] = useState(null)
  const [avatar, setAvatar] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalText, setModalText] = useState({})

  useEffect(() => {
    fetchPoints()
  }, [])

  const fetchPoints = async () => {
    try {
      const response = await sumPoints()
      setPoints(response.total_points)
    } catch (error) {
      console.error(error)
    }
  }
  const handleGoToFragmentShop = () => {
    navigation.navigate('(tabs)', { screen: '(fragmentShop)' })
  }

  const handleBoxOpen = async () => {
    setModalText({})
    try {
      const response = await gachaFragment()
      setAvatar(response)
      setModalText({
        title: 'Congratulations!',
        subTitle: `You received a fragment for "${response.title}"`,
        lottieSource: { uri: response.avatar_url },
      })
      setIsModalVisible(true)
      fetchPoints()
    } catch (error) {
      const error_description = error.response.data.error_description
      if (error_description.points) {
        setModalText({
          title: `+ ${error_description.points} points`,
          subTitle: error_description.detail,
          lottieSource: { uri: error_description.avatar_url },
        })
      } else {
        setModalText({
          title: 'Oops!',
          subTitle: error_description,
        })
      }
      setIsModalVisible(true)
    } finally {
      fetchPoints()
    }
  }

  if (!points) {
    return (
      <View className="flex-1 p-4 bg-white">
        <View className="flex-1 justify-center items-center">
          <Loading />
        </View>
      </View>
    )
  }

  return (
    <View className="flex-1 p-4 bg-white">
      <View className="flex-row items-center justify-center mt-12">
        <View className="absolute left-0">
          <BackButton
            buttonStyle="float-left"
            tabName="(tabs)"
            screenName="home"
          />
        </View>
        <Text className="font-urbanist-extra-bold text-4xl text-mindful-brown-80">
          Fragment Shop
        </Text>
      </View>
      <View className="items-center mt-4">
        <Text className="font-urbanist-extra-bold text-mindful-brown-60 text-4xl">
          {points}
        </Text>
        <Text className="font-urbanist-regular text-lg text-mindful-brown-70">
          Points
        </Text>
      </View>
      <View className="flex-1 items-center justify-center">
        <LottieView
          source={require('../../assets/boxOpening.json')}
          autoPlay={true}
          loop={true}
          className="w-[70vw] h-[70vw]"
        />
        <Text className="font-urbanist-bold text-kind-purple-60">
          -100 points
        </Text>

        <CustomButton
          title="Open Box"
          handlePress={handleBoxOpen}
          buttonStyle="w-[50vw] mt-4 bg-empathy-orange-20"
          textStyle="text-kind-purple-90 font-urbanist-extra-bold "
        />
        <CustomButton
          title="Go to Fragment Shop"
          handlePress={handleGoToFragmentShop}
          buttonStyle="w-[60vw] mt-4 bg-empathy-orange-20"
          textStyle="text-kind-purple-90 font-urbanist-extra-bold "
        />
      </View>

      {isModalVisible && (
        <ConfirmModal
          title={modalText && modalText.title}
          subTitle={modalText && modalText.subTitle}
          confirmButtonTitle="Okay!"
          isConfirmButton={true}
          lottieSource={modalText && modalText.lottieSource}
          handleConfirm={() => {
            setIsModalVisible(false)
          }}
        />
      )}
    </View>
  )
}

export default Shop
