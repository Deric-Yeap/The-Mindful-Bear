import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native'
import { Link } from 'expo-router'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { colors } from '../../../common/styles'
import TopBrownSearchBar from '../../../components/topBrownSearchBar'
import StatusBarComponent from '../../../components/darkThemStatusBar'
import AnalyticsTabs from '../../../components/analytics/analyticsTabs'
import axiosInstance from '../../../common/axiosInstance'
import { listUsers } from '../../../api/user'
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg'

export default function Admin() {
  const [ageStats, setAgeStats] = useState({ percentage: 0, range: '' })
  const [deptStats, setDeptStats] = useState({ percentage: 0, department: '' })

  useEffect(() => {
    const calculateAgeDistribution = (users) => {
      // Calculate age for each user
      const ages = users.map((user) => {
        const birthDate = new Date(user.date_of_birth)
        const today = new Date()
        let age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--
        }
        return age
      })

      // Define age ranges
      const ageRanges = {
        '18-29': ages.filter((age) => age >= 18 && age <= 29).length,
        '30-40': ages.filter((age) => age >= 30 && age <= 40).length,
        '41-50': ages.filter((age) => age >= 41 && age <= 50).length,
        '51+': ages.filter((age) => age >= 51).length,
      }

      // Find the range with highest count
      const totalUsers = ages.length
      let maxRange = ''
      let maxCount = 0

      for (const [range, count] of Object.entries(ageRanges)) {
        if (count > maxCount) {
          maxCount = count
          maxRange = range
        }
      }

      const percentage = Math.round((maxCount / totalUsers) * 100)

      return {
        percentage,
        range: maxRange,
      }
    }

    const calculateDepartmentDistribution = (users) => {
      // Count users in each department
      const deptCount = users.reduce((acc, user) => {
        const dept = user.department
        if (dept) {
          acc[dept] = (acc[dept] || 0) + 1
        }
        return acc
      }, {})

      // Find department with highest count
      let maxCount = 0
      let maxDept = ''
      const totalUsers = users.length

      for (const [dept, count] of Object.entries(deptCount)) {
        if (count > maxCount) {
          maxCount = count
          maxDept = dept
        }
      }

      const percentage =
        totalUsers > 0 ? Math.round((maxCount / totalUsers) * 100) : 0

      return {
        percentage,
        department: maxDept || 'Unknown Department',
      }
    }
    const fetchUsers = async () => {
      try {
        const response = await listUsers()
        const stats = calculateAgeDistribution(response)
        const deptStats = calculateDepartmentDistribution(response)
        setAgeStats(stats)
        setDeptStats(deptStats)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUsers()
  }, [])

  return (
    <SafeAreaView
      className="flex-1 bg-optimistic-gray-10"
      backgroundColor="#251404"
    >
      <StatusBarComponent
        barStyle="light-content"
        backgroundColor={colors.mindfulBrown100}
      />
      <ScrollView className="flex-1 bg-optimistic-gray-10 mb-16 mt-12">
        <TopBrownSearchBar title="Hi Admin!" showBackButton={false} />
        <View className="p-4">
          <Text className="text-mindful-brown-100 font-urbanist-bold text-xl mb-4">
            Management
          </Text>
          <View className="flex-row justify-between mb-4">
            <Link href="/user-upgrade" asChild>
              <TouchableOpacity className="flex-1 bg-mindful-brown-30 p-2 rounded-2xl mr-2">
                <View className="items-start">
                  <Text className="text-white font-urbanist-bold text-lg">
                    User
                  </Text>
                </View>
                <View className="items-center justify-center mt-2">
                  <MaterialCommunityIcons
                    name="account"
                    size={128}
                    color={colors.mindfulBrown10}
                  />
                </View>
              </TouchableOpacity>
            </Link>
            <Link href="/landmark" asChild>
              <TouchableOpacity className="flex-1 bg-mindful-brown-70 p-2 rounded-2xl ml-2">
                <View className="items-start">
                  <Text className="text-mindful-brown-20 font-urbanist-bold text-lg">
                    Landmark
                  </Text>
                </View>
                <View className="items-center justify-center mt-2">
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={128}
                    color={colors.mindfulBrown20}
                  />
                </View>
              </TouchableOpacity>
            </Link>
          </View>

          <View className="flex-row justify-between mb-4">
            <Link href="/exercisemanagement" asChild>
              <TouchableOpacity className="flex-1 bg-serenity-green-50 p-2 rounded-2xl mr-2">
                <View className="items-start">
                  <Text className="text-serenity-green-10 font-urbanist-bold text-lg">
                    Exercise
                  </Text>
                </View>
                <View className="items-center justify-center mt-2">
                  <MaterialCommunityIcons
                    name="meditation"
                    size={128}
                    color={colors.serenityGreen20}
                  />
                </View>
              </TouchableOpacity>
            </Link>
            <Link href="/form" asChild>
              <TouchableOpacity className="flex-1 bg-empathy-orange-40 p-2 rounded-2xl ml-2">
                <View className="items-start">
                  <Text className="text-empathy-orange-10 font-urbanist-bold text-lg">
                    Form
                  </Text>
                </View>
                <View className="items-center justify-center mt-2">
                  <MaterialCommunityIcons
                    name="form-select"
                    size={128}
                    color={colors.empathyOrange20}
                  />
                </View>
              </TouchableOpacity>
            </Link>
          </View>
          <View className="flex-row justify-between mb-4">
            <Link href="/articleManagement" asChild>
              <TouchableOpacity className="flex-1 bg-mindful-brown-30 p-2 rounded-2xl mr-2">
                <View className="items-start">
                  <Text className="text-serenity-green-10 font-urbanist-bold text-lg">
                    Article
                  </Text>
                </View>
                <View className="items-center justify-center mt-2">
                  <MaterialCommunityIcons
                    name="newspaper-variant-multiple-outline"
                    size={128}
                    color={colors.mindfulBrown10}
                  />
                </View>
              </TouchableOpacity>
            </Link>
          </View>

          <Text className="text-mindful-brown-100 font-urbanist-bold text-xl mb-4">
            User Demographic
          </Text>
          <View className="mb-4">
            <View className="flex-row justify-between gap-4">
              {/* Age Distribution Card */}
              <TouchableOpacity className="flex-1 bg-white p-6 rounded-[32px] shadow-sm">
                <View>
                  <Text className="text-gray-900 font-urbanist-bold text-lg mb-6">
                    Age Distribution
                  </Text>

                  <View className="items-center justify-center">
                    <Svg height="120" width="120" viewBox="0 0 180 180">
                      {/* Background circle */}
                      <Circle
                        cx="90"
                        cy="90"
                        r="60"
                        stroke="#FFE5D3"
                        strokeWidth="20"
                        fill="transparent"
                      />
                      {/* Progress circle */}
                      <Circle
                        cx="90"
                        cy="90"
                        r="60"
                        stroke={colors.empathyOrange40}
                        strokeWidth="20"
                        fill="transparent"
                        strokeDasharray={`${ageStats.percentage * 3.77} 377`}
                        strokeDashoffset={-94.25}
                      />
                      {/* Percentage */}
                      <SvgText
                        x="90"
                        y="90"
                        fontSize="32"
                        fontWeight="bold"
                        fill="#1A1A1A"
                        textAnchor="middle"
                        dy="10"
                      >
                        {ageStats.percentage}%
                      </SvgText>
                    </Svg>

                    <Text className="text-gray-600 font-urbanist-bold text-lg mt-4">
                      {ageStats.range} years
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Department Stats Card */}
              <TouchableOpacity className="flex-1 bg-white p-6 rounded-[32px] shadow-sm">
                <View>
                  <Text className="text-gray-900 font-urbanist-bold text-lg mb-6">
                    Department
                  </Text>

                  <View className="items-center justify-center">
                    <Svg height="120" width="120" viewBox="0 0 180 180">
                      {/* Background circle */}
                      <Circle cx="90" cy="90" r="65" fill="#F3F0FF" />
                      {/* Progress sector */}
                      <Path
                        d={`M 90 90 L 90 25 A 65 65 0 ${deptStats.percentage > 50 ? 1 : 0} 1 ${
                          90 +
                          65 *
                            Math.cos(
                              (deptStats.percentage / 100) * 2 * Math.PI -
                                Math.PI / 2
                            )
                        } ${
                          90 +
                          65 *
                            Math.sin(
                              (deptStats.percentage / 100) * 2 * Math.PI -
                                Math.PI / 2
                            )
                        } Z`}
                        fill={colors.kindPurple30}
                      />
                      {/* Percentage */}
                      <SvgText
                        x="90"
                        y="90"
                        fontSize="32"
                        fontWeight="bold"
                        fill="#1A1A1A"
                        textAnchor="middle"
                        dy="10"
                      >
                        {deptStats.percentage}%
                      </SvgText>
                    </Svg>

                    <Text className="text-gray-600 font-urbanist-bold text-lg mt-4">
                      {deptStats.department}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View className="bg-optimistic-gray-10 p-4 rounded-lg mb-4">
            <Text className="text-mindful-brown-100 font-urbanist-bold text-xl mb-4">
              Mindfulness Tracker
            </Text>
            <View className="-mx-4">
              <AnalyticsTabs />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
