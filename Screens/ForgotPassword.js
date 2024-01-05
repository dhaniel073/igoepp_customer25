import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native'
import React, {useState} from 'react'
import SubmitButton from '../Component/Ui/SubmitButton'
import Flat from '../Component/Ui/Flat'
import { ForgotCustomerPassword } from '../utils/AuthRoute'
import Input from '../Component/Ui/Input'
import { Image } from 'expo-image'
import { Color } from '../Component/Ui/GlobalStyle'

const ForgotPassword = ({navigation}) => {

  const [emailEntered, setEmailEntered] = useState('')
  const [emailEnteredInvalid, setEmailEnteredInvalid] = useState(true)
  const [loading, setIsLoading] = useState(false)
  
  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case 'email':
        setEmailEntered(enteredValue);
        break;
    }
  }

  const submitHandler = async () => {
    const emailIsValid = emailEntered.includes('@')
    
    if(!emailIsValid){
      // console.log(emailIsValid)
      setEmailEnteredInvalid(emailIsValid)   
      Alert.alert("Invalid Email", "Please enter a valid email")
    }else{
      // console.log(emailIsValid)
      try {
        const responce = await ForgotCustomerPassword(emailEntered)
        Alert.alert("Successful", `A mail has been sent to \n${emailEntered}`, [
          {
            text:"Ok",
              onPress: () => navigation.navigate("Login")
            }
          ]) 
      } catch (error) {
        Alert.alert("Error", `An error Occured`, [
          {
            text:"Ok",
              onPress: () => {}
            }
          ]) 
      } 
    }
  }

  // console.log(emailEntered)

  return (
    <ScrollView style={styles.authContent} showsVerticalScrollIndicator={false}>
      <Image style={{ width:100, height:100, alignSelf:'center'}} source={require("../assets/igoepp_transparent2.png")}   placeholder={'blurhash'} contentFit="contain"/>


      <Text style={styles.Title}>Forgot Password</Text>

      <Input
        placeholder="Enter Email"
        onUpdateValue={updateInputValueHandler.bind(this, 'email')}
        value={emailEntered}
        autoCapitalize={'none'}
        isInvalid={!emailEnteredInvalid}
        onFocus={() => setEmailEnteredInvalid(true)}
      />

      <View style={styles.buttons}>
        <SubmitButton onPress={() => emailEntered ===  undefined || emailEntered === null || emailEntered === "" ? [Alert.alert("No Email", "Please enter an email to reset password"), setEmailEnteredInvalid(false) ]:  submitHandler()} message={'Submit'}/>

        <View style={styles.space}></View>
        <Flat onPress={() => navigation.navigate('Login')}>
            Login Instead
        </Flat>
      </View>
    </ScrollView>
  )
}

export default ForgotPassword

const styles = StyleSheet.create({
  authContent: {
    flex: 1,
    marginTop: 170,
    marginHorizontal: 10,
    padding: 16,
    borderRadius: 8,
  },
  buttons: {
    marginTop: 15,
  },
  Title:{
    marginTop: 30, 
    marginBottom: 10,
    fontSize: 25,
    color: Color.darkolivegreen_100,
    fontFamily: 'poppinsMedium'
  },
  space:{
    marginTop: 10
  },
})