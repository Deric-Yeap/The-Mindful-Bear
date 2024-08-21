import { Tabs } from 'expo-router'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const TabsLayout = () => {
  return (
    <>
      <Tabs>
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size, focused }) => (
                <MaterialCommunityIcons name={"home"} size={size} color={color}/>
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size, focused }) => (
                <MaterialCommunityIcons name={"account"} size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  )
}

export default TabsLayout
