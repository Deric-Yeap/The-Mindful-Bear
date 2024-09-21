import React, { useEffect, useState } from 'react'
import {
  UserLocation,
  locationManager,
  ShapeSource,
  FillLayer,
} from '@rnmapbox/maps'
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
  const [fillOpacity, setFillOpacity] = useState(0.3)
  const interactionAreaRadius = 15

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      const opacity = 0.2 + 0.3 * ((Math.sin(now / 500) + 1) / 2) // Range from 0.2 to 0.5
      setFillOpacity(opacity)
    }, 100)

    return () => clearInterval(interval)
  }, [interactionAreaRadius])

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
      features: [
        circle(coords, interactionAreaRadius, { units: 'meters', steps: 30 }),
      ],
    }
  }

  if (!visible || !coordinates || !interactionArea) return null

  return (
    <>
      <UserLocation
        visible={true}
        androidRenderMode={'compass'}
        showsUserHeadingIndicator={true}
        onUpdate={(newLocation) => {}}
      />

      <ShapeSource id="interactionArea" shape={interactionArea}>
        <FillLayer
          id="interactionAreaFillLayer"
          style={{
            fillColor: 'rgba(0, 119, 238, 0.7)',
            fillOpacity: fillOpacity,
            fillOutlineColor: 'rgba(0, 119, 238, 0.9)',
          }}
        />
      </ShapeSource>
    </>
  )
}

export default UserLocationCustom
