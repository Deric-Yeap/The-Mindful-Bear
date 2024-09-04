import { React, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, ScrollView } from 'react-native'
import Mapbox from '@rnmapbox/maps'
import CustomButton from '../../../components/customButton'
import { getCurrentFormattedDateTime } from '../../../common/getCurrentFormattedDateTime'
import ConfirmModal from '../../../components/confirmModal'
import { createSession } from '../../../api/session'

const Map = () => {
  Mapbox.setAccessToken(process.env.MAPBOX_PUBLIC_KEY)
  const [form, setForm] = useState({
    start_datetime: '',
    end_datetime: '',
    pss_before: 1,
    pss_after: 1,
    physical_tiredness_before: 1,
    physical_tiredness_after: 1,
    engagement_metrics: 1,
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSessionStarted, setIsSessionStarted] = useState(false)
  const handleSessionStart = () => {
    const currentStartDateTime = getCurrentFormattedDateTime()
    console.log(currentStartDateTime)
    setForm(prevForm => ({
      ...prevForm,
      start_datetime: currentStartDateTime
    }))
    console.log(form);
    setIsSessionStarted(true)
  }
  const handleSessionEnd = () => {
    setIsModalOpen(true)
  }
  const handleSessionConfirmEnd = async () => {
    const currentEndDateTime = getCurrentFormattedDateTime()
    setForm(prevForm => ({
      ...prevForm,
      end_datetime: currentEndDateTime
    }))
    try {
      const response = await createSession(
        form,
      )
      setIsSessionStarted(false)
      setIsModalOpen(false)
    } catch (error) {
      console.error(error.response.data.error_description)
    }
  }
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
          title={isSessionStarted ? 'End Session' : 'Start Session'}
          handlePress={isSessionStarted ? handleSessionEnd : handleSessionStart}
          buttonStyle={`w-96 z-10 absolute bottom-10 self-center ${isSessionStarted ? 'bg-red-500' : ''}`}
          textStyle="text-white"
          isLoading={false}
        />
      </View>
      {isModalOpen && (
        <ConfirmModal
          isConfirmButton={true}
          isCancelButton={true}
          title={'Are you sure you want to end now'}
          subTitle={'test'}
          imageSource={'../../../assets/confirmModalImage.png'}
          handleCancel={() => {
            setIsModalOpen(false)
          }}
          handleConfirm={handleSessionConfirmEnd}
        />
      )}
    </SafeAreaView>
  )
}

export default Map
