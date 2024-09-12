import { React, useState, useEffect } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { format } from 'date-fns'; 
import { getExercises } from '../../api/user';

const ExerciseHistory = () => {
  const [exercises, setExercises] = useState([])
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await getExercises()
        setExercises(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchExercises()
  }, [])

  return (
    <ScrollView className="bg-optimistic-gray-10 flex-1 p-4">
      <Text className="text-mindful-brown-100 font-urbanist-bold text-xl mb-4">
        Completed Exercises
      </Text>

      {exercises.map((exercise, index) => (
        <View key={exercise.exercise_id} className="bg-white rounded-3xl p-4 mb-4 shadow">
          {/* Exercise Name */}
          <Text className="text-mindful-brown-100 font-urbanist-bold text-xl mb-2">
            {exercise.exercise_name}
          </Text>

          {/* Description */}
          <Text className="text-optimistic-gray-70 font-urbanist-bold text-base mb-2">
            {exercise.description}
          </Text>

          {/* Start DateTime */}
          <Text className="text-serenity-green-70 font-urbanist-bold text-sm">
            Completed on: {format(new Date(exercise.start_datetime), 'PPP p')}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default ExerciseHistory;
