import { Stack } from 'expo-router'

const AvatarLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="avatar" options={{ headerShown: false }} />
    </Stack>
  )
}

export default AvatarLayout
