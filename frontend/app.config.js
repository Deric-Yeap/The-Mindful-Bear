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
    extra: {
      eas: {
        projectId: 'af68e63f-6282-4d84-9a81-de4af7a097c9',
      },
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.anonymous.frontend1',
      deploymentTarget: '13.0',
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

      permissions: [
        'android.permission.ACCESS_FINE_LOCATION',
        'android.permission.ACCESS_COARSE_LOCATION',
        'android.permission.ACCESS_BACKGROUND_LOCATION',
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
      [
        'expo-location',
        {
          locationAlwaysAndWhenInUsePermission:
            'Allow $(PRODUCT_NAME) to use your location.',
          isAndroidBackgroundLocationEnabled: true,
          isIosBackgroundLocationEnabled: true,
        },
      ],
      [
        '@bam.tech/react-native-app-security',
        {
          sslPinning: {
            'themindfulbear.xyz': [
              '2wAy2q6RNZ+mJZYfLkrMVecVwxGtSNhkW7MUyPV0FoY=',
              'NYbU7PBwV4y9J67c4guWTki8FJ+uudrXL0a4V4aRcrg=',
            ],
          },
          preventRecentScreenshots: {
            ios: { enabled: true },
            android: { enabled: true },
          },
        },
      ],
    ],
  },
})
