import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import BackButton from '../../components/backButton';
import { colors } from '../../common/styles';

const ExerciseManagement = () => {
  const handleExercisePress = (exercise) => {
    console.log(`Navigating to details for ${exercise}`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.optimisticGray10 }}>

      <ScrollView style={{ flex: 1, backgroundColor: colors.optimisticGray10, borderRadius: 40 }}>

        <View style={{ backgroundColor: colors.mindfulBrown, padding: 16, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}>
          <BackButton title="Exercise Management" />
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 16 }}>
            <TextInput
              placeholder="Search anything..."
              placeholderTextColor={colors.optimisticGray10}
              style={{ flex: 1, backgroundColor: colors.mindfulBrown70, padding: 12, borderRadius: 50, color: colors.mindfulBrown10 }}
            />
            <TouchableOpacity style={{ marginLeft: 8, padding: 12, backgroundColor: colors.mindfulBrown80, borderRadius: 50 }}>
              <MaterialIcons name="search" size={24} color={colors.mindfulBrown10} />
            </TouchableOpacity>
          </View>
        </View>

        
        <View style={{ flex: 1, paddingHorizontal: 16, marginTop: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Text style={{ fontSize: 24, color: colors.mindfulBrown70, fontWeight: "700" }}>Exercises</Text>
            <TouchableOpacity style={{ paddingVertical: 5, paddingHorizontal: 12, backgroundColor: colors.mindfulBrown70, borderRadius: 15 }}>
              <Text style={{ fontSize: 14, color: colors.optimisticGray10, fontWeight: "600" }}>Create New Exercise</Text>
            </TouchableOpacity>
          </View>

          {['Exercise 1', 'Exercise 2', 'Exercise 3'].map((exercise, index) => (
            <TouchableOpacity 
              key={index} 
              style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.serenityGreen50, borderRadius: 15, paddingVertical: 16, paddingHorizontal: 17, marginBottom: 23 }}
              onPress={() => handleExercisePress(exercise)}
            >
              <Text style={{ color: colors.mindfulBrown10, fontSize: 16, marginRight: 4 }}>{exercise}</Text>
              <MaterialIcons
                name="chevron-right"
                size={24}
                color={colors.serenityGreen70}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 80 }} />
        
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExerciseManagement;
