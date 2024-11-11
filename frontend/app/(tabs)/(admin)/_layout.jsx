import { Stack } from 'expo-router'

const MapLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="admin" options={{ headerShown: false }} />
      <Stack.Screen name="user-upgrade" options={{ headerShown: false }} />
    </Stack>
  )
}

export default MapLayout
