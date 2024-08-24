import React from 'react'

import { SafeAreaView } from 'react-native-safe-area-context'
import { View, StyleSheet, Text, ScrollView } from 'react-native'
import { MapLibreGL } from '@maplibre/maplibre-react-native'

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  map: {
    flex: 1,
    alignSelf: 'stretch',
  },
})
const MAPTILER_API_KEY = process.env.MAPTILER_API_KEY

const Map = () => {
  MapLibreGL.setWellKnownTileServer(MapLibreGL.TileServers.MapLibre)
  MapLibreGL.setAccessToken(null)

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View>
          <MapLibreGL.MapView
            style={styles.map}
            styleURL={`https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_API_KEY}`}
            logoEnabled={false}
            attributionPosition={{ bottom: 8, right: 8 }}
          >
            <MapLibreGL.Camera
              defaultSettings={{ centerCoordinate: [2, 41.5], zoomLevel: 8 }}
            />
          </MapLibreGL.MapView>
          <Text>{MAPTILER_API_KEY}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Map
