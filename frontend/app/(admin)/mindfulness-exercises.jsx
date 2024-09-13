import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { format, parseISO } from 'date-fns'; 
import { getExercises } from '../../api/user';

const groupExercisesByMonth = (exercises) => {
  return exercises.reduce((acc, exercise) => {
    const date = parseISO(exercise.start_datetime);
    const monthYear = format(date, 'MMMM yyyy'); // Group by month and year

    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }

    acc[monthYear].push(exercise);
    return acc;
  }, {});
};

const ExerciseHistory = () => {
  const [groupedExercises, setGroupedExercises] = useState({});

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await getExercises();
        const groupedData = groupExercisesByMonth(data);
        setGroupedExercises(groupedData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchExercises();
  }, []);

  return (
    <ScrollView className="bg-optimistic-gray-10 flex-1 p-4">
      <Text className="text-mindful-brown-100 font-urbanist-extra-bold text-2xl mb-4">
        Completed Exercises
      </Text>

      {Object.keys(groupedExercises).map((monthYear) => (
        <View key={monthYear}>
          {/* Group Heading - Month and Year */}
          <Text className="text-mindful-brown-100 font-urbanist-extra-bold text-lg mb-4">
            {monthYear}
          </Text>

          {groupedExercises[monthYear].map((exercise) => (
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
                Completed on: {format(parseISO(exercise.start_datetime), 'PPP p')}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

export default ExerciseHistory;
