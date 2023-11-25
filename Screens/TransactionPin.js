import { Platform, SafeAreaView, StyleSheet, Text, TextInput, View, ScrollView } from 'react-native'
import React, { useRef, useState } from 'react'
import GoBack from '../Component/Ui/GoBack'
import { Color, marginStyle } from '../Component/Ui/GlobalStyle'
import SubmitButton from '../Component/Ui/SubmitButton'



const TransactionPin = ({navigation, route}) => {
    const length = 4
    const disabled = false
    const inputRefs = useRef([])
    const value = []
    const  [pin, setpin] = useState()

    const handleChange = (text, index) => {
        onChangeValue(text, index)

        if(text.length !== 0){
            return inputRefs?.current[index + 1]?.focus()
        }
        
        return inputRefs?.current[index -1]?.focus()
    } 

    const handleBackSpace = (event, index) => {
        const {nativeEvent} = event

        if(nativeEvent.key === 'Backspace'){
            handleChange('', index)
            // console.log(nativeEvent.key)
            // return inputRefs?.current[index -1]?.focus
        }
    }

    const onChangeValue =(text, index) => {
       let value = []
    //    var count = Object.keys(text).length
    //    for (var i = 0; i < text; i++){
    //     value.push({
    //       label: text,
    //     })
    //     }

            value.push(text)
        console.log(value)
    } 

  return (
    <ScrollView style={{marginTop:marginStyle.marginTp, marginHorizontal:10, flex:1}}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <Text style={styles.transactiontxt}>Transaction Pin</Text>

      <View style={{width:'100%', paddingHorizontal:22, marginTop:10}}>
      <SafeAreaView>
        <View style={{alignItems:'center'}}>
            <Text>Input your transaction pin</Text>

        <View style={styles.container}>
            {[...new Array(length)].map((item, index) => (
                
                <TextInput
                ref={ref => {
                    if(ref && !inputRefs.current.includes(ref)){
                        inputRefs.current = [...inputRefs.current, ref]
                    }
                }}
                key={index}
                style={[styles.input, styles.shadowProps]}
                maxLength={1}
                contextMenuHidden
                selectTextOnFocus
                editable={!disabled}
                keyboardType='decimal-pad'
                testID={`TransactionPin-${index}`}
                onChangeText={text => handleChange(text, index)}
                onKeyPress={event => handleBackSpace(event, index)}
                // value={}
                />
                ))}
        </View>
        </View>

        <View style={{marginHorizontal:50, marginTop:'30%'}}>
        <SubmitButton message={"Submit"}/>
        </View>
    </SafeAreaView>
      </View>
    </ScrollView>
  )
}

export default TransactionPin

const styles = StyleSheet.create({
    container:{
        width: '100%',
        flexDirection:'row',
        justifyContent:'space-evenly',
        marginTop:'30%'
    },
    transactiontxt:{
        fontSize: 18,
        color: Color.darkolivegreen_100,
        fontFamily: 'poppinsSemiBold',
        left: 10,
        marginTop:10,
        marginBottom:15,
    },
    input:{
        fontSize:24,
        color: Color.limegreen,
        textAlign:'center',
        width:45,
        height:55,
        backgroundColor: Color.white,
        borderRadius: 10,
        borderWidth:1
    },
    shadowProps:{
        marginBottom: 30,
        // borderRadius: 20, 
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 8,
        backgroundColor: 'white',
        overflow: Platform.OS === 'andriod' ? 'hidden' : 'visible',
      },
})