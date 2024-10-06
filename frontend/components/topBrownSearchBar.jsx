import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import BackButton from '../components/backButton'
import { useNavigation } from '@react-navigation/native'
import { featureFlags } from '../common/featureFlags'

const TopBrownSearchBar = ({ title }) => {
  const navigation = useNavigation()
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = () => {
    console.log(searchTerm)
  }

  return (
    <View className="bg-mindful-brown-100 p-4 pt-2 rounded-b-[32]">
      <BackButton title={title} />
      {featureFlags.isSearchBar && (
        <View className="flex-row items-center mt-4">
          <TextInput
            placeholder="Search anything..."
            placeholderTextColor="#F7F4F2"
            value={searchTerm}
            onChangeText={setSearchTerm}
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
