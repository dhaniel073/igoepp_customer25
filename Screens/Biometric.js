import { Alert, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useId, useState } from 'react'
import * as LocalAuthentication from 'expo-local-authentication'
import { Color, DIMENSION, marginStyle } from '../Component/Ui/GlobalStyle'
import {Ionicons, Octicons} from '@expo/vector-icons'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'
import GoBack from '../Component/Ui/GoBack'
import * as Device from 'expo-device';
import { AuthContext } from '../utils/AuthContext'
import { BiometricSetup, CustomerInfoCheck } from '../utils/AuthRoute'

const Biometric = ({navigation}) => {
    const [biometric, setBiometric] = useState(true)
    const [IsBiometricSupported, setIsBiometricSupported] = useState(false)
    const authCtx = useContext(AuthContext)
    const [isloading, setisloading] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [check, setCheck] = useState([])
    const log = Device.osInternalBuildId
    


    useEffect(() => {
      const unsuscribe = navigation.addListener('focus', async () => {
        try {
          setisloading(true)
          const response = await CustomerInfoCheck(authCtx.Id, authCtx.token)
          console.log(response)
          setCheck(response.biometric_setup)
          setisloading(false)
        } catch (error) {
          setisloading(true)
          console.log(error)
          setisloading(false)
        }
      })
      return unsuscribe;
    }, [])

    useEffect(() => {
      (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      console.log(compatible)
      setIsBiometricSupported(compatible)
    })
    }, [])


    function toggleEmailSwitch(){
      onAuthenticate()
    }

    const Enabled = async () => {
      try {
        const response = await BiometricSetup(authCtx.Id, log, authCtx.token)
        console.log(response)
      } catch (error) {
        Alert.alert("Successful", "Biometric setup was successful",)  
      }
    }
    
    const DisEnabled = async () => {
    }
  
    function onAuthenticate (){
      const auth = LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate with Touch ID',
        fallbackLabel: 'Enter Password'
      });
      auth.then(result => {
        setIsAuthenticated(result.success);
        if(result.success === true){
          if(IsBiometricSupported){
            setBiometric(previousState => !previousState)
            console.log('enable')
            Enabled()
          }else{
            setBiometric(previousState => !previousState)
            console.log('disable')
            DisEnabled()
            Enabled()
          }
        }else{
          Alert.alert('', 'Device not compactible')
        }
      })
    }

    if(isloading){
      return <LoadingOverlay message={"..."}/>
    }

    
  return (
    <View style={{flex:1, marginTop: marginStyle.marginTp, marginHorizontal:10}}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <Text style={styles.biometrictxt}>Biometric Setup</Text>
    
      <View style={{ flexDirection: 'row', marginTop: '5%', justifyContent:'space-between', marginHorizontal:10 }}>
        <View style={{flexDirection:'row'}}>
          <Text style={styles.text}>Use fingerprint</Text>
        </View>

        <Switch
          trackColor={{ false: 'grey', true: Color.darkolivegreen_100 }}
          thumbColor={'white'}
          ios_backgroundColor={'white'}
          onValueChange={toggleEmailSwitch}
          value={check === "N" ? !biometric : biometric}
        />
      </View>
    </View>

  )
}

export default Biometric

const styles = StyleSheet.create({
  biometrictxt:{
    fontSize: 18,
    color: Color.darkolivegreen_100,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
    marginBottom:15,
  }, 
  text:{
    top:8,
    fontSize:15,
    fontFamily: 'poppinsRegular'
  },
})