import 'dotenv/config'

export default () => ({
  expo: {
    name: 'TheMindfulBear',
    slug: 'TheMindfulBear',
    plugins: [
      [
        '@rnmapbox/maps',
        {
          RNMapboxMapsDownloadToken: process.env.RNMapboxMapsDownloadToken,
        },
      ],
    ],
  },
})
