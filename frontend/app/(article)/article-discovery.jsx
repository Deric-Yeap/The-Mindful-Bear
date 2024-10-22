import { View, Text, ScrollView, Image, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatusBarComponent from '../../components/darkThemStatusBar';
import BackButton from '../../components/backButton';
import { Dimensions } from 'react-native';
import logo from '../../assets/mindfulBearLogo.png';
import { useRouter } from 'expo-router'; // Import useRouter from expo-router
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const ArticleDiscovery = () => {
  const router = useRouter(); // Use useRouter hook
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    // Navigate to the article result screen
    router.push(`/article-result?query=${encodeURIComponent(searchTerm)}`);
  };

  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;  // Get the screen width dynamically

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
            borderTopLeftRadius: screenWidth * 0.7,  // Make the rounding dynamic
            borderTopRightRadius: screenWidth * 0.7,
            width: screenWidth * 1.5,  // Adjust to ensure the shape looks centered
            left: -(screenWidth * 0.25),  // Center the shape horizontally
          }}
        >
          {/* Image component */}
          <Image
            source={logo}
            style={{
              width: 300,
              height: 300,
              marginBottom: 20,
              marginTop: -(screenHeight * 0.25),  // Dynamically adjust based on 25% of the screen height
            }}
            resizeMode="contain"
          />

          {/* Search bar moved below the image */}
          <View style={{ paddingHorizontal: 20, marginTop: 10, width: screenWidth * 0.9 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                placeholder="Search anything..."
                placeholderTextColor="#F7F4F2"
                value={searchTerm}
                onChangeText={setSearchTerm}
                style={{
                  flex: 1,
                  backgroundColor: '#795548',  // mindful brown
                  padding: 12,
                  borderRadius: 50,
                  color: 'white',
                }}
              />
              <TouchableOpacity
                style={{
                  marginLeft: 10,
                  padding: 12,
                  backgroundColor: '#6D4C41',  // slightly darker brown
                  borderRadius: 50,
                }}
                onPress={handleSearch}  // Update the onPress handler
              >
                <MaterialIcons name="search" size={24} color="#F7F4F2" />
              </TouchableOpacity>
            </View>
          </View>

        </View>

        <StatusBarComponent barStyle="dark-content" backgroundColor="#BEE2F8" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ArticleDiscovery;
