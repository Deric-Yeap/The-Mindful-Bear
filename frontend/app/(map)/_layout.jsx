import { Stack } from 'expo-router'


const MapLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="maps" options={{ headerShown: false }} />
      </Stack>
    </>
  )
}

export default MapLayout
