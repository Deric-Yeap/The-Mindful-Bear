import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, ScrollView, TouchableOpacity } from 'react-native'
import Mapbox from '@rnmapbox/maps'
import LottieView from 'lottie-react-native'
import CustomButton from '../../../components/customButton'
import ConfirmModal from '../../../components/confirmModal'
import { getCurrentDateTime } from '../../../common/getCurrentFormattedDateTime'
import { getGeoJson } from '../../../common/getGeoJson'
import { createSession } from '../../../api/session'
import { landmarkIcon } from '../../../assets/image'
import { getLandmarks } from '../../../api/landmark'
import { confirmModal } from '../../../assets/image'
import Loading from '../../../components/loading'
import BottomSheetModal from '../../../components/bottomSheetModal'

const initialFormState = {
  start_datetime: '',
  end_datetime: '',
  pss_before: 1,
  pss_after: 1,
  physical_tiredness_before: 1,
  physical_tiredness_after: 1,
  engagement_metrics: 1,
}

const Map = () => {
  Mapbox.setAccessToken(process.env.MAPBOX_PUBLIC_KEY)
  const [form, setForm] = useState(initialFormState)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSessionStarted, setIsSessionStarted] = useState(false)
  const [landmarksData, setLandmarksData] = useState([])
  const [loading, setLoading] = useState(true)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getLandmarks()
        setLandmarksData(response)
      } catch (error) {
        console.error('Error fetching landmarks:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleBottomSheetModalOpen = () => {
    if (!isBottomSheetOpen) {
      console.log(isBottomSheetOpen)
      setIsBottomSheetOpen(true)
    } else {
      setIsBottomSheetOpen(false)
    }
  }
  const handleSessionStart = () => {
    const currentStartDateTime = getCurrentDateTime()
    setForm((prevForm) => ({
      ...prevForm,
      start_datetime: currentStartDateTime,
    }))
    setIsSessionStarted(true)
  }

  const handleSessionEnd = () => {
    setIsModalOpen(true)
  }

  const handleSessionConfirmEnd = async () => {
    const currentEndDateTime = getCurrentDateTime()
    setForm((prevForm) => {
      const updatedForm = {
        ...prevForm,
        end_datetime: currentEndDateTime,
      }
      createSession(updatedForm)
        .then(() => {
          resetForm()
          setIsSessionStarted(false)
          setIsModalOpen(false)
        })
        .catch((error) => {
          console.error(error.response?.data?.error_description)
        })

      return updatedForm
    })
  }

  const resetForm = () => {
    setForm(initialFormState)
  }

  const geoJSON = getGeoJson(landmarksData)
  return (
    <SafeAreaView className="h-full">
      <View className="flex-1 relative">
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <Loading />
          </View>
        ) : (
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View className="h-screen w-full">
              <Mapbox.MapView
                className="flex-1"
                styleURL="mapbox://styles/mapbox/streets-v12"
                requestDisallowInterceptTouchEvent={true}
                rotateEnabled={true}
              >
                <Mapbox.Camera
                  centerCoordinate={[103.8348, 1.2804]}
                  zoomLevel={17.5}
                  animationMode="flyto"
                  animationDuration={1000}
                  pitch={60}
                />
                {geoJSON.features.map((feature, index) => (
                  <Mapbox.MarkerView
                    key={index}
                    id={`marker-${index}`}
                    coordinate={feature.geometry.coordinates}
                  >
                    <TouchableOpacity
                      onPress={handleBottomSheetModalOpen}
                      className="rounded-3xl"
                    >
                      <View className="w-8 h-8 items-center justify-center p-5">
                        <LottieView
                          source={landmarkIcon}
                          className="w-14 h-14 z-20"
                          autoPlay
                        />
                      </View>
                    </TouchableOpacity>
                  </Mapbox.MarkerView>
                ))}
              </Mapbox.MapView>
            </View>
            {!isModalOpen && (
              <CustomButton
                title={isSessionStarted ? 'End Session' : 'Start Session'}
                handlePress={
                  isSessionStarted ? handleSessionEnd : handleSessionStart
                }
                buttonStyle={`w-11/12 z-10 absolute bottom-12 mb-1  self-center ${isSessionStarted ? 'bg-red-500' : ''} md:bottom-16`}
                textStyle="text-white"
              />
            )}
          </ScrollView>
        )}
        {isModalOpen && (
          <ConfirmModal
            isConfirmButton={true}
            isCancelButton={true}
            imageSource={confirmModal}
            confirmButtonTitle={'Confirm'}
            cancelButtonTitle={'Cancel'}
            title={'Are you sure you want to end now'}
            subTitle={'test'}
            handleCancel={() => {
              setIsModalOpen(false)
            }}
            handleConfirm={handleSessionConfirmEnd}
          />
        )}
        {isBottomSheetOpen && (
          <BottomSheetModal handleModalOpen={handleBottomSheetModalOpen} />
        )}
      </View>
    </SafeAreaView>
  )
}

export default Map
