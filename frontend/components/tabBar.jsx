import React, { useEffect, useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { colors } from '../common/styles'
import { getMe } from '../api/user'
import { useSelector } from 'react-redux'
import { featureFlags } from '../common/featureFlags'

const TabBar = ({ state, descriptors, navigation }) => {
  const icons = {
    home: (props) => <MaterialCommunityIcons name="home" {...props} />,
    '(map)': (props) => <MaterialCommunityIcons name="map" {...props} />,
    stats: (props) => <MaterialCommunityIcons name="poll" {...props} />,
    settings: (props) => <MaterialCommunityIcons name="cog" {...props} />,
    '(admin)': (props) => <MaterialCommunityIcons name="account" {...props} />,
  }

  const user = useSelector((state) => state.user)
  const [notIncludedRoutes, setNotIncludedRoutes] = useState([
    '_sitemap',
    '+not-found',
    '(admin)',
  ])

  const isShownNav = useSelector((state) => state.isShownNav).isShownNav

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!user.isStaff) {
          setNotIncludedRoutes((prevRoutes) => [...prevRoutes, 'admin'])
        } else {
          setNotIncludedRoutes((prevRoutes) => [...prevRoutes, '(map)'])
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchUser()
  }, [user.isStaff])

  // Check if the settings tab should be included

  return (
    <View className="absolute bottom-5 left-0 right-0">
      <View
        className={`flex-row justify-between items-center py-3 bg-white rounded-full shadow-md shadow-black ${isShownNav ? '' : 'hidden'}`}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key]
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name

          if (
            notIncludedRoutes.includes(route.name) ||
            (route.name === 'settings' && !featureFlags.isSettings)
          ) {
            return null
          }

          const isFocused = state.index === index
          const handleNavigation = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            })

            if (!isFocused && !event.defaultPrevented) {
              if (route.name === 'home') {
                navigation.navigate(user.isStaff ? '(admin)' : 'home')
              } else {
                navigation.navigate(route.name, route.params)
              }
            }
          }

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            })
          }

          return (
            <TouchableOpacity
              key={route.name}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={handleNavigation}
              onLongPress={onLongPress}
              className="flex-1 items-center"
            >
              {icons[route.name]({
                size: 25,
                color: isFocused
                  ? colors.optimisticGray90
                  : colors.optimisticGray30,
              })}
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

export default TabBar
