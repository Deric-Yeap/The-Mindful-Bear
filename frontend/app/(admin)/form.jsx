import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBrownSearchBar from '../../components/topBrownSearchBar';
import StatusBarComponent from '../../components/darkThemStatusBar';
import Toggle from '../../components/toggle';
import { Link } from 'expo-router';
import { router } from 'expo-router';
import axiosInstance from '../../common/axiosInstance';
import { colors } from '../../common/styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loading from '../../components/loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteForm } from '../../api/form';
import ConfirmModal from '../../components/confirmModal';
import { confirmModal } from '../../assets/image';

const Forms = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [forms, setForms] = useState([]);
  const [likertOptions, setLikertOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(1);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [handleConfirmCallback, setHandleConfirmCallback] = useState(null);

  const onSelectSwitch = (index) => {
    setSelectedOption(index);
    AsyncStorage.setItem('selectedOption', index.toString());
  };

  useEffect(() => {
    const loadSelectedOption = async () => {
      const savedOption = await AsyncStorage.getItem('selectedOption');
      setSelectedOption(savedOption !== null ? Number(savedOption) : 1);
    };

    const fetchForms = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('form/get');
        setForms(Array.isArray(response) ? response : []);
      } catch (error) {
        setError(
          error.response?.data || error.request
            ? 'No response received from the server.'
            : error.message
        );
      } finally {
        setLoading(false);
      }
    };

    const fetchLikertOptions = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('option_set/get');
        if (Array.isArray(response)) {
          const options = response.map(item => ({
            key: item.id,
            value: item.description,
          }));
          setLikertOptions(options);
        } else {
          setLikertOptions([]);
        }
      } catch (error) {
        console.error('Error fetching Likert options:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSelectedOption();
    if (selectedOption === 1) {
      fetchForms();
    } else if (selectedOption === 2) {
      fetchLikertOptions();
    }
  }, [selectedOption]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.optimisticGray10 }}>
        <Loading />
      </View>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-optimistic-gray-10 justify-center items-center">
        <Text>Error fetching data: {error}</Text>
      </SafeAreaView>
    );
  }

  const handleFormPress = (form) => {
    router.push({
      pathname: '/create-form',
      params: { formId: form.id },
    });
  };

  const handleDeleteForm = async (formId) => {
    try {
      setIsConfirmModalOpen(true);

      const confirmDelete = new Promise((resolve) => {
        const handleConfirm = () => {
          setIsConfirmModalOpen(false);
          resolve(true);
        };
        setHandleConfirmCallback(() => handleConfirm);
      });

      const result = await confirmDelete;
      if (result) {
        await deleteForm(formId);
        setForms((prevForms) => prevForms.filter((form) => form.id !== formId));
        setIsSuccessModalOpen(true);
      }
    } catch (error) {
      console.error(`Error deleting form with ID: ${formId}`, error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-optimistic-gray-10">
      <StatusBarComponent barStyle="light-content" backgroundColor={colors.mindfulBrown100} />
      <TopBrownSearchBar title="Form Management" />
      <View style={{ alignItems: 'center', margin: 20 }}>
        <Toggle
          selectionMode={selectedOption}
          roundCorner={true}
          option1="Forms"
          option2="Likert-Scales"
          onSelectSwitch={onSelectSwitch}
          selectionColor={colors.mindfulBrown80}
        />
      </View>
      <View className="flex-row justify-between items-center pt-4 pb-0 px-4 mb-2">
        <Text className="text-mindful-brown-80 font-bold text-3xl">
          {selectedOption === 1 ? 'Forms' : 'Likert-Scales'}
        </Text>
        {selectedOption === 1 && (
          <Link href="/create-form" asChild>
            <TouchableOpacity className="bg-mindful-brown-80 px-4 py-1 rounded-full">
              <Text className="text-white font-bold text-base">Create Form</Text>
            </TouchableOpacity>
          </Link>
        )}
        {selectedOption === 2 && (
          <Link href="/create-scale" asChild>
            <TouchableOpacity className="bg-mindful-brown-80 px-4 py-1 rounded-full">
              <Text className="text-white font-bold text-base">Create Scale</Text>
            </TouchableOpacity>
          </Link>
        )}
      </View>

      {selectedOption === 1 ? (
        forms.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-mindful-brown-80 font-bold text-lg">No forms available</Text>
          </View>
        ) : (
          <FlatList
            data={forms}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="w-full h-auto p-4 items-center bg-[#9BB167] shadow-lg mt-4 rounded-[15px] flex-row justify-between"
                onPress={() => handleFormPress(item)}
              >
                <View style={{ flex: 1 }}>
                  <View className="flex-row">
                    <Text className="text-mindful-brown-10 font-bold text-lg">{item.form_name}</Text>
                    <TouchableOpacity onPress={() => handleDeleteForm(item.id)} className="ml-4">
                      <Icon name="trash" size={24} color={colors.presentRed50} />
                    </TouchableOpacity>
                  </View>
                  <Text className="text-mindful-brown-10 text-md font-bold">
                    {item.store_responses ? 'Store User Response' : "Don't Store Response"}
                  </Text>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text className="text-white font-urbanist-bold text-xl"> &#41; </Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          />
        )
      ) : (
        likertOptions.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-mindful-brown-80 font-bold text-lg">No Likert options available</Text>
          </View>
        ) : (
          <FlatList
            data={likertOptions.filter(item => item.value.startsWith('Likert Scale'))}
            renderItem={({ item }) => (
              <Link href={`/updateScale/${item.key}`} asChild>
                <TouchableOpacity className="w-full h-auto p-4 items-center bg-[#9BB167] shadow-lg mt-6 rounded-[15px] flex-row justify-between">
                  <View style={{ flex: 1 }}>
                    <Text className="text-mindful-brown-10 font-bold text-lg">{item.value}</Text>
                  </View>
                  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text className="text-white font-urbanist-bold text-xl"> &#41; </Text>
                  </View>
                </TouchableOpacity>
              </Link>
            )}
            keyExtractor={(item) => item.key.toString()}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          />
        )
      )}

      {isConfirmModalOpen && (
        <ConfirmModal
          isConfirmButton
          isCancelButton
          imageSource={confirmModal}
          confirmButtonTitle="Confirm"
          cancelButtonTitle="Cancel"
          title="Are you sure?"
          subTitle="Do you really want to delete this form?"
          handleConfirm={handleConfirmCallback}
          handleCancel={() => setIsConfirmModalOpen(false)}
        />
      )}

      {isSuccessModalOpen && (
        <ConfirmModal
          isConfirmButton
          isCancelButton={false}
          imageSource={confirmModal}
          confirmButtonTitle="Ok"
          title="Form Deleted"
          subTitle="Form has been successfully deleted!"
          handleConfirm={() => setIsSuccessModalOpen(false)}
        />
      )}
    </SafeAreaView>
  );
};

export default Forms;
