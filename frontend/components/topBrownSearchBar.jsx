import React, { useState } from 'react'
import { View, TextInput, TouchableOpacity, Text } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import BackButton from '../components/backButton'
import { useNavigation } from '@react-navigation/native'
import { featureFlags } from '../common/featureFlags'

const TopBrownSearchBar = ({ title, value, onChangeText, onSearch, showBackButton = true, showSearchBar = true }) => {
  const navigation = useNavigation()
  const [searchTerm, setSearchTerm] = useState(value)

  const handleSearch = () => {
    onSearch(searchTerm)
  }

  return (
    <View className={`bg-mindful-brown-100 ${showSearchBar ? 'p-4 pt-2' : 'p-6 pt-4'} rounded-b-[32]`}>
       {showBackButton ? (
        <BackButton title={title} />
      ) : (
        <Text className="text-xl font-semibold text-white mb-2">{title}</Text>
      )}
      {featureFlags.isSearchBar && showSearchBar && (
        <View className="flex-row items-center mt-4">
          <TextInput
            placeholder="Search anything..."
            placeholderTextColor="#F7F4F2"
            value={searchTerm}
            onChangeText={(text) => {
              setSearchTerm(text)
              onChangeText(text)
            }}
            onSubmitEditing={handleSearch}
            className="flex-1 bg-mindful-brown-70 p-3 rounded-full text-white"
          />
          <TouchableOpacity
            className="ml-2 p-3 bg-mindful-brown-80 rounded-full"
            onPress={handleSearch}
          >
            <MaterialIcons name="search" size={24} color="#F7F4F2" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

export default TopBrownSearchBar