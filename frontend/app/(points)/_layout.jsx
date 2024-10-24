import { Stack } from 'expo-router'

const PointsLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="points-history" options={{ headerShown: false }} />
      </Stack>
    </>
  )
}

export default PointsLayout
