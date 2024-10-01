import { View, Text, ScrollView, TouchableOpacity, Pressable } from 'react-native'
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router'
import { Image } from 'expo-image'
import TopBrownSearchBar from '../../components/topBrownSearchBar'
import MetricCard from '../../components/metricCard'
import { colors } from '../../common/styles'
import StatusBarComponent from '../../components/darkThemStatusBar';
const Home = () => {
  return (
    <SafeAreaView className="flex-1 bg-optimistic-gray-10">
      <ScrollView>      
      <StatusBarComponent barStyle="light-content" backgroundColor="#251404" />
      <TopBrownSearchBar title="Hi Staff!" />
        <View className="bg-optimistic-gray-10 p-4 rounded-lg mb-4">
        <Link href="/map" asChild>
          <Pressable className="relative w-full rounded-xl mb-4" style={{ aspectRatio: 1.5 }}>
            <Image
              source={require("../../assets/start.svg")}
              className="w-full h-full rounded-xl"
            />
            <Text className="absolute text-white font-urbanist-black text-3xl mt-4 ml-5">
              Explore
            </Text>
          </Pressable>
        </Link>

          <Text className="text-mindful-brown-100 font-urbanist-extra-bold text-xl mb-4">
            Mindfulness Tracker
          </Text>
          <MetricCard
            route="/(journal)/journal-home"
            iconName="book-plus-outline"
            iconColor={colors.empathyOrange40}
            circleStyle="bg-empathy-orange-10"
            title="Mindful Journal"
            rightImage={require('../../assets/mindfulJournalMetricCard.png')}
          >
            <Text className="font-urbanist-semi-bold text-mindful-brown-80 text-lg">
              xx Days Streak
            </Text>
          </MetricCard>

          <MetricCard
            route="/favourite"
            iconName="book-plus-outline"
            iconColor={colors.empathyOrange40}
            circleStyle="bg-empathy-orange-10"
            title="Favourite Landmarks"
            rightImage={require('../../assets/mindfulJournalMetricCard.png')}
          >
            <Text className="font-urbanist-semi-bold text-mindful-brown-80 text-lg">
              xx Days Streak
            </Text>
          </MetricCard>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Home
