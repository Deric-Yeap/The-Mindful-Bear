import React, { useEffect, useState } from 'react'
import { UserLocation, locationManager } from '@rnmapbox/maps'
import circle from '@turf/circle'
import * as Location from 'expo-location'

const UserLocationCustom = ({
  visible = true,
  minDisplacement = 100,
  renderMode = 'normal',
  onUpdate,
}) => {
  const [coordinates, setCoordinates] = useState(null)
  const [lastCoordinates, setLastCoordinates] = useState(null)
  const [interactionArea, setInteractionArea] = useState(null)

  useEffect(() => {
    const requestPermissions = async () => {
      const { status: foregroundStatus } =
        await Location.requestForegroundPermissionsAsync()
      const { status: backgroundStatus } =
        await Location.requestBackgroundPermissionsAsync()

      if (foregroundStatus !== 'granted' || backgroundStatus !== 'granted') {
        alert('Location permission is required to use this feature.')
        return
      }

      initLocationManager()
    }

    const initLocationManager = async () => {
      if (renderMode === 'native') return

      await locationManager.setMinDisplacement(minDisplacement)
      const location = await locationManager.getLastKnownLocation()
      onLocationUpdate(location)
      locationManager.addListener(onLocationUpdate)
    }

    requestPermissions()

    return () => {
      locationManager.removeListener(onLocationUpdate)
    }
  }, [minDisplacement, renderMode])

  const onLocationUpdate = (location) => {
    if (!location || !location.coords) return

    const { longitude, latitude } = location.coords
    const currentCoordinates = [longitude, latitude]

    if (
      !lastCoordinates ||
      lastCoordinates[0] !== longitude ||
      lastCoordinates[1] !== latitude
    ) {
      setInteractionArea(generateInteractionArea(currentCoordinates))
    }

    setCoordinates(currentCoordinates)
    setLastCoordinates(currentCoordinates)

    if (onUpdate) onUpdate(location)
  }

  const generateInteractionArea = (coords) => {
    return {
      type: 'FeatureCollection',
      features: [circle(coords, 25, { units: 'meters', steps: 30 })],
    }
  }

  if (!visible || !coordinates) return null

  return (
    <UserLocation
      visible={true}
      androidRenderMode={'compass'}
      showsUserHeadingIndicator={true}
      onUpdate={(newLocation) => {}}
    />
  )
}

export default UserLocationCustom
