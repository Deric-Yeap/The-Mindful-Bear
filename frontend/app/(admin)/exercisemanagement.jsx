import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import BackButton from '../../components/backButton';  // Adjust the import path if needed
import { getExercises } from '../../api/exercise';  // Import the new API function

const ExerciseManagement = () => {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await getExercises();
        setExercises(data);
      } catch (error) {
        console.error('Failed to load exercises:', error);
      }
    };

    fetchExercises();
  }, []);

  const handleExercisePress = (exercise) => {
    // Handle navigation to the exercise details page
    console.log(`Navigating to details for ${exercise}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <BackButton title="Exercise Management" />
          <View style={styles.searchBar}>
            <TextInput
              placeholder="Search anything..."
              placeholderTextColor="#F7F4F2"
              style={styles.searchInput}
            />
            <TouchableOpacity style={styles.searchIconContainer}>
              <MaterialIcons name="search" size={24} color="#F7F4F2" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <View style={styles.contentHeader}>
            <Text style={styles.sectionTitle}>Exercises</Text>
            <TouchableOpacity style={styles.createExerciseButton}>
              <Text style={styles.createExerciseText}>Create New Exercise</Text>
            </TouchableOpacity>
          </View>

          {exercises.map((exercise, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.exerciseCard} 
              onPress={() => handleExercisePress(exercise.exercise_name)}
            >
              <Text style={styles.exerciseText}>{exercise.exercise_name}</Text>
              <MaterialIcons
                name="chevron-right"
                size={24}
                color="#FFFFFF"
                style={styles.exerciseIcon}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Placeholder for footer image */}
        <View style={styles.footerPlaceholder} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F4F2",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#F7F4F2",
    borderRadius: 40,
  },
  headerContainer: {
    backgroundColor: "#4F3422",
    padding: 10,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#6D4C41",
    padding: 12,
    borderRadius: 50,
    color: "#F7F4F2",
  },
  searchIconContainer: {
    marginLeft: 8,
    padding: 12,
    backgroundColor: "#5D4037",
    borderRadius: 50,
  },
  contentSection: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 20,
  },
  contentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 24,
    color: "#4F3422", // Dark brown color
    fontWeight: "700",
  },
  createExerciseButton: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    backgroundColor: "#4E3321",
    borderRadius: 15,
  },
  createExerciseText: {
    fontSize: 14,
    color: "#F7F4F2",
    fontWeight: "600",
  },
  exerciseCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Align arrow with text
    backgroundColor: "#9BB167",
    borderRadius: 15,
    paddingVertical: 16,
    paddingHorizontal: 17,
    marginBottom: 23,
    shadowColor: "#9BB06826",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 16 },
    shadowRadius: 32,
    elevation: 32,
  },
  exerciseText: {
    color: "#F7F4F2",
    fontSize: 16,
    marginRight: 4,
  },
  exerciseIcon: {
    // Aligned naturally with the text due to flex settings
  },
  footerPlaceholder: {
    height: 80,
  },
});

export default ExerciseManagement;
