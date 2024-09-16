import React, { useState } from 'react'
import { SafeAreaView, View, Text, Button } from 'react-native'
import Mapbox from '@rnmapbox/maps'
import { useRouter } from 'expo-router';

const SelectLocationMap = () => {
  Mapbox.setAccessToken(process.env.MAPBOX_PUBLIC_KEY) // Set your Mapbox token

  const [selectedLocation, setSelectedLocation] = useState(null)
  const router = useRouter() // Initialize router

  // Function to handle map tap and extract coordinates
  const handleMapPress = (event) => {
    const { geometry } = event
    const { coordinates } = geometry

    const [longitude, latitude] = coordinates // Longitude comes first in GeoJSON
    setSelectedLocation({ latitude, longitude })
  }

  // Function to handle "confirm location" action
  const confirmLocation = () => {
    if (selectedLocation) {
      // Navigate back to LandmarkCreator with latitude and longitude as query params
      console.log("Navigating with:", {
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
      });
      router.push({
        pathname: '/landmarkCreator',
        query: {
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        },
      })
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Mapbox.MapView
          style={{ flex: 1 }}
          styleURL="mapbox://styles/mapbox/streets-v12"
          onPress={handleMapPress} // Add the press event to capture location
        >
          {selectedLocation && (
            <Mapbox.MarkerView
              coordinate={[selectedLocation.longitude, selectedLocation.latitude]}
            />
          )}
          <Mapbox.Camera
            centerCoordinate={[103.8348, 1.2804]} // Initial coordinates (SGH area)
            zoomLevel={15}
          />
        </Mapbox.MapView>
      </View>

      {selectedLocation && (
        <View style={{ padding: 10 }}>
          <Text>Selected Latitude: {selectedLocation.latitude}</Text>
          <Text>Selected Longitude: {selectedLocation.longitude}</Text>
          <Button title="Confirm Location" onPress={confirmLocation} />
        </View>
      )}
    </SafeAreaView>
  )
}

export default SelectLocationMap
