import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const StatusBarComponent = ({ barStyle, backgroundColor }) => {
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle(barStyle);
      StatusBar.setBackgroundColor(backgroundColor);
    }, [barStyle, backgroundColor])
  );

  return null; 
};


export default StatusBarComponent
