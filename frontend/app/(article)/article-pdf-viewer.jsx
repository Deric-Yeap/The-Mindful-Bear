import React, { useEffect } from 'react';
import { SafeAreaView, ActivityIndicator, ScrollView, TouchableOpacity, Text} from 'react-native';
// import PDFView from 'react-native-pdf';
import { WebView } from 'react-native-webview';
import StatusBarComponent from '../../components/darkThemStatusBar';
import TopBrownSearchBar from '../../components/topBrownSearchBar';


const PdfViewer = (pdfUrl,onClose) => {
  const encodedPdfUrl = encodeURI(pdfUrl.pdfUrl);
  console.log('onclose', pdfUrl.onClose);
  console.log('Encoded PDF URL:', encodedPdfUrl);
  const googleDocsViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl.pdfUrl)}&embedded=true`;
  console.log('Google Docs Viewer URL:', googleDocsViewerUrl);
  useEffect(() => {
    console.log('PDF URL:', pdfUrl.pdfUrl);
    
  }, [pdfUrl]);
  
  return (
    <SafeAreaView className="flex-1 bg-f8f5f1">
    <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
      <StatusBarComponent barStyle="light-content" backgroundColor="#251404" />
      <TopBrownSearchBar title="Article Display" />
    <SafeAreaView className="flex-1 bg-white">
    <TouchableOpacity className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 rounded-full p-2" onPress={pdfUrl.onClose}>
        <Text className="text-white text-lg font-bold">X</Text>
    </TouchableOpacity>
      <WebView
        source={{ uri: googleDocsViewerUrl }}
        style={{ flex: 1 }}
        scalesPageToFit={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onLoad={() => console.log('PDF loaded')}
        onError={(error) => console.log('Cannot load PDF', error)}
        startInLoadingState={true}
        renderLoading={() => <ActivityIndicator size="large" color="#0000ff" />}
        />
    </SafeAreaView>
    </ScrollView>
    </SafeAreaView>
  );
};

export default PdfViewer;

