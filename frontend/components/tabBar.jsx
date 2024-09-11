import React, { useEffect, useState } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { colors } from '../common/styles'
import { getMe } from '../api/user'

const TabBar = ({ state, descriptors, navigation }) => {
  const icons = {
    home: (props) => <MaterialCommunityIcons name="home" {...props} />,
    '(map)': (props) => <MaterialCommunityIcons name="map" {...props} />,
    stats: (props) => <MaterialCommunityIcons name="poll" {...props} />,
    settings: (props) => <MaterialCommunityIcons name="account" {...props} />,
    admin: (props) => <MaterialCommunityIcons name="cog" {...props} />,
  }
  //add into this list the routes that you do not want in the navbar
  const [notIncludedRoutes, setNotIncludedRoutes] = useState([
    '_sitemap',
    '+not-found',
  ])
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMe()
        if (!data.is_staff) {
          setNotIncludedRoutes((prevRoutes) => [...prevRoutes, 'admin'])
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchUser()
  }, [])

  return (
    <View className="absolute bottom-5 left-0 right-0">
      <View className="flex-row justify-between items-center py-3 bg-white rounded-full shadow-md shadow-black">
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key]
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name
          if (notIncludedRoutes.includes(route.name)) return null
          const isFocused = state.index === index
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            })

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params)
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
              onPress={onPress}
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
