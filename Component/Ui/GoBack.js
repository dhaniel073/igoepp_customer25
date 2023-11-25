import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import {Entypo} from '@expo/vector-icons'
import { Color } from './GlobalStyle'

const GoBack = ({onPress, children}) => {
  return (
    <TouchableOpacity style={{flexDirection:'row', alignItems: 'center'}} onPress={onPress}>
        <Entypo name="chevron-left" size={14} color={Color.new_color} />
        <Text style={{color: Color.darkolivegreen_100,}}>{children}</Text>
    </TouchableOpacity>
  )
}

export default GoBack

const styles = StyleSheet.create({})