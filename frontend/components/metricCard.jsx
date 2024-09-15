import { View, Text, TouchableOpacity } from 'react-native'
import { Link } from 'expo-router'
import { Image } from 'expo-image';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

const MetricCard = ({
  route,
  iconName,
  iconColor,
  circleStyle,
  title,
  rightImage,
  children,
}) => {
  return (
    <Link href={route} asChild>
      <TouchableOpacity className="bg-white p-4 rounded-3xl shadow-2xl mb-4">
        <View className="flex-row items-center justify-between">
          <View
            className={`w-16 h-16 rounded-full bg-serenity-green-20 flex items-center justify-center ${circleStyle}`}
          >
            <MaterialCommunityIcons
              name={iconName}
              size={30}
              color={iconColor}
            />
          </View>
          <View className="flex-1 ml-4">
            <Text className="font-urbanist-extra-bold text-mindful-brown-80 text-xl">
              {title}
            </Text>
            {children}
          </View>
          {rightImage && (
            <Image source={rightImage}
            className="w-16 h-16"
            />
          )}
        </View>
      </TouchableOpacity>
    </Link>
  )
}

export default MetricCard
