import { Stack } from 'expo-router'

const JournalLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="journal-home" options={{ headerShown: false }} />
        <Stack.Screen name="journal-type-select" options={{ headerShown: false }} />
        <Stack.Screen name="voice-journal" options={{ headerShown: false }} />
        <Stack.Screen name="text-journal" options={{ headerShown: false }} />
        <Stack.Screen name="journal-history" options={{ headerShown: false }} />
        <Stack.Screen name="[id]" options={{ headerShown: false }} />
        
      </Stack>
    </>
  )
}

export default JournalLayout