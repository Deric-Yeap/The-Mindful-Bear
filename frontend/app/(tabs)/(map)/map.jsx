import React from 'react'

import { SafeAreaView } from 'react-native-safe-area-context'
import { View, ScrollView } from 'react-native'
import Mapbox from '@rnmapbox/maps'
import CustomButton from '../../../components/customButton'
const Map = () => {
  Mapbox.setAccessToken(process.env.MAPBOX_PUBLIC_KEY)
  const [form, setForm] = useState({
    start_datetime: '',
    end_datetime: '',
    pss_before: '',
    pss_after: '',
    physical_tiredness_before: '',
    physical_tiredness_after: '',
    engagement_metrics: '',
    

  })
  return (
    <SafeAreaView className="h-full">
      <View className="flex-1 relative">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
              />
            </Mapbox.MapView>
          </View>
        </ScrollView>
        <CustomButton
          title="Start"
          handlePress={() => console.log('hi')}
          buttonStyle="w-96 z-10 absolute bottom-10 self-center" // Adjust position here
          textStyle="text-white"
          isLoading={false}
        />
      </View>
    </SafeAreaView>
  )
}

export default Map
