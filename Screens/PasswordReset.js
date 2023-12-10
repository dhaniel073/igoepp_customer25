import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, {useRef, useContext, useState} from 'react'
import Input from '../Component/Ui/Input'
import { AuthContext } from '../utils/AuthContext'
import { Color, DIMENSION, marginStyle } from '../Component/Ui/GlobalStyle'
import GoBack from '../Component/Ui/GoBack'
import SubmitButton from '../Component/Ui/SubmitButton'
import { CustomerResetPassword, ValidateLogin } from '../utils/AuthRoute'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'

const PasswordReset = ({navigation}) => {
    const authCtx = useContext(AuthContext)
    const [ischecking, setischecking] = useState(false)

    const [oldpassword, setoldpassword] = useState('')
    const [oldpasswordvalid, setoldpasswordvalid] = useState(false)
    const oldpasswordcheck = oldpassword.length < 7
    const [oldpassworderrormessage, setoldpassworderrormessage] = useState([])

    const [password, setPassword] = useState('')
    const [passwordvalid, setpasswordvalid] = useState(false)
    const [isloading, setisloading] = useState(false)
    const [passworderrormessage, setpassworderrormessage] = useState()
    const passwordcheck = password.length < 7



   
    let refT = useRef(0);
  
    function handleClick() {
      refT.current = refT.current + 1;
      // alert('You clicked ' + ref.current + ' times!');
    }

  const ValidateOldPassword = async () => {
    if(refT.current > 3){
      Alert.alert("", "To many attempt, try again later", [
        {
          text: "Ok",
          onPress: () => navigation.goBack()
        }
      ])
    }else{
      try {
        setisloading(true)
        const response = await ValidateLogin(authCtx.email, oldpassword)
        // console.log(response.message)
        if(response.message === "Invalid passoword"){
          setoldpassworderrormessage(response.message)
          setoldpasswordvalid(true)
          Alert.alert("Error", response.message, [
            {
              text:"Ok",
              onPress: () => setisloading(false)
            }
          ])
        }else{
          ResetHandler()
        }
        // setisloading(false)
      } catch (error) {
        setisloading(true)
        // console.log(error)
        setisloading(true)
      }
    }
  }

    

    const ResetHandler = async () => {
      try {
        setisloading(true)
        const response = await CustomerResetPassword(authCtx.email, password, authCtx.token)
        // console.log(response)
        Alert.alert("Successful", "Password reset successful", [
          {
            text:'Ok',
            onPress: () => navigation.goBack()
          }
        ])
        setisloading(false)
        setPassword('')
        setoldpassword('')
        setoldpassworderrormessage('')
        setpassworderrormessage('')
      } catch (error) {
        setisloading(true)
        // console.log(error)
        Alert.alert('Error', "An error occured while reseting your password")
        setisloading(false)
      }
    }

    if(isloading){
      return <LoadingOverlay message={"..."}/>
    }
  return (
    <SafeAreaView style={{marginTop:marginStyle.marginTp, marginHorizontal:10}}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <Text style={styles.requeststxt}>Password Reset</Text>

      <View style={{marginHorizontal:10}}>
      <Input value={authCtx.email} editable={false}/>
      <Input 
        onUpdateValue={setoldpassword}
        value={oldpassword}
        placeholder={'Enter old password'}
        autoCapitalize={'none'}
        secure
        onFocus={() => setoldpasswordvalid(false)}
        isInvalid={oldpasswordvalid}
      />

      {
        oldpassworderrormessage.length !== 0 && <Text style={{color: Color.tomato, fontSize:11}}>{oldpassworderrormessage}</Text>
      }
      <Input 
        onUpdateValue={setPassword}
        value={password}
        autoCapitalize={'none'}
        placeholder={'Enter new password'}
        secure
        onFocus={() => setpasswordvalid(false)}
        isInvalid={passwordvalid}
      />

      {
        passwordvalid && <Text style={{color: Color.tomato, fontSize: 11}}>Password must be at least 7 characters</Text>
      }
      <SubmitButton message={"Reset"} style={{marginTop:20, marginHorizontal:20}} onPress={() => oldpasswordcheck || passwordcheck ? [setoldpasswordvalid(true),  setpasswordvalid(true)] : [handleClick(), ValidateOldPassword()]}/>
      </View>
    </SafeAreaView>
  )
}

export default PasswordReset

const styles = StyleSheet.create({
  requeststxt:{
    fontSize: 18,
    color: Color.darkolivegreen_100,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
    marginBottom:15,
  }, 
})