import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BrownPageTitlePortion from '../../components/brownPageTitlePortion'; 
import StatusBarComponent from '../../components/darkThemStatusBar'; 

const CreateForm = () => {
  const [userState, setUserState] = useState([
    { name: 'Shaun', key: '1' },
    { name: 'Yoshi', key: '2' },
    { name: 'Mario', key: '3' },
    { name: 'Luigi', key: '4' },
    { name: 'Hui Min', key: '5' },
  ]);

  return (
    <SafeAreaView className="flex-1 bg-optimistic-gray-10">
       <StatusBarComponent barStyle="light-content" backgroundColor="#251404" />
       <BrownPageTitlePortion title="Form Management" />
      
    </SafeAreaView>
  );
};

export default CreateForm;