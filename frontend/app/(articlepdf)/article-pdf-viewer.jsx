import React, { useEffect, useState } from 'react'
import {
  View,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import Pdf from 'react-native-pdf'
import { WebView } from 'react-native-webview'
import StatusBarComponent from '../../components/darkThemStatusBar'
import TopBrownSearchBar from '../../components/topBrownSearchBar'
import Loading from '../../components/loading'
import { colors } from '../../common/styles'
import BackButton from '../../components/backButton'
import { LandmarkBackButton } from '../../components/landmarkBackButton'

const PdfViewer = ({ pdfUrl, onClose }) => {
  const encodedPdfUrl = encodeURI(pdfUrl)

  console.log('onclose', pdfUrl.onClose)
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
  `
  const googleDocsViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(encodedPdfUrl)}&embedded=true`

  return (
    <SafeAreaView className="flex-1  bg-[#cacac9]">
      <View className=" absolute top-4 left-4 z-20">
        <BackButton onClosePdf={onClose} />
      </View>
      <Pdf
        source={{ uri: pdfUrl }}
        trustAllCerts={false}
        onLoadComplete={(numberOfPages, filePath) => {}}
        onPageChanged={(page, numberOfPages) => {}}
        onError={(error) => {
          console.log(error)
        }}
        onPressLink={(uri) => {}}
        style={styles.pdf}
        showsVerticalScrollIndicator={false}
        enablePaging={true}
        scrollEnabled={true}
        resizeMode="contain"
        spacing={0}
      />
    </SafeAreaView>
  )
}

export default PdfViewer
const styles = StyleSheet.create({
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    margin: 0,
    padding: 0,
  },
})
