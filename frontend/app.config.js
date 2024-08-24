import * as dotenv from 'dotenv'

// initialize dotenv
dotenv.config()

export default ({ config }) => ({
  ...config,
  slug: 'TheMindfulBear',
  name: 'TheMindfulBear',
  plugins: {
    config: {
      RNMapboxMapsDownloadToken: process.env.MAPBOX_API_KEY,
    },
  },
})
