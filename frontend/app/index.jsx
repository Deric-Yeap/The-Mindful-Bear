import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View, ImageBackground, StatusBar as RNStatusBar, Platform } from 'react-native';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/customButton';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails } from '../redux/slices/userSlice';
import { useEffect, useState } from 'react';
import Loading from '../components/loading';

const backgroundImage = require('../assets/landingPage.png'); 

export default function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true); // Loading state

  const handleUpdateUser = () => {
    dispatch(setUserDetails({ email: 'test@example.com', userId: 55 }));
  };
  
  const handlePress = () => {
    router.push('/(auth)/sign-in');
  };

  useEffect(() => {
    // Simulate fetching user data or any async operation
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
      handleUpdateUser();
      setLoading(false); // Set loading to false after fetching
    };

    fetchData();

    // Ensure StatusBar background color is set on mount
    if (Platform.OS === 'android') {
      RNStatusBar.setBackgroundColor('#BEE2F8', true);
    }
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Loading /> 
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <StatusBar barStyle="light-content" backgroundColor="#BEE2F8" />
      <ImageBackground 
        source={backgroundImage} 
        className="flex-1" 
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 justify-start items-center mt-20">
            <Text className="font-urbanist-extra-bold mt-1 text-3xl text-mindful-brown-80 text-center">
              Welcome to 
            </Text>
            <Text className="font-urbanist-extra-bold mt-1 text-4xl text-mindful-brown-80 text-center">
              The Mindful Bear
            </Text>
            <CustomButton
              title="Let's Get Started"
              handlePress={handlePress} 
              buttonStyle="w-1/2 mb-10 mt-4"
            />
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}