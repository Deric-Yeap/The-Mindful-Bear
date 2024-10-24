import React, { useState } from 'react'
import { SafeAreaView, View, Text, Button, TextInput } from 'react-native'
import Mapbox from '@rnmapbox/maps'
import { useRouter } from 'expo-router';
import CustomButton from './customButton';


const SelectLocationMap = ({ onLocationSelected }) => {
  Mapbox.setAccessToken(process.env.MAPBOX_PUBLIC_KEY) // Set your Mapbox token
  console.log('SelectLocationMap component is rendering'); // Debug log

  const [selectedLocation, setSelectedLocation] = useState(null)
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  // const router = useRouter() // Initialize router

  // Function to handle map tap and extract coordinates
  const handleMapPress = (event) => {
    const { geometry } = event
    const { coordinates } = geometry

    const [longitude, latitude] = coordinates // Longitude comes first in GeoJSON
    setSelectedLocation({ latitude, longitude })
    
    const roundedLatitude = roundToNineDigits(latitude) //max 9 digits
    const roundedLongitude = roundToNineDigits(longitude) // max 9 digits
    setSelectedLocation({ latitude: roundedLatitude.toString(), longitude: roundedLongitude.toString() });
    setLatitude(roundedLatitude.toString());
    setLongitude(roundedLongitude.toString());
  }

  const roundToNineDigits = (number) => {
    const intPart = Math.floor(Math.abs(number)).toString().length; // Length of integer part
    const maxDecimalPlaces = Math.min(6, 9 - intPart); // Allow up to 6 decimal places, but ensure total digits equal 9
    return number.toFixed(maxDecimalPlaces); // Adjust to the calculated decimal places
}

  // Function to handle "confirm location" action
  const confirmLocation = () => {
    if (selectedLocation) {
      // Navigate back to LandmarkCreator with latitude and longitude as query params
      console.log("Navigating with:", {
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
      });
      onLocationSelected(selectedLocation);
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
            <Mapbox.PointAnnotation
              id="selectedLocation"
              coordinate={[parseFloat(selectedLocation.longitude), parseFloat(selectedLocation.latitude)]}
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
          
      <View className="p-4 bg-white border-t border-gray-300">
        <View className="mb-4">
          <Text className="text-mindful-brown-80 text-lg font-bold">Coordinate-x</Text>
          <TextInput
            className="mt-2 text-black rounded-3xl bg-gray-200 px-4 py-2 h-10"
            placeholder="Coordinate-x"
            value={longitude}
            onChangeText={setLongitude}
          />
        </View>
        <View>
          <Text className="text-mindful-brown-80 text-lg font-bold">Coordinate-y</Text>
          <TextInput
            className="mt-2 text-black rounded-3xl bg-gray-200 px-4 py-2 h-10"
            placeholder="Coordinate-y"
            value={latitude}
            onChangeText={setLatitude}
          />
        </View>
      </View>
      <CustomButton
            className="absolute bottom-0 left-0 right-0 mb-4 mx-4"
            handlePress={confirmLocation}
            title="Confirm Location"
          />
        </View>
      )}
    </SafeAreaView>
  )
}

export default SelectLocationMap
