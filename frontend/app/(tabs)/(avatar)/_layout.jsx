import { Stack } from 'expo-router'

const MapLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="avatar" options={{ headerShown: false }} />
    </Stack>
  )
}

export default MapLayout
