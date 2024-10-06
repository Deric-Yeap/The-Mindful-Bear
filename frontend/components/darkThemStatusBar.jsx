import React from 'react'
import { StatusBar } from 'react-native'

const StatusBarComponent = ({ barStyle, backgroundColor }) => {
  return <StatusBar barStyle={barStyle} backgroundColor={backgroundColor} />
}

export default StatusBarComponent
