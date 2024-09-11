import React, {useEffect} from 'react'
import { Slot } from 'expo-router'
import { store } from '../redux/store'
import { Provider } from 'react-redux'
import * as SplashScreen from 'expo-splash-screen'
import * as Linking from 'expo-linking'
import {
  useFonts,
  Urbanist_100Thin,
  Urbanist_200ExtraLight,
  Urbanist_300Light,
  Urbanist_400Regular,
  Urbanist_500Medium,
  Urbanist_600SemiBold,
  Urbanist_700Bold,
  Urbanist_800ExtraBold,
  Urbanist_900Black,
  Urbanist_100Thin_Italic,
  Urbanist_200ExtraLight_Italic,
  Urbanist_300Light_Italic,
  Urbanist_400Regular_Italic,
  Urbanist_500Medium_Italic,
  Urbanist_600SemiBold_Italic,
  Urbanist_700Bold_Italic,
  Urbanist_800ExtraBold_Italic,
  Urbanist_900Black_Italic,
} from '@expo-google-fonts/urbanist'

SplashScreen.preventAutoHideAsync()

const RootLayout = () => {
  const [loaded, error] = useFonts({
    Urbanist_100Thin,
    Urbanist_200ExtraLight,
    Urbanist_300Light,
    Urbanist_400Regular,
    Urbanist_500Medium,
    Urbanist_600SemiBold,
    Urbanist_700Bold,
    Urbanist_800ExtraBold,
    Urbanist_900Black,
    Urbanist_100Thin_Italic,
    Urbanist_200ExtraLight_Italic,
    Urbanist_300Light_Italic,
    Urbanist_400Regular_Italic,
    Urbanist_500Medium_Italic,
    Urbanist_600SemiBold_Italic,
    Urbanist_700Bold_Italic,
    Urbanist_800ExtraBold_Italic,
    Urbanist_900Black_Italic,
  })

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync()
    }
  }, [loaded, error])

  // if (!loaded && !error) {
  //   return null
  // }

  useEffect(() => {
    const handleDeepLink = (event) => {
      const { url } = event
      const { path, queryParams } = Linking.parse(url)

      if (path === 'password-confirm') {
        const token = queryParams?.token
        if (token) {
          router.push(`/password-confirm?token=${token}`)
        }
      }
    }

    const listener = Linking.addEventListener('url', handleDeepLink)

    return () => {
      listener.remove()
    }
  }, [])

  return (
    <Provider store={store}>
      <Slot />
    </Provider>
  )
}

export default RootLayout
