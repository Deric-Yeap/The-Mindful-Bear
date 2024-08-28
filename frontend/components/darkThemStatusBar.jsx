import React from 'react';
import { StatusBar } from 'react-native';

const StatusBarComponent = ({ barStyle = 'light-content', backgroundColor = '#251404' }) => {
  return (
    <StatusBar
      barStyle={barStyle}
      backgroundColor={backgroundColor}
    />
  );
};

export default StatusBarComponent;