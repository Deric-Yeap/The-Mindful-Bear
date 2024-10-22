import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ArticleCard = ({ route, title, imageSource, description }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => navigation.navigate(route)}
    >
      <Image source={imageSource} style={styles.image} resizeMode="cover" />
      <View style={styles.cardBody}>
        <View style={styles.row}>
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
        <Text style={styles.description}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'rgba(226, 226, 226, 0.3)', // More transparent
    borderRadius: 20,
    marginVertical: 10,
    overflow: 'hidden',
    elevation: 5, // For Android shadow
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.3, // Shadow opacity
    shadowRadius: 4, // Shadow blur radius
  },
  image: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cardBody: {
    // Set a solid background color temporarily for testing
    backgroundColor: '#E2E2E2', // Temporary solid color for testing
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10, // Added vertical padding
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  cardTitle: {
   paddingVertical: 10,
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  description: {
    marginTop: 10,
    textAlign: 'center',
    color: '#666',
  },
});

export default ArticleCard;
