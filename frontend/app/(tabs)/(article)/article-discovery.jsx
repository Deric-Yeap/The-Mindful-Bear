import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import StatusBarComponent from '../../../components/darkThemStatusBar'
import BackButton from '../../../components/backButton'
import { Dimensions } from 'react-native'
import logo from '../../../assets/mindfulBearLogo.png'
import { useRouter } from 'expo-router'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { colors } from '../../../common/styles'

const ArticleDiscovery = () => {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = () => {
    router.push({
      pathname: '/article-result',
      params: { query: searchTerm },
    })
  }

  const screenHeight = Dimensions.get('window').height
  const screenWidth = Dimensions.get('window').width

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#BEE2F8' }}>
      <BackButton
        buttonStyle=" left-4 top-12 z-10"
        className="absolute"
        tabName="(tabs)"
        screenName="home"
      />

      <ScrollView>
        <View
          className="bg-serenity-green-50 p-3 h-full items-center mt-[screenHeight/3] rounded-t-full w-[150vw] -left-[25vw]"
          style={{
            marginTop: screenHeight / 3,
            paddingVertical: 30,
            paddingHorizontal: 20,
            borderTopLeftRadius: screenWidth * 0.7,
            borderTopRightRadius: screenWidth * 0.7,
            width: screenWidth * 1.5,
            left: -(screenWidth * 0.25),
          }}
        >
          <Image
            source={logo}
            style={{
              width: 300,
              height: 300,
              marginTop: -(screenHeight * 0.25),
            }}
            resizeMode="contain"
          />
  <View className="items-center space-y-2 mb-2">
            <Text className="text-mindful-brown-80 font-urbanist-extra-bold text-4xl lg:text-5xl">
              Article Search
            </Text>
          </View>

          <View
            style={{
              paddingHorizontal: 20,
              marginTop: 10,
              width: screenWidth * 0.9,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                placeholder="How may i help you today..."
                placeholderTextColor="#F7F4F2"
                value={searchTerm}
                onChangeText={setSearchTerm}
                style={{
                  flex: 1,
                  backgroundColor: colors.serenityGreen60,
                  padding: 12,
                  borderRadius: 50,
                  color: 'white',
                  borderWidth: 2,
                  borderColor: '#F7F4F2',
                }}
              />
              <TouchableOpacity
                style={{
                  marginLeft: 10,
                  padding: 12,
                  backgroundColor: colors.serenityGreen70,
                  borderRadius: 50,
                  borderWidth: 2,
                  borderColor: '#F7F4F2',
                  elevation: 3,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  opacity: searchTerm.trim() ? 1 : 0.5, // Add opacity based on searchTerm
                }}
                onPress={searchTerm.trim() ? handleSearch : null} // Disable onPress when empty
                disabled={!searchTerm.trim()} // Add disabled prop
              >
                <MaterialIcons name="search" size={24} color="#F7F4F2" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <StatusBarComponent barStyle="dark-content" backgroundColor="#BEE2F8" />
      </ScrollView>
    </SafeAreaView>
  )
}

export default ArticleDiscovery
