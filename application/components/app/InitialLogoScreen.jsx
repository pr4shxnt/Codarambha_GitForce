import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'

const InitialLogoScreen = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
        <Image
          source={require('../assets/apppicon.png')}
          className="h-24 w-24 rounded-xl"
          resizeMode="contain"
        />
    </View>
  )
}

export default InitialLogoScreen

