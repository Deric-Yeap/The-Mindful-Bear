import React from 'react';
import { SafeAreaView, ActivityIndicator } from 'react-native';
// import PDFView from 'react-native-pdf';
import { WebView } from 'react-native-webview';
import StatusBarComponent from '../../components/darkThemStatusBar';
import TopBrownSearchBar from '../../components/topBrownSearchBar';


const PdfViewer = (pdfUrl,onClose) => {
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f5f1' }}>
    <ScrollView style={{ marginBottom: 48 }}>
      <StatusBarComponent barStyle="light-content" backgroundColor="#251404" />
      <TopBrownSearchBar title="Article Display" />
    <SafeAreaView className="flex-1 bg-white">
    <TouchableOpacity className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 rounded-full p-2" onPress={onClose}>
        <Text className="text-white text-lg font-bold">X</Text>
    </TouchableOpacity>
      {/* <WebView
        source={{ uri: pdfUrl }}
        className="flex-1 w-full h-full"
        onLoad={() => console.log('PDF loaded')}
        onError={(error) => console.log('Cannot load PDF', error)}
        startInLoadingState={true}
        activityIndicator={<ActivityIndicator size="large" color="#0000ff" />}
      /> */}
    </SafeAreaView>
    </ScrollView>
    </SafeAreaView>
  );
};

export default PdfViewer;

