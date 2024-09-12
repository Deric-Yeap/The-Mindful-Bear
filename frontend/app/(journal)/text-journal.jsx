import { View, Text, ScrollView, StatusBar } from 'react-native'
import { useState } from 'react'

import BackButton from '../../components/backButton'
import CustomButton from '../../components/customButton'
import FormField from '../../components/formField'
import Dropdown from '../../components/dropdown'
import TextBox from '../../components/textBox'

const TextJournal = () => {
  const [form, setForm] = useState({
    title: '',
    journal_text: '',
    emotion_id: '',
  })

  

  

  return (
    <View>
      <StatusBar barStyle="light-content" />
      <View className="h-[20vh] bg-mindful-brown-70  justify-center p-4 pt-6">
        <BackButton buttonStyle="mb-4" />
        <Text className="font-urbanist-extra-bold text-3xl text-white">
          Add New Journal
        </Text>
      </View>
      <ScrollView className="p-4">
        <FormField
          title="Journal Title"
          iconName="notebook-outline"
          value={form.title}
          handleChange={(value) => setForm({ ...form, title: value })}
          customStyles="w-full pb-4"
          placeHolder="Enter Journal Title"
          //   errorMessage={errorMessage.email ? errorMessage.email : ''}
        />

        <TextBox
          title="Write Your Entry"
          value={form.content}
          handleChange={(value) => setForm({ ...form, content: value })}
          placeHolder="Write your thoughts here..."
        />
      </ScrollView>
    </View>
  )
}

export default TextJournal
