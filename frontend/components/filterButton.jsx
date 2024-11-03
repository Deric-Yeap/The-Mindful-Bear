import { TouchableOpacity, Text } from 'react-native';
import { colors } from '../common/styles';

const FilterButton = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          width: 80, // Match the width of the filter boxes
          height: 40, // Match the height of the filter boxes
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 8, // Rounded corners
          backgroundColor: colors.mindfulBrown60, // Solid brown background color
        },
        style, // Apply additional styles if needed
      ]}
      activeOpacity={0.8}
    >
      <Text style={{
        fontSize: 16,
        fontWeight: '500',
        color: 'white', // White text for contrast against the brown background
      }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default FilterButton;
