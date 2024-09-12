import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router'
import { Image } from 'expo-image'

import MetricCard from '../../components/metricCard'
import { colors } from '../../common/styles'

const Home = () => {
  return (
    <SafeAreaView className="flex-1 bg-optimistic-gray-10">
      <ScrollView>
        <View className="bg-optimistic-gray-10 p-4 rounded-lg mb-4">
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
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Home
