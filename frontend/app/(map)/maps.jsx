import React from 'react'

import { SafeAreaView } from 'react-native-safe-area-context'
import { View, ScrollView } from 'react-native'
import Mapbox from '@rnmapbox/maps'

const Map = () => {
  Mapbox.setAccessToken(process.env.MAPBOX_PUBLIC_KEY)
  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="flex-1 justify-center items-center">
          <View className="h-screen w-full">
            <Mapbox.MapView
              className="flex-1"
              styleURL="mapbox://styles/mapbox/streets-v12"
              zoomEnabled={true}
              requestDisallowInterceptTouchEvent={true}
            >
              <Mapbox.Camera
                centerCoordinate={[103.8348, 1.2804]}
                zoomLevel={17}
                animationMode={'flyto'}
                animationDuration={1000}
                pitch={60}
                // followUserLocation={true}
                // UserTrackingMode={true}
              />
            </Mapbox.MapView>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Map
