import React, { useState, useEffect } from 'react'
import { SafeAreaView, View, ScrollView, TouchableOpacity } from 'react-native'
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
import BottomSheetModal from '../../../components/maps/bottomSheetModal'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useDispatch, useSelector } from 'react-redux'
import {
  setIsShownNav,
  clearIsShownNav,
} from '../../../redux/slices/isShownNavSlice'
import UserLocationCustom from '../../../components/maps/userLocation'
import * as turf from '@turf/turf'
import { Alert } from 'react-native'

const initialFormState = {
  start_datetime: '',
  end_datetime: '',
  pss_before: 1,
  pss_after: 1,
  physical_tiredness_before: 1,
  physical_tiredness_after: 1,
  engagement_metrics: 1,
}

const POLLING_INTERVAL = 500
// const DISTANCE_THRESHOLD = 100 // Distance in meters to trigger directions fetch
const DEVIATION_THRESHOLD = 52

const Map = () => {
  Mapbox.setAccessToken(process.env.MAPBOX_PUBLIC_KEY)
  const router = useRouter()
  const { sessionStarted, formData } = useLocalSearchParams() // Get sessionStarted and formData from the params
  const [form, setForm] = useState(initialFormState)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false)  
  const [isSessionStarted, setIsSessionStarted] = useState(false)
  const [landmarksData, setLandmarksData] = useState([])
  const [loading, setLoading] = useState(true)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const [selectedLandmark, setSelectedLandmark] = useState(null)
  const [location, setLocation] = useState(null)
  const [routeGeoJSON, setRouteGeoJSON] = useState(null)
  const [centerOfLineString, setCenterOfLineString] = useState(null)
  const isShownNav = useSelector((state) => state.isShownNav).isShownNav
  const [prevLocation, setPrevLocation] = useState(null)
  const [isTraveling, setIsTraveling] = useState(false)
  const [remainingRouteGeoJSON, setRemainingRouteGeoJSON] = useState(null)
  const [hasArrived, setHasArrived] = useState(false)
  const [landmarkDistances, setLandmarkDistances] = useState([])

  const dispatch = useDispatch()

  useEffect(() => {
    if (formData) {
      setForm(JSON.parse(formData))
    }
  }, [formData])

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
    return () => {
      dispatch(clearIsShownNav())
    }
  }, [])
  useEffect(() => {
    if (isTraveling) {
      const locationInterval = setInterval(() => {
        if (location) {
          if (routeGeoJSON) {
            const route = routeGeoJSON.features[0].geometry.coordinates
            const nearestPoint = turf.nearestPointOnLine(
              turf.lineString(route),
              turf.point(location),
              { units: 'meters' }
            )
            const distanceToRoute = turf.distance(
              turf.point(location),
              nearestPoint,
              { units: 'meters' }
            )

            if (distanceToRoute > DEVIATION_THRESHOLD) {
              fetchDirections(location)
            } else {
              updateRemainingRoute(nearestPoint.geometry.coordinates)
            }
          }

          if (selectedLandmark) {
            const destinationCoords = selectedLandmark.geometry.coordinates
            const distanceToDestination = turf.distance(
              turf.point(location),
              turf.point(destinationCoords),
              { units: 'meters' }
            )

            if (distanceToDestination <= 10) {
              setHasArrived(true)
              //
              setIsTraveling(false)
              setSelectedLandmark(selectedLandmark)
              setIsBottomSheetOpen(true)
              if (isShownNav) {
                dispatch(setIsShownNav())
              }

              Alert.alert(
                'Arrival Notification',
                'You have arrived at the landmark!',
                [{ text: 'OK' }]
              )
            }
          }
          setPrevLocation(location)
        }
      }, POLLING_INTERVAL)

      return () => clearInterval(locationInterval)
    }
  }, [isTraveling, location, routeGeoJSON, selectedLandmark])

  useEffect(() => {
    if (location && geoJSON.features && geoJSON.features.length > 0) {
      const updatedDistances = geoJSON.features.map((landmark) => {
        const landmarkCoords = landmark.geometry.coordinates

        const distanceToLandmark = turf.distance(
          turf.point(location),
          turf.point(landmarkCoords),
          { units: 'meters' }
        )

        const estimatedTime = distanceToLandmark / 1.4

        return {
          landmark_id: landmark.properties.landmark_id,
          exercise_id: landmark.properties.exercise_id,
          distance: distanceToLandmark,
          estimatedTime: estimatedTime,
        }
      })

      setLandmarkDistances(updatedDistances)
    }
  }, [location, geoJSON])

  const updateRemainingRoute = (nearestPoint) => {
    const route = routeGeoJSON.features[0].geometry.coordinates
    let nearestPointIndex = -1
    for (let i = 0; i < route.length; i++) {
      const [lng, lat] = route[i]
      const [nearestLng, nearestLat] = nearestPoint

      const distanceToPoint = turf.distance(
        turf.point([lng, lat]),
        turf.point(nearestPoint),
        { units: 'meters' }
      )

      if (distanceToPoint <= 50) {
        nearestPointIndex = i
        break
      }
    }

    if (nearestPointIndex !== -1) {
      const remainingRoute = route.slice(nearestPointIndex)
      const remainingRouteGeoJSON = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: remainingRoute,
            },
          },
        ],
      }

      setRemainingRouteGeoJSON(remainingRouteGeoJSON)
    } else {
      console.error(
        'Nearest point within 50 meters not found in the route coordinates'
      )
    }
  }

  const handleBottomSheetModalOpen = (index) => {
    if (!isBottomSheetOpen) {
      setSelectedLandmark(geoJSON.features[index])
      setIsBottomSheetOpen(true)
      if (isShownNav) {
        dispatch(setIsShownNav())
      }
    }
  }

  const handleSessionStart = () => {
    const currentStartDateTime = getCurrentDateTime()
    setForm((prevForm) => {
      const updatedForm = {
        ...prevForm,
        start_datetime: currentStartDateTime,
      }
      setIsSessionStarted(true)
      // Start Session Survey
      router.push({
        pathname: '/questionaire',
        params: {
          sessionStarted: true,
          formData: JSON.stringify(updatedForm),
          start: 'true',
        },
      })

      return updatedForm
    })
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
    //End Session Survey
    router.push({
      pathname: '/questionaire',
      params: {
        sessionStarted: true,
        formData: JSON.stringify(form),
        start: 'false',
      },
    })
  }

  const resetForm = () => {
    setForm(initialFormState)
  }
  const fetchDirections = async () => {
    if (!location || !selectedLandmark) {
      console.error('Current location or selected landmark is not available.')
      return
    }
    if (!isSessionStarted) {
      handleSessionStart()
      return
    }
    const selectedLandmarkCoords = selectedLandmark.geometry.coordinates

    try {
      let response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/walking/${location[0]},${location[1]};${selectedLandmarkCoords[0]},${selectedLandmarkCoords[1]}?` +
          new URLSearchParams({
            geometries: 'geojson',
            access_token: process.env.MAPBOX_PUBLIC_KEY,
          })
      )
      console.log('direction fetched')
      let data = await response.json()
      let lineStringGeoJSON = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: data?.routes[0]?.geometry,
          },
        ],
      }
      setRouteGeoJSON(lineStringGeoJSON)
      setRemainingRouteGeoJSON(lineStringGeoJSON)

      let allCoordinates = lineStringGeoJSON?.features[0]?.geometry?.coordinates
      let featuresCenter = turf.points(allCoordinates)
      let center = turf.center(featuresCenter)
      setCenterOfLineString(center?.geometry?.coordinates)
      setIsBottomSheetOpen(false)
      if (!isShownNav) {
        dispatch(setIsShownNav())
      }
      setIsTraveling(true)
    } catch (error) {
      console.error('Error fetching route:', error)
    }
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
                  zoomLevel={17.0}
                  animationMode="flyto"
                  animationDuration={1000}
                  pitch={60}
                />
                <UserLocationCustom
                  animated={true}
                  visible={true}
                  showsUserHeadingIndicator={true}
                  setCurrentLocation={setLocation}
                />
                {geoJSON?.features?.map((feature, index) => {
                  return (
                    <Mapbox.MarkerView
                      key={index}
                      id={`marker-${index}`}
                      coordinate={feature.geometry.coordinates}
                    >
                      <TouchableOpacity
                        onPress={() => handleBottomSheetModalOpen(index)}
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
                  )
                })}
                {routeGeoJSON && (
                  <Mapbox.ShapeSource
                    id="routeSource"
                    shape={remainingRouteGeoJSON || routeGeoJSON}
                  >
                    <Mapbox.LineLayer
                      id="routeLine"
                      style={{
                        lineWidth: 5,
                        lineJoin: 'round',
                        lineColor: 'blue',
                      }}
                    />
                  </Mapbox.ShapeSource>
                )}
                {centerOfLineString && (
                  <Mapbox.Camera
                    zoomLevel={15}
                    centerCoordinate={centerOfLineString}
                  />
                )}
              </Mapbox.MapView>
            </View>
            {!isModalOpen && (
              <CustomButton
                title={isSessionStarted ? 'End Session' : 'Start Session'}
                handlePress={
                  isSessionStarted ? handleSessionEnd : handleSessionStart
                }
                buttonStyle={`w-11/12 z-10 absolute mb-1 bottom-20  self-center ${isSessionStarted ? 'bg-red-500 ' : ''} md:bottom-16`}
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
        {isCompletedModalOpen && (
          <ConfirmModal
            isConfirmButton={true}
            isCancelButton={false}
            imageSource={confirmModal}
            confirmButtonTitle={'Confirm'}
            title={'+100'}
            subTitle={'Great Job!'}
            handleConfirm={() => setIsCompletedModalOpen(false)}
          />
        )}
        {isBottomSheetOpen && selectedLandmark && (
          <BottomSheetModal
            handleModalOpen={setIsBottomSheetOpen}
            landmarkData={selectedLandmark}
            openCompletedModal={setIsCompletedModalOpen}
            handleTravel={fetchDirections}
            hasArrived={hasArrived}
            setHasArrived={setHasArrived}
            distanceTimeEst={landmarkDistances}
          />
        )}
      </View>
    </SafeAreaView>
  )
}

export default Map
