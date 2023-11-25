import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import {Entypo} from '@expo/vector-icons'
import { Color } from './GlobalStyle'
import { useState } from 'react'

const Input = ({ 
    label,
    keyboardType,
    secure,
    onUpdateValue,
    value,
    isInvalid,
    style,
    maxLength,
    placeholder,
    multiline,
    autoCapitalize,
    editable,
    onFocus
    
    }) => {

    const [showPassword, setShowPassword ] = useState(true)

    const togglePassword = () => {
      setShowPassword(!showPassword)
    }

  return (
    <View>
      <TextInput
        style={[styles.input, isInvalid && styles.inputInvalid, style]}
        autoCapitalize={autoCapitalize}  
        keyboardType={keyboardType}
        secureTextEntry={secure ? showPassword : null}
        onChangeText={onUpdateValue}
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        editable={editable}
        multiline={multiline}
        onFocus={onFocus}
      />
      {secure &&
      <TouchableOpacity style={{position:'absolute', justifyContent:'flex-end', alignSelf:'flex-end', right:10, top:15}} onPress={togglePassword}>
        {
          showPassword ? (
            <Entypo name="eye" size={24} color={Color.gray_100}/>
            ): (
              <Entypo name="eye-with-line" size={20} color={Color.gray_100}/>
              )
        }
      </TouchableOpacity>
      }
    </View>
  )
}

export default Input

const styles = StyleSheet.create({
    inputContainer: {
        marginVertical: 7,
    },
    label: {
        color: 'black',
        marginTop:2,
        marginBottom: 2,
        fontSize: 16,
        fontFamily: 'poppinsMedium'
    },
    // labelInvalid: {
    //     color: Color.error500,
    // },
    input: {
        paddingVertical: 10,
        paddingHorizontal: 2,
        borderBottomColor:  Color.gray_100,
        borderBottomWidth: 2,
        fontFamily: 'poppinsRegular',
        fontSize: 15,
        marginBottom:15
    },
    inputInvalid: {
      backgroundColor: Color.error100,
    },
})