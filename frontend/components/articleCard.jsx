import React, { useState }from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';


const ArticleCard = ({ title, imageSource, description, uri,id }) => {
  const [showPdfViewer, setShowPdfViewer] = useState(false);

  
  const handleArticlePress = () => {
    console.log(`Navigating to article with ID: ${id}`);
    if (uri) {
      // Navigate to the PDF Viewer if PDF URL is present
      console.log("url", uri);
      setShowPdfViewer(true);
    } else {
      // Navigate to article detail if no PDF URL
      // router.push(`/(article)/article-detail?id=${article.id}`);
      console.log("error", "No PDF URL found for the article");
    }
  };
  const handleClosePdfViewer = () => {
    setShowPdfViewer(false);
  };
  return (
    <View>
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={handleArticlePress}
      
      >
        <Image source={imageSource} style={styles.image} resizeMode="cover" />
        <View style={styles.cardBody}>
          <View style={styles.row}>
            <Text style={styles.cardTitle}>{title}</Text>
          </View>
          <Text style={styles.description}>{description}</Text>
        </View>
      </TouchableOpacity>
        <Modal
        visible={showPdfViewer}
        animationType="slide"
        onRequestClose={handleClosePdfViewer}
        >
        <PdfViewer pdfUrl={uri} onClose={handleClosePdfViewer} />
        </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'rgba(226, 226, 226, 0.3)', // More transparent
    borderRadius: 20,
    marginVertical: 10,
    overflow: 'hidden',
    elevation: 5, // For Android shadow
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.3, // Shadow opacity
    shadowRadius: 4, // Shadow blur radius
  },
  image: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cardBody: {
    // Set a solid background color temporarily for testing
    backgroundColor: '#E2E2E2', // Temporary solid color for testing
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10, // Added vertical padding
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  cardTitle: {
   paddingVertical: 10,
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  description: {
    marginTop: 10,
    textAlign: 'center',
    color: '#666',
  },
});

export default ArticleCard;
