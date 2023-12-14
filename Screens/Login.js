import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Alert, Platform, Modal } from 'react-native'
import React, { useContext, useState } from 'react'
import AuthContent from '../Component/Auth/AuthContent'
import Input from '../Component/Ui/Input'
import { Image } from 'expo-image'
import { Color } from '../Component/Ui/GlobalStyle'
import SubmitButton from '../Component/Ui/SubmitButton'
import Flat from '../Component/Ui/Flat'
import { LoginUrl, LoginWithBiometric } from '../utils/AuthRoute'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'
import { AuthContext } from '../utils/AuthContext'
import {Ionicons} from '@expo/vector-icons'
import * as LocalAuthentication from 'expo-local-authentication'
import * as Device from 'expo-device'
import AsyncStorage from '@react-native-async-storage/async-storage'
  

const Login = ({navigation}) => {
  const [enteredEmail, setEnteredEmail] = useState('')
  const [enteredPassword, setEnteredPassword] = useState('')
  const [emailIsInvalid, setEmailIsInvalid] = useState(true)
  const [passwordIsInvalid, setPasswordIsInvalid] = useState(true)
  const [isloading, setIsloading] = useState(false)
  const authCtx = useContext(AuthContext)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const log = Device.osInternalBuildId
   
  const updateInputValueHandler = (inputType, enteredValue) => {
    switch (inputType) {
      case 'email':
        setEnteredEmail(enteredValue)
        break;

      case 'password':
        setEnteredPassword(enteredValue)
        break;
    }
  }

  const loginhandler = async () => {
    const emailcheck = enteredEmail.includes('@') && enteredEmail.includes(".com")
    const passwordcheck = enteredPassword.length < 7
    
    // console.log(emailcheck, passwordcheck)
    
    if(!emailcheck || passwordcheck){
      setEmailIsInvalid(emailcheck)
      setPasswordIsInvalid(passwordcheck)
      Alert.alert('Invalid details', 'Please check your entered credentials.')
    }else{
      try {
        setIsloading(true)
        const response = await LoginUrl(enteredEmail, enteredPassword)
        // console.log(response)
        authCtx.authenticated(response.access_token)  
        authCtx.customerId(response.customer_id)
        authCtx.customerEmail(response.email)
        authCtx.customerFirstName(response.first_name)
        authCtx.customerLastName(response.last_name)
        authCtx.customerBalance(response.wallet_balance)
        authCtx.customerPhone(response.phone)
        authCtx.customerPicture(response.picture)
        authCtx.customerShowAmount('show')
        authCtx.customeruserid(response.user_id)
        authCtx.customerlastLoginTimestamp(new Date().toString())
        AsyncStorage.setItem("checktime",new Date().toString())
        // console.log(response.total_points + " total point")
        setIsloading(false)
      } catch (error) {
        setIsloading(true)
        Alert.alert('Login Failed', error.response.data.message)
        // console.log(error.response)
        setIsloading(false)
      }
    }
  }

  function onAuthenticate (spec){
    const auth = LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate with Touch ID',
      fallbackLabel: 'Enter Password'
    });
    auth.then(result => {
      setIsAuthenticated(result.success);
      if(result.success === true){
        BiometricSignUp()
      }else if(result.error === 'not_enrolled'){
        Alert.alert("", result.error)
        // console.log(result)
      }else{
        Alert.alert("Error", "Try again later")
      }
    })
  }

  const BiometricSignUp = async () => {
    try {
      setIsloading(true)
      const response = await LoginWithBiometric(log)
      // console.log(response.data)
      authCtx.authenticated(response.data.access_token)  
      authCtx.customerId(response.data.customer_id)
      authCtx.customerEmail(response.data.email)
      authCtx.customerFirstName(response.data.first_name)
      authCtx.customerLastName(response.data.last_name)
      authCtx.customerBalance(response.data.wallet_balance)
      authCtx.customerPhone(response.data.phone)
      authCtx.customerPicture(response.data.picture)
      authCtx.customerShowAmount('show')
      authCtx.customeruserid(response.data.user_id)
      authCtx.customerlastLoginTimestamp(new Date().toString())
      authCtx.customerPoints(response.data.total_points)
      AsyncStorage.setItem("checktime",new Date().toString())
      setIsloading(false)
    } catch (error) {
      setIsloading(true)
      Alert.alert('Login Failed', error.response.data.message)
      setIsloading(false)   
      // console.log(error.response)     
    }
  }

 
  if(isloading){
    return <LoadingOverlay message={"Logging in"}/>
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{justifyContent:'center', flex:1, marginTop:'40%', marginHorizontal:20}}>
        <Image style={{ width:100, height:100, alignSelf:'center'}} source={require("../assets/igoepp_transparent2.png")}   placeholder={'blurhash'} contentFit="contain"/>
        <Text style={styles.Title}>Login</Text>
       
        <Input
          placeholder="Email Address"
          onUpdateValue={updateInputValueHandler.bind(this, 'email')}
          value={enteredEmail}
          autoCapitalize={'none'}
          keyboardType="email-address"
          isInvalid={!emailIsInvalid}
          onFocus={() => setEmailIsInvalid(true)}
        />
        
        <Input
          placeholder="Password"
          onUpdateValue={updateInputValueHandler.bind(this, 'password')}
          secure
          value={enteredPassword}
          isInvalid={!passwordIsInvalid}
          autoCapitalize={'none'}
          onFocus={() => setPasswordIsInvalid(true)}
          />
            {/* <>
              {
                enteredPassword.length <= 7 ? <Text style={{color:Color.tomato, fontSize:12}}>Password must be more than 7 characters</Text> : null
                
              }
            </> */}
        </View>

        <View style={{marginHorizontal:50, marginTop:10}}>
          <SubmitButton message={"Login"} onPress={() => loginhandler()}/>
        </View>

        <TouchableOpacity style={{alignItems:'center', justifyContent:'center', marginTop: 10}} onPress={() => onAuthenticate()}>
          {
            Platform.OS === 'android' ? 
            <Ionicons name="finger-print" size={35} color={Color.darkolivegreen_100} />
            :
            <Image source={require("../assets/faceid.jpg")} style={{width:50, height:50}} contentFit='cover'/>

          }
        </TouchableOpacity>

        {/* <TouchableOpacity style={{alignItems:'center', justifyContent:'center', marginTop: 10}} onPress={() => onAuthenticate()}>
        <Image source={require("../assets/faceid.jpg")} style={{width:50, height:50}} contentFit='cover'/>

        </TouchableOpacity> */}

        <View style={styles.button}>
          <Flat onPress={() => navigation.navigate("ForgotPassword")}>
            Forgot Password
          </Flat>
        </View>
      <View style={{flexDirection:'row', alignItem:'center', justifyContent:'center', }}>
        <Text style={styles.newuser}>Dont have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.backtext}> SignUp</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>

      
    
    </SafeAreaView>
  )
}

export default Login

const styles = StyleSheet.create({
  newuser:{
    fontSize:14,
    fontFamily: 'poppinsMedium'
  },
  Title:{
    marginTop: 10, 
    marginBottom: 10,
    fontSize: 25,
    fontFamily: 'poppinsMedium',
    color: Color.darkolivegreen_100
  },
  backtext:{
    fontSize:14,
    color: Color.darkolivegreen_100,
    textAlign:'center',
    fontFamily: 'poppinsMedium'

  },
 button:{
    // marginTop: 10
  },
})