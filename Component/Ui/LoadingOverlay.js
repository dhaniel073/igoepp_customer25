import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Color } from './GlobalStyle'

const LoadingOverlay = ({message}) => {
  return (
    <View style={[styles.container, styles.horizontal]}>
        <Text style={styles.message}>{message}</Text>
    <ActivityIndicator size="large" color={Color.darkolivegreen_100} />
    </View>
  )
}

export default LoadingOverlay

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center',
    padding: 10,

  },
  message: {
    fontSize: 16,
    marginBottom: 12,
    // fontFamily:'poppinsRegular'
  },
})