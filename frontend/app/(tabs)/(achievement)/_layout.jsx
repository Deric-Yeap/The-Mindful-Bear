import { Stack } from 'expo-router'

const AchievementLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="achievement" options={{ headerShown: false }} />
    </Stack>
  )
}

export default AchievementLayout
