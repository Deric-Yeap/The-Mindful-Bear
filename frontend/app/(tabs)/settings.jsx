import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
import SettingsItem from '../../components/settingsItem'
import StatusBarComponent from '../../components/darkThemStatusBar'
import TopBrownSearchBar from '../../components/topBrownSearchBar'
import { colors } from '../../common/styles'
import { SafeAreaView } from 'react-native-safe-area-context'
import { featureFlags } from '../../common/featureFlags'
import { clearUserDetails } from '../../redux/slices/userSlice'
import ConfirmModal from '../../components/confirmModal'
import { confirmModal } from '../../assets/image'
import { useRouter } from 'expo-router'

const SettingsPage = () => {
  const router = useRouter()
  const [isShowLogoutModal, setIsShowLogoutModal] = useState(false)
  const handleLogout = () => {
    clearUserDetails()
    router.push('/sign-in')
  }
  return (
    <SafeAreaView className="bg-optimistic-gray-10 flex-1">
      {isShowLogoutModal && (
        <ConfirmModal
          isConfirmButton={true}
          isCancelButton={true}
          imageSource={confirmModal}
          confirmButtonTitle={'Yes'}
          cancelButtonTitle={'No'}
          title={'Are you sure you want to log out?'}
          handleConfirm={handleLogout}
          handleCancel={() => {
            setIsShowLogoutModal(false)
          }}
        />
      )}
      <ScrollView>
        <StatusBarComponent
          barStyle="light-content"
          backgroundColor={colors.mindfulBrown100}
        />
        <TopBrownSearchBar title="Settings" />
        <View className="p-4">
          {/* General Settings Section */}
          {featureFlags.isSettings && (
            <View>
              <Text className="text-mindful-brown-80 font-urbanist-bold text-lg mt-4 mb-4">
                General Settings
              </Text>
              <SettingsItem
                title="Notifications"
                iconName="bell-outline"
                href="/notifications"
              />
              <SettingsItem
                title="Personal Information"
                iconName="account-outline"
                href="/personal-info"
              />
              <SettingsItem
                title="Submit Feedback"
                iconName="message-outline"
                href="/feedback"
              />
              <SettingsItem
                title="Badges & Achievements"
                iconName="star-outline"
                badgeCount={25}
                href="/achievements"
              />
            </View>
          )}
          {featureFlags.isSettingsSecurity && (
            <View className="mt-4">
              <Text className="text-mindful-brown-80 font-urbanist-bold text-lg mb-4">
                Security & Privacy
              </Text>
              <SettingsItem
                title="Security"
                iconName="lock-outline"
                href="/security"
              />
              <SettingsItem
                title="Help Center"
                iconName="help-circle-outline"
                href="/help-center"
                borderColor="border-mindful-brown-30"
              />
            </View>
          )}

          {/* Security & Privacy Section */}
          {featureFlags.isSettingsDanger && (
            <View className="mt-4">
              <Text className="text-mindful-brown-80 font-urbanist-bold text-lg mb-4">
                Danger Zone
              </Text>
              <SettingsItem
                title="Close Account"
                iconName="account-cancel-outline"
                href="/close-account"
              />
            </View>
          )}
          {/* Danger Zone */}

          {/* Log Out */}
          <View className="mt-4 mb-10">
            <Text className="text-mindful-brown-80 font-urbanist-bold text-lg mb-4">
              Logout
            </Text>
            <SettingsItem
              title="Log Out"
              iconName="logout"
              href="logout"
              setIsShowLogoutModal={setIsShowLogoutModal}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SettingsPage
