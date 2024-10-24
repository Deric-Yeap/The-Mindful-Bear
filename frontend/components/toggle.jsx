import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const CustomSwitch = ({
  navigation,
  selectionMode,
  roundCorner,
  option1,
  option2,
  option3, 
  onSelectSwitch,
  selectionColor
}) => {
  const [getSelectionMode, setSelectionMode] = useState(selectionMode);
  const [getRoundCorner, setRoundCorner] = useState(roundCorner);

  const updatedSwitchData = val => {
    setSelectionMode(val);
    onSelectSwitch(val);
  };

  return (
    <View style={{ width: '100%' }}> 
      <View
        style={{
          height: 44,
          width: '100%', // Set width to full
          backgroundColor: 'white',
          borderRadius: getRoundCorner ? 25 : 0,
          borderWidth: 1,
          borderColor: selectionColor,
          flexDirection: 'row',
          justifyContent: 'center',
          padding: 2,
        }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => updatedSwitchData(1)}
          style={{
            flex: 1,
            backgroundColor: getSelectionMode === 1 ? selectionColor : 'white',
            borderRadius: getRoundCorner ? 25 : 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: getSelectionMode === 1 ? 'white' : selectionColor,
            }}>
            {option1}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => updatedSwitchData(2)}
          style={{
            flex: 1,
            backgroundColor: getSelectionMode === 2 ? selectionColor : 'white',
            borderRadius: getRoundCorner ? 25 : 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: getSelectionMode === 2 ? 'white' : selectionColor,
            }}>
            {option2}
          </Text>
        </TouchableOpacity>

   
        {option3 && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => updatedSwitchData(3)}
            style={{
              flex: 1,
              backgroundColor: getSelectionMode === 3 ? selectionColor : 'white',
              borderRadius: getRoundCorner ? 25 : 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: getSelectionMode === 3 ? 'white' : selectionColor,
              }}>
              {option3}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CustomSwitch;