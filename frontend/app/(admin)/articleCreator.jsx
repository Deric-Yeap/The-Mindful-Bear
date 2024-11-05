import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/formField'
import BrownPageTitlePortion from '../../components/brownPageTitlePortion'
import StatusBarComponent from '../../components/darkThemStatusBar'
import CustomButton from '../../components/customButton'
import axiosInstance from '../../common/axiosInstance'
import ConfirmModal from '../../components/confirmModal'
import { confirmModal } from '../../assets/image'
import { useRoute } from '@react-navigation/native'
import { useRouter } from 'expo-router'
import * as DocumentPicker from 'expo-document-picker'

const ArticleCreator = () => {
  const router = useRouter()
  
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [topic, setTopic] = useState('')
  const [articleImageUrl, setArticleImageUrl] = useState('')
  const [pdfFile, setPdfFile] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [modalMessage, setModalMessage] = useState('')

  const handleSubmit = async () => {
    if (!title|| !content  || !topic || !articleImageUrl) {  
        Alert.alert('Please fill in all required fields and provide an image URL.')
        return
    }

    if (!pdfFile) {
        Alert.alert('Please upload a PDF file.')
        return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('topic', topic)
    formData.append('processed_contents',content)
    formData.append('article_image_url', articleImageUrl)
    
    // Properly format the PDF file for upload
    if (pdfFile) {
        formData.append('article_pdf_url', {
            uri: pdfFile.uri,
            name: pdfFile.name || 'document.pdf',
            type: 'application/pdf'
        })
    }

    try {
        await axiosInstance.post('article/create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        setModalMessage('created')
        setShowSuccess(true)
        resetForm()
    } catch (error) {
        console.error(error)
        Alert.alert(
            'Error creating article:',
            error.response?.data?.message || JSON.stringify(error.response?.data)
        )
    }
}

  const resetForm = () => {
    setTitle('')
    setContent('')
    setTopic('')
    setArticleImageUrl('')
    setPdfFile(null)
  }

  const handlePDFUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedFile = result.assets[0]
        setPdfFile({
          uri: selectedFile.uri,
          name: selectedFile.name,
          type: 'application/pdf',
        })
      }
    } catch (error) {
      console.error('Error picking PDF file:', error)
    }
  }

  const handleConfirm = () => {
    setShowSuccess(false)
    router.push('/articleManagement')
  }

  return (
    <SafeAreaView className="flex-1 bg-optimistic-gray-10">
      <StatusBarComponent barStyle="light-content" backgroundColor="#251404" />
      <BrownPageTitlePortion title="Article Creation" />
      <ScrollView className="pb-20 mt-4">
        <FormField
          title="Article Title"
          iconName="form-select"
          value={title}
          handleChange={setTitle}
          customStyles="m-4"
        />
         <FormField
          title="Content"
          iconName="text-box-outline"
          value={content}
          handleChange={setContent}
          customStyles="m-4"
        />
        <FormField
          title="Topic"
          iconName="text-box-outline"
          value={topic}
          handleChange={setTopic}
          customStyles="m-4"
        />
        <FormField
          title="Image Address"
          iconName="text-box-outline"
          value={articleImageUrl}
          handleChange={setArticleImageUrl}
          customStyles="m-4"
          placeholder="Enter image URL"
        />

        <View className="px-4 w-full mb-4">
          <Text className="text-mindful-brown-100 text-xl font-bold mb-4">
            PDF Document
          </Text>
          <TouchableOpacity
            className="bg-serenity-green-50 rounded-full py-2 flex-row justify-center items-center shadow-lg"
            onPress={handlePDFUpload}
          >
            <Text className="text-white text-lg">
              {pdfFile ? 'Change PDF' : 'Upload PDF'}
            </Text>
          </TouchableOpacity>
          {pdfFile && (
            <Text className="text-mindful-brown-100 text-sm mt-2 text-center">
              Selected: {pdfFile.name}
            </Text>
          )}
        </View>

        <View className="mb-4 px-4 w-full">
          <CustomButton
            className="mt-2 w-full"
            handlePress={handleSubmit}
            title={'Create Article'}
          />
        </View>
      </ScrollView>
      {showSuccess && (
        <ConfirmModal
          isConfirmButton={true}
          isCancelButton={false}
          imageSource={confirmModal}
          confirmButtonTitle={'Confirm'}
          title={'Success!'}
          subTitle={`Article ${modalMessage} successfully.`}
          handleConfirm={handleConfirm}
        />
      )}
    </SafeAreaView>
  )
}

export default ArticleCreator