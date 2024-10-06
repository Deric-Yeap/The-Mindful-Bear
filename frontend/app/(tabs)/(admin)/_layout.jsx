import { Stack } from 'expo-router'

const MapLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="admin" options={{ headerShown: false }} />
    </Stack>
  )
}

export default MapLayout
