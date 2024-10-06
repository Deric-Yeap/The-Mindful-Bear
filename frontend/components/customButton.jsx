import { TouchableOpacity, Text, View } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { colors } from '../common/styles'

const CustomButton = ({
  title,
  handlePress,
  buttonStyle,
  textStyle,
  iconName,
  iconSize,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      className={`bg-mindful-brown-80 rounded-full min-h-[50px] flex flex-row justify-center items-center ${buttonStyle} ${isLoading ? 'opacity-50' : ''}`}
      style={{ shadowColor: colors.mindfulBrown100 }}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {title && (
        <Text
          className={`font-urbanist-semi-bold text-lg ${iconName ? 'mr-4' : ''} text-white ${textStyle}`}
        >
          {title}
        </Text>
      )}
      {iconName && (
        <MaterialCommunityIcons
          name={iconName}
          size={iconSize || 24}
          color="white"
          style={{
            marginLeft: title ? 0 : 'auto',
            marginRight: title ? 0 : 'auto',
          }}
        />
      )}
    </TouchableOpacity>
  )
}

export default CustomButton
