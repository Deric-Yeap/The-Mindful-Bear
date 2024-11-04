import { Stack } from 'expo-router'

const ShopLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="fragmentShop" options={{ headerShown: false }} />
    </Stack>
  )
}

export default ShopLayout
