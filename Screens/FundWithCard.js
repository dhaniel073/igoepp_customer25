import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useContext, useRef, useState } from 'react'
import { Paystack } from 'react-native-paystack-webview'
import {MaterialCommunityIcons} from '@expo/vector-icons'
import { Color, DIMENSION, marginStyle } from '../Component/Ui/GlobalStyle'
import { AuthContext } from '../utils/AuthContext'
import { WalletUpdate } from '../utils/AuthRoute'
import SubmitButton from "../Component/Ui/SubmitButton"
import GoBack from '../Component/Ui/GoBack'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'

const FundWithCard = ({navigation}) => {
  const paystackWebViewRef = useRef(); 
  const [amount, setAmount] = useState()
  const [isInvalid, setIsInvalid] = useState(false)
  const authCtx = useContext(AuthContext)
  const [isloading, setisloading] = useState(false)

  const token = authCtx.token;
  const customerid = authCtx.Id
  const email = authCtx.email

  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case 'amount':
        setInputAmount(enteredValue);
        break;
    }
  }

  const SuccessHandler = async () => {
    try {
      setisloading(true)
      const response = await WalletUpdate(authCtx.Id, authCtx.token, amount)
      // console.log(response)
      authCtx.customerBalance(response)
      setAmount(null)
      navigation.goBack()
      setisloading(false)
    } catch (error) {
      setisloading(true)
      // console.log(error.response)
      Alert.alert("Sorry", "An error occured try again later", [
        {
          text:"Ok",
          onPress: () => navigation.goBack()
        }
      ])
      setisloading(false)
      return;
    }
    // navigation.navigate('BillPayment')
  }

  function CancleHandler(error){
    setAmount(null)
    navigation.goBack()
  }

  const check = () => {
    setIsInvalid(true) 
    Alert.alert("Empty Field", "Input an Amount to continue") 
  }

  if(isloading){
    return <LoadingOverlay message={"..."}/>
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{marginTop: marginStyle.marginTp, marginHorizontal:10}}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <Text style={styles.fundwithcardtxt}>FundWithCard</Text>

      <SafeAreaView style={styles.maincontainer}>
        <View style={{alignSelf:'center'}}>
          <Text style={styles.text}>How much will you like to fund ?</Text>
        </View>


        <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', marginTop:'28%',marginBottom:'28%' }}>
          <MaterialCommunityIcons name="currency-ngn" size={34} color={Color.darkolivegreen_100}/>
          <TextInput 
            style={[styles.input, isInvalid && styles.invalid]}  
            onFocus={() => setIsInvalid(false)}
            value={amount}
            onChangeText={setAmount}
            keyboardType='numeric'
            maxLength={6}
          />
        </View>

        {
          amount < 100 &&
          <Text style={{textAlign:'center', fontSize:12, color: Color.red}}>* Note: The minimum deposit amount is <MaterialCommunityIcons name="currency-ngn" size={14} color={Color.red}/>100.00 *</Text>
        }


        <View style={{marginHorizontal:30, marginTop:10}}>
          <SubmitButton message={'Submit'} onPress={() => amount === undefined  ? [Alert.alert("Empty Field", "Input an Amount to continue"), setIsInvalid(true) ] : amount < 100 ?  Alert.alert("Amount ", "The minimum deposit amount is NGN 100.00")  : paystackWebViewRef.current.startTransaction() }/>
        </View>
      </SafeAreaView>

      <Paystack
        paystackKey="pk_test_229cbd7654c78526259b0ce604b03b96c34c4bde"
        billingEmail={authCtx.email}
        amount={amount}
        onCancel={(error) =>{
          CancleHandler(error)
        }}
        onSuccess={(res) => {
            SuccessHandler(res)
        }}
        ref={paystackWebViewRef}
        
      />
    </ScrollView>
  )
}

export default FundWithCard

const styles = StyleSheet.create({
  invalid:{
    backgroundColor: Color.error100
  },
  input:{
    fontSize: 36,
    padding:5,
    maxWidth: DIMENSION.WIDTH ,
    height: DIMENSION.HEIGHT * 0.1,
    color: Color.darkolivegreen_100,
    borderBottomWidth:0.5,
  },
  maincontainer:{
    // borderWidth:1,
  },
  addtowalletpaymentxt:{
    fontSize: 18,
    color: Color.darkolivegreen_100,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
    marginBottom:15,
  }, 
  text:{
    fontSize: 15,
    lineHeight: 20,
    fontFamily: 'interRegular',
    color: Color.grey2,
    width: 200,
    height: 42,
    marginTop: "10%",
    textAlign:'center'
  },
  fundwithcardtxt:{
    fontSize: 18,
    color: Color.darkolivegreen_100,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
    marginBottom:15,
  }

})