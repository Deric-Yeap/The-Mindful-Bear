import { Tabs } from 'expo-router'
import TabBar from '../../components/tabBar'

const TabsLayout = () => {
  var TabsScreens = {
    home: 'Home',
    '(map)': 'Map',
    stats: 'Stats',
    settings: 'Settings',   
    admin: 'Admin', 
  }

  
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {Object.entries(TabsScreens).map(([name, title]) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: title,
            headerShown: false,
          }}
        />
      ))}
    </Tabs>
  )
}

export default TabsLayout
