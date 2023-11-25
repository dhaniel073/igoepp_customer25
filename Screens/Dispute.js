import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Color } from '../Component/Ui/GlobalStyle'

const Dispute = () => {
  return (
    <View>
      <Text styles={styles.disputetxt}>Dispute</Text>
    </View>
  )
}

export default Dispute

const styles = StyleSheet.create({
    disputetxt:{
        fontSize: 18,
        color: Color.darkolivegreen_100,
        fontFamily: 'poppinsSemiBold',
        left: 10,
        marginTop:10,
        marginBottom:15,
      }, 
})