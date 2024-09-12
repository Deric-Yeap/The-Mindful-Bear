import { View, Text } from 'react-native';
import { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';

import CustomButton from '../../components/customButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { audioUpload } from '../../api/journal';

const VoiceJournal = () => {
  const [selectedDocument, setSelectedDocument] = useState(null);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: false,
      });
      console.log(result);

      if (result.assets) {
        setSelectedDocument(result.assets[0]);
      } else {
        console.log('Document selection cancelled.');
      }
    } catch (error) {
      console.log('Error picking document:', error);
    }
  };

  const handleCreateJournal = async () => {
    console.log(selectedDocument)
    const formData = new FormData();
    formData.append('audio_file', {
      uri: selectedDocument.uri,
      name: selectedDocument.name,
      type: selectedDocument.mimeType, 
    });

    console.log(formData);
    try {
      const response = await audioUpload(formData);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView className="p-4">
      <Text>VoiceJournal</Text>
      <CustomButton title="Pick a document" handlePress={pickDocument} />
      {selectedDocument && <Text>{selectedDocument.uri}</Text>}

      <CustomButton title="Submit" handlePress={handleCreateJournal} />
    </SafeAreaView>
  );
};

export default VoiceJournal;