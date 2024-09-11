import { Stack } from 'expo-router'

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
        <Stack.Screen name="password-reset" options={{ headerShown: false }} />
        <Stack.Screen
          name="password-confirm"
          options={{ headerShown: false }}
        />
      </Stack>
    </>
  )
}

export default AuthLayout
