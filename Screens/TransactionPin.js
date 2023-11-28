import { Platform, SafeAreaView, StyleSheet, Text, TextInput, View, ScrollView, Switch, Alert, TouchableOpacity } from 'react-native'
import React, { useContext, useRef, useState, useEffect } from 'react'
import GoBack from '../Component/Ui/GoBack'
import { Color, DIMENSION, marginStyle } from '../Component/Ui/GlobalStyle'
import SubmitButton from '../Component/Ui/SubmitButton'
import { CustomerInfoCheck, SetupPin } from '../utils/AuthRoute'
import { AuthContext } from '../utils/AuthContext'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'
import Modal from 'react-native-modal'
import * as LocalAuthentication from 'expo-local-authentication'
import Input from '../Component/Ui/Input'
import {MaterialIcons} from '@expo/vector-icons'




const TransactionPin = ({navigation, route}) => {
  // const length = 4
  // const disabled = false
  // const inputRefs = useRef([])
  // const value = []
  const  [pin, setpin] = useState()
  const [pinvalid, setpinvalid] = useState(false)
  const authCtx = useContext(AuthContext)
  const [isloading, setisloading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [pinset, setPinSet] = useState(true)
  const [isSetpinModalVisible, setisSetpinModalVisible] = useState(false)


  const [check, setCheck] = useState([])
  useEffect(() => {
    const unsuscribe = navigation.addListener('focus', async () => {
      try {
      setisloading(true)
      const response = await CustomerInfoCheck(authCtx.Id, authCtx.token)
      // console.log(response)
      setCheck(response.transaction_pin_setup)
      setisloading(false)
      } catch (error) {
      setisloading(true)
      // console.log(error)
      setisloading(false)
      }
    })
    return unsuscribe;
  }, [])
   
  function toggleTransactionpin(){
    if(pinset === true){
      setisSetpinModalVisible(!isSetpinModalVisible)
    }else{
      togglepin()
    }
  }

  function togglepin(){
    setPinSet(previous => !previous)
  }

 
  const pinhandler = async () => {
    try {
      setisloading(true)
      const response = await SetupPin(authCtx.Id, pin, authCtx.token )
      // console.log(response)
      toggleTransactionpin()
      setpin()
      setPinSet(previous => !previous)
      setisloading(false)
    } catch (error) {
      setisloading(true)
      // console.log(error)
      setpin()
      Alert.alert("Error", "An error occured while setting up your transaction pin")
      setisloading(false)
    }
  }


  if(isloading){
    return <LoadingOverlay message={"..."}/>
  }

  return (
    <ScrollView style={{marginTop:marginStyle.marginTp, marginHorizontal:10, flex:1}}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <Text style={styles.transactiontxt}>Transaction Pin</Text>

      <View style={{ flexDirection: 'row', marginTop: '5%', justifyContent:'space-between', marginHorizontal:10 }}>
        <View style={{flexDirection:'row'}}>
          <Text style={styles.text}>Set Pin</Text>
        </View>

        <Switch
          trackColor={{ false: 'grey', true: Color.darkolivegreen_100 }}
          thumbColor={'white'}
          ios_backgroundColor={'white'}
          onValueChange={toggleTransactionpin}
          value={check === "N" ? !pinset : pinset}
        />
      </View>

      <Modal
      isVisible={isSetpinModalVisible}
      animationInTiming={500}
      >
        <SafeAreaView style={styles.centeredView}>
        <TouchableOpacity style={{justifyContent:'flex-end', alignSelf:'flex-end', marginBottom:5, }} onPress={() => toggleTransactionpin()}>
          <MaterialIcons name="cancel" size={30} color="white" />
        </TouchableOpacity>
          <View style={styles.modalView}>
            <View>
            <Text style={styles.modalText}>Enter Pin</Text>

            <SafeAreaView style={{marginHorizontal:40}}>
              <Input
                keyboardType={"numeric"}
                maxLength={4}
                style={{fontSize:25, textAlign:'center', }}
                onUpdateValue={setpin}
                value={pin}
                isInvalid={pinvalid}
                onFocus={() => setpinvalid(false)}
              />
              {
                pinvalid &&
                <Text style={{fontSize:11, textAlign:'center', color:Color.tomato}}>Pin must be 4 characters</Text>
              }
            </SafeAreaView>
            <View style={{marginBottom:'5%'}}/>
            </View>
            {/* <View style={styles.buttonView}> */}

            <View style={{flexDirection:'row', justifyContent:'center'}}>
              <TouchableOpacity style={styles.viewbtn} onPress={() => [ pin === null || pin === undefined || pin === "" || pin.length < 4  ? setpinvalid(true) : pinhandler()]} >
                <Text style={styles.viewtext}>Continue</Text>
              </TouchableOpacity>
            </View>             
              {/* </View> */}
          </View>
          </SafeAreaView>
      </Modal>
    </ScrollView>
  )
}

export default TransactionPin

const styles = StyleSheet.create({
  text:{
    top:8,
    fontSize:15,
    fontFamily: 'poppinsRegular'
  },
  viewbtn:{
    backgroundColor:Color.darkolivegreen_100,
    borderColor: Color.darkolivegreen_100,
    borderWidth: 1,
    justifyContent:'center',
    borderRadius: 3,
    width: DIMENSION.WIDTH * 0.36,
    padding: 5
  },
  viewtext:{
    textAlign:'center',
    alignSelf:'center',
    fontFamily: 'poppinsMedium',
    fontSize: 12,
    color: Color.white
  },
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
  centeredView: {
    flex: 1,
    // backgroundColor: Color.light_black,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    width: DIMENSION.WIDTH  * 0.7,
    borderRadius: 20,
    padding: 25,
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    // marginBottom: 15,
    textAlign: 'center',
    fontSize:18, 
    fontFamily:'poppinsRegular'
  },
  
})


{/* <SafeAreaView>
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
    }
  }

  const onChangeValue =(text, index) => {
    let value = []
    value.push(text)
    console.log(value)
  } 

*/}