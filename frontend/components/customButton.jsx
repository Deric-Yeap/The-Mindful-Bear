import { TouchableOpacity, Text, View } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

const CustomButton = ({
  title,
  handlePress,
  buttonStyle,
  textStyle,
  iconName,
  isLoading,
}) => {
  return (
    <View className={buttonStyle}>
      <TouchableOpacity
        className={`bg-mindful-brown-80 rounded-full min-h-[50px] flex flex-row justify-center items-center ${buttonStyle} ${isLoading ? 'opacity-50' : ''}`}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Text
          className={`font-urbanist-semi-bold text-lg mr-4 text-white ${textStyle}`}
        >
          {title}
        </Text>
        {iconName && (
          <MaterialCommunityIcons name={iconName} size={24} color="white" />
        )}
      </TouchableOpacity>
    </View>
  )
}

export default CustomButton
