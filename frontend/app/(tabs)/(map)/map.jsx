import React from 'react'

import { SafeAreaView } from 'react-native-safe-area-context'
import { View, ScrollView } from 'react-native'
// import Mapbox from '@rnmapbox/maps'
import CustomButton from '../../../components/customButton'

const Map = () => {
  // Mapbox.setAccessToken(process.env.MAPBOX_PUBLIC_KEY)
  // return (
  //   <SafeAreaView className="h-full">
  //     <ScrollView>
  //       <View className="h-screen w-full">
  //         <Mapbox.MapView
  //           className="flex-1"
  //           styleURL="mapbox://styles/mapbox/streets-v12"
  //           zoomEnabled={true}
  //           requestDisallowInterceptTouchEvent={true}
  //         >
  //           <Mapbox.Camera
  //             centerCoordinate={[103.8348, 1.2804]}
  //             zoomLevel={17}
  //             animationMode={'flyto'}
  //             animationDuration={1000}
  //             pitch={60}
  //           />
  //         </Mapbox.MapView>
  //         <CustomButton
  //           title="Start"
  //           handlePress={() => console.log('hi')}
  //           buttonStyle="w-96 z-10 absolute top-[81%] self-center"
  //           textStyle="text-white"
  //           isLoading={false}
  //         />
  //       </View>
  //     </ScrollView>
  //   </SafeAreaView>
  // )
}

export default Map
