import 'dotenv/config'

export default () => ({
  expo: {
    name: 'TheMindfulBear',
    slug: 'TheMindfulBear',
    scheme: 'TheMindfulBear',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.anonymous.frontend',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.anonymous.frontend',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      'expo-router',
      'expo-font',
      [
        '@rnmapbox/maps',
        {
          RNMapboxMapsDownloadToken: process.env.RNMapboxMapsDownloadToken,
        },
      ],
    ],
  },
})
