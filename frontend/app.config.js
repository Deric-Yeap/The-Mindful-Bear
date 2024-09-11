import 'dotenv/config'

export default () => ({
  expo: {
    name: 'TheMindfulBear',
    slug: 'TheMindfulBear',
    scheme: 'themindfulbear',
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
      intentFilters: [
        {
          action: 'VIEW',
          autoVerify: true,
          data: [
            {
              scheme: 'http',
              host: 'themindfulbear.com',
              pathPrefix: '/password-confirm',
            },
            {
              scheme: 'themindfulbear',
              host: '',
              pathPrefix: '/password-confirm',
            },
          ],
          category: ['BROWSABLE', 'DEFAULT'],
        },
      ],
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
