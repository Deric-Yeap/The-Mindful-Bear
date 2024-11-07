import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, useNavigation } from 'expo-router'
import { Image } from 'expo-image'
import { useSelector, useDispatch } from 'react-redux'
import { featureFlags } from '../../common/featureFlags'
import TopBrownSearchBar from '../../components/topBrownSearchBar'
import MetricCard from '../../components/metricCard'
import { colors } from '../../common/styles'
import StatusBarComponent from '../../components/darkThemStatusBar'
import Loading from '../../components/loading'
import { journalStreak } from '../../api/journal'
import ConfirmModal from '../../components/confirmModal'
import { clearNewlyAttainedAchievements } from '../../redux/slices/userAchievementSlice'

const Home = () => {
  const user = useSelector((state) => state.user)
  const newlyAttainedAchievements = useSelector(
    (state) => state.achievements.newlyAttainedAchievements
  )
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)
  const [streak, setStreak] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredCards, setFilteredCards] = useState([])
  const [isConfirmModal, setIsConfirmModal] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await journalStreak()
        setStreak(response.streak)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])
  useEffect(() => {
    if (newlyAttainedAchievements.length > 0) {
      setIsConfirmModal(true)
      dispatch(clearNewlyAttainedAchievements())
    }
  }, [newlyAttainedAchievements, dispatch])

  // MetricCard data with categories for filtering
  const metricCards = [
    {
      route: '/(journal)/journal-home',
      iconName: 'notebook',
      iconColor: colors.empathyOrange40,
      circleStyle: 'bg-empathy-orange-10',
      title: 'Mindful Journal',
      bodyText: `${streak} ${streak <= 1 ? 'Day' : 'Days'} Streak`,
      category: 'Journal',
      rightImage: require('../../assets/mindfulJournalMetricCard.png'),
    },
    {
      route: '/(article)/article-discovery',
      iconName: 'magnify',
      iconColor: colors.kindPurple50,
      circleStyle: 'bg-kind-purple-10',
      title: 'Article Discovery Made Easy',
      bodyText:
        'Effortlessly search and find articles that inspire and inform.',
      category: 'Article',
    },
    {
      route: '/favourite',
      iconName: 'heart-outline',
      iconColor: colors.presentRed60,
      circleStyle: 'bg-present-red-10',
      title: 'Favourite Landmarks',
      bodyText: 'View your favourite landmarks here.',
      category: 'Landmarks',
    },
    {
      route: '/(points)/points-history',
      iconName: 'trophy-outline',
      iconColor: colors.serenityGreen80,
      circleStyle: 'bg-serenity-green-10',
      title: 'Points Earned',
      bodyText: 'View your points history.',
      category: 'Achievement',
    },
    {
      route: '/(achievement)',
      iconName: 'trophy-award',
      iconColor: colors.serenityGreen80,
      circleStyle: 'bg-serenity-green-10',
      title: 'My Achievement Badges',
      bodyText: 'View your achievements!',
      category: 'Achievement',
    },
    {
      route: '/(points)/shop',
      iconName: 'cart-outline',
      iconColor: colors.serenityGreen80,
      circleStyle: 'bg-serenity-green-10',
      title: 'Shop',
      bodyText: 'Spend your points to unlock avatars!',
      category: 'Achievement',
    },
    {
      route: '/(avatar)',
      iconName: 'account-circle-outline',
      iconColor: colors.serenityGreen80,
      circleStyle: 'bg-serenity-green-10',
      title: 'My Avatars',
      bodyText: 'Manage and expand your avatar collection',
      category: 'Achievement',
    },
  ]

  // Update filtered cards when search term changes
  useEffect(() => {
    const newFilteredCards = metricCards.filter(
      ({ title, bodyText }) =>
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bodyText.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredCards(newFilteredCards)
  }, [searchTerm, streak])

  // Handle search action
  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 p-4 bg-white">
        <StatusBarComponent
          barStyle="light-content"
          backgroundColor="#251404"
        />
        <View className="flex-1 justify-center items-center">
          <Loading />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-optimistic-gray-10">
      {isConfirmModal && (
        <ConfirmModal
          isConfirmButton={true}
          isCancelButton={false}
          handleConfirm={() => {
            setIsConfirmModal(false)
            navigation.navigate('(achievement)')
          }}
          lottieSource={require('../../assets/diamond.json')}
          title={'Congrats! You have got a new achievement!'}
          subTitle={'Head to My Achievements to view!'}
          confirmButtonTitle={'Go to My Achievements!'}
        />
      )}
      <ScrollView className="mb-12">
        <StatusBarComponent
          barStyle="light-content"
          backgroundColor="#251404"
        />
        <TopBrownSearchBar
          title={`Welcome, ${user.name}!`}
          showBackButton={false}
          showSearchBar={false}
        />
        <View className="bg-optimistic-gray-10 p-4 rounded-lg mb-4">
          <Link href="/map" asChild>
            <Pressable
              className="relative w-full rounded-xl mb-4"
              style={{ aspectRatio: 1.5 }}
            >
              <Image
                source={require('../../assets/start.svg')}
                className="w-full h-full rounded-xl"
              />
              <Text className="absolute text-white font-urbanist-black text-3xl mt-4 ml-5">
                Explore
              </Text>
            </Pressable>
          </Link>

          {['Journal', 'Article', 'Landmarks', 'Achievement'].map((section) => {
            const sectionCards = filteredCards.filter(
              (card) => card.category === section
            )

            if (sectionCards.length === 0) {
              return null
            }

            return (
              <View key={section}>
                <Text className="text-mindful-brown-100 font-urbanist-extra-bold text-xl mb-4">
                  {section}
                </Text>
                {sectionCards.map((card, index) => (
                  <MetricCard
                    key={index}
                    route={card.route}
                    iconName={card.iconName}
                    iconColor={card.iconColor}
                    circleStyle={card.circleStyle}
                    title={card.title}
                    rightImage={card.rightImage}
                  >
                    <Text className="font-urbanist-semi-bold text-mindful-brown-80 text-lg">
                      {card.bodyText}
                    </Text>
                  </MetricCard>
                ))}
              </View>
            )
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Home
