import React, { useState } from "react";
import { View, Image, TouchableOpacity, Text } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import BackButton from '../components/backButton';

function ImageUploader() {
  const [imageUrl, setImageUrl] = useState("");

  const handleImageUpload = async () => {
    // Ask for permission to access the camera roll
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setImageUrl(pickerResult.uri);
    }
  };

  return (
    <View className="flex flex-col items-center">
      {imageUrl ? (
        <>
          <Image
            source={{ uri: imageUrl }}
            style={{ width: 328, height: 328, borderRadius: 60 }}
            className="object-contain"
          />
          <TouchableOpacity
            className="relative self-end px-3.5 py-1 mt-72 rounded-3xl bg-stone-700 text-white"
            onPress={handleImageUpload}
          >
            <Text>Upload Image</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View className="flex flex-col items-center justify-center w-[328px] h-[328px] border-2 border-dashed border-gray-300 rounded-[60px]">
          <TouchableOpacity
            className="px-3.5 py-1 rounded-3xl bg-stone-700 text-white"
            onPress={handleImageUpload}
          >
            <Text>Upload Image</Text>
          </TouchableOpacity>
        </View>
      )}
      <BackButton />
    </View>
  );
}

export default ImageUploader;


// import React, { useState } from "react";
// import BackButton from '../components/backButton';

// function ImageUploader() {
//   const [imageUrl, setImageUrl] = useState("");

//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImageUrl(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center">
//       {imageUrl ? (
//         <>
//           <img
//             loading="lazy"
//             src={imageUrl}
//             alt="Landmark preview"
//             className="object-contain aspect-[16.39] rounded-[60px] w-[328px]"
//           />
//           <button
//             className="relative self-end px-3.5 py-1 mt-72 rounded-3xl bg-stone-700 text-white"
//             onClick={() => document.getElementById('image-upload').click()}
//           >
//             Upload Image
//           </button>
//         </>
//       ) : (
//         <div className="flex flex-col items-center justify-center w-[328px] h-[328px] border-2 border-dashed border-gray-300 rounded-[60px]">
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleImageUpload}
//             className="hidden"
//             id="image-upload"
//           />
//           <label htmlFor="image-upload" className="cursor-pointer">
//             <button className="px-3.5 py-1 rounded-3xl bg-stone-700 text-white">
//               Upload Image
//             </button>
//           </label>
//         </div>
//       )}
//       <BackButton />
//     </div>
//   );
// }

// export default ImageUploader;