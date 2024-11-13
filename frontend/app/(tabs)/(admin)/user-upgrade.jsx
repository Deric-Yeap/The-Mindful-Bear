import { View, Text } from 'react-native'
import React, { useState, useEffect } from 'react'

import Dropdown from '../../../components/dropdown'
import { listUsers, upgradeUser } from '../../../api/user'
import CustomButton from '../../../components/customButton'
import BackButton from '../../../components/backButton'
import Loading from '../../../components/loading'
import ConfirmModal from '../../../components/confirmModal'

const UserUpgrade = () => {
  const [userList, setUserList] = useState([])
  const [id, setId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalText, setModalText] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await listUsers()
        setUserList(usersResponse)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  const handleClick = async () => {
    setErrorMessage('')
    if (!id) {
      setErrorMessage('Please select a user.')
      return
    }
    try {
      setIsLoading(true)
      const response = await upgradeUser({ id: id })
      setIsModalVisible(true)
      setModalText(response.success)
      setId(null)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <View className="absolute h-full top-0 left-0 right-0 bottom-0 flex justify-center items-center z-10 bg-optimistic-gray-80/90">
        <Loading />
      </View>
    )
  }

  return (
    <View className="flex-1 p-4 bg-white">
      <View className="flex-row items-center justify-center mt-12">
        <View className="absolute left-0">
          <BackButton buttonStyle="float-left" />
        </View>
        <Text className="font-urbanist-extra-bold text-4xl text-mindful-brown-80">
          Upgrade User
        </Text>
      </View>
      <Dropdown
        title="User List"
        data={userList}
        customStyles="w-full pb-6 mt-6"
        placeHolder="Select User"
        handleSelect={(value) => setId(value)}
        errorMessage={errorMessage}
      />
      <CustomButton
        title="Confirm"
        handlePress={handleClick}
        buttonStyle="w-full mb-10"
      />
      {isModalVisible && (
        <ConfirmModal
          title={'All Done!'}
          subTitle={modalText}
          confirmButtonTitle="Okay!"
          isConfirmButton={true}
          handleConfirm={() => {
            setIsModalVisible(false)
          }}
        />
      )}
    </View>
  )
}

export default UserUpgrade
