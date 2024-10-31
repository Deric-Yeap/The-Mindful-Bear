import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../common/styles';

const ArticleCard = ({ route, title, imageSource, description, category}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => navigation.navigate(route)}
    >
      {/* Pill Badge */}
      <View style={styles.pillBadge}>
        <Text style={styles.pillText}>{category}</Text>
      </View>

      <Image source={imageSource} style={styles.image} resizeMode="cover" />
      <View style={styles.cardBody}>
        <View style={styles.row}>
          <Text style={styles.cardTitle} className="text-mindfulbrown-80">{title}</Text>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons 
              name="arrow-right-bold" 
              size={24} 
              color={colors.mindfulBrown80}
            />
          </View>
        </View>
        <Text style={styles.description}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginVertical: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
  },
  pillBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  pillText: {
    color: '#251404',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  image: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cardBody: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
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
  iconContainer: {
    marginLeft: 8,
    backgroundColor: '#F8F5F1',
    width: 50,
    height: 50,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    marginTop: 10,
    textAlign: 'center',
    color: '#666',
  },
});

export default ArticleCard;