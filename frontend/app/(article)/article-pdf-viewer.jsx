import React, { useEffect, useState} from 'react';
import { View, SafeAreaView, ActivityIndicator, ScrollView, TouchableOpacity, Text,} from 'react-native';
// import PDFView from 'react-native-pdf';
import { WebView } from 'react-native-webview';
import StatusBarComponent from '../../components/darkThemStatusBar';
import TopBrownSearchBar from '../../components/topBrownSearchBar';
import Loading from '../../components/loading';
import { colors } from '../../common/styles';
import { BackButton } from '../../components/backButton';
import { LandmarkBackButton } from '../../components/landmarkBackButton';


const PdfViewer = ({ pdfUrl,onClose }) => {
  const encodedPdfUrl = encodeURI(pdfUrl);

  console.log('onclose', pdfUrl.onClose);
  console.log('Encoded PDF URL:', encodedPdfUrl)
  const injectedJavaScript = `
  const meta = document.createElement('meta');
  meta.setAttribute('name', 'viewport');
  meta.setAttribute('content', 'width=device-width, initial-scale=1, user-scalable=no');
  document.head.appendChild(meta);

  document.body.style.display = 'flex';
  document.body.style.justifyContent = 'center';
  document.body.style.alignItems = 'center';
  document.body.style.padding = '0';
  document.body.style.margin = '0';
  document.documentElement.style.height = '100%';
  document.body.style.height = '100%';
  true;
  `;
  const googleDocsViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(encodedPdfUrl)}&embedded=true`;
  console.log('Google Docs Viewer URL:', googleDocsViewerUrl);
  // useEffect(() => {
  //   console.log('PDF URL:', pdfUrl.pdfUrl);
    
    
  // }, [pdfUrl]);
  

  
  return (
    <SafeAreaView className="flex-1  bg-[#cacac9]">
    <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
      <StatusBarComponent barStyle="light-content" backgroundColor="#251404" />
      
      <TopBrownSearchBar title="Article Display" />
      <TouchableOpacity className="absolute left-4 top-2 z-10 bg-mindful-brown-80 p-3 rounded-full opacity-0" onPress={onClose}>
        <Text className="text-white text-lg font-bold">      </Text>
    </TouchableOpacity>
      
    <SafeAreaView className="flex-1 bg-white">
    
      <WebView
        source={{ uri: googleDocsViewerUrl }}
        style={{ flex: 1 , width:'100%' }}
        scalesPageToFit={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onLoad={() => console.log('PDF loaded')}
        onError={(error) => console.log('Cannot load PDF', error)}
        startInLoadingState={true}
        injectedJavaScript={injectedJavaScript}
        renderLoading={() => <ActivityIndicator size="large" color="#0000ff" 
  />}
        />
    </SafeAreaView>
    </ScrollView>
    </SafeAreaView>
  );
};

export default PdfViewer;

