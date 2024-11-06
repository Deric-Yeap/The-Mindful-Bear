import { Stack } from 'expo-router'

const ArticleLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="article-discovery"
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="article-result"
        options={{ headerShown: false }}
      />
    </Stack>
  )
}

export default ArticleLayout