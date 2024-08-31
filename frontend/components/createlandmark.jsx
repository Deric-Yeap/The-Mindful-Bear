// import React, { useState } from 'react';
// import { View, TextInput, Button } from 'react-native';
// import { createLandmark } from '../api/landmark';

// const CreateLandmarkScreen = () => {
//   const [name, setName] = useState('');
//   const [description, setDescription] = useState('');

//   const handleCreateLandmark = () => {
//     const landmarkData = { name, description };
//     createLandmark(landmarkData);
//   };

//   return (
//     <View>
//       <TextInput
//         placeholder="Name"
//         value={name}
//         onChangeText={setName}
//       />
//       <TextInput
//         placeholder="Description"
//         value={description}
//         onChangeText={setDescription}
//       />
//       <Button
//         title="Create Landmark"
//         onPress={handleCreateLandmark}
//       />
//     </View>
//   );
// };

// export default CreateLandmarkScreen;