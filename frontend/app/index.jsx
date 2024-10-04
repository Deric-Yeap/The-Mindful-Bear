import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View, ImageBackground } from 'react-native';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/customButton';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails } from '../redux/slices/userSlice';

// Import your PNG image
const backgroundImage = require('../assets/loadingPage.png'); 

export default function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const handleUpdateUser = () => {
    dispatch(setUserDetails({ email: 'test@example.com', userId: 55 }));
  };
  const handlePress = () => {
    router.push('/(auth)/sign-in');
  };
  return (
    <SafeAreaView className="flex-1">
      <StatusBar barStyle="light-content" backgroundColor="#BEE2F8" />
      <ImageBackground 
        source={backgroundImage} 
        className="flex-1" 
        resizeMode="cover"
      >
         <View className="mt-20 bg-blue-200 justify-center items-center z-[-1]">
        </View>
        <ScrollView contentContainerStyle="flex-grow">
          <View className="flex-1 justify-start items-center "> 
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
      <View className="h-1/5 absolute bottom-0 left-0 right-0 z-[-1]" style={{ backgroundColor: '#9BB167' }} />
    </SafeAreaView>
  );
}