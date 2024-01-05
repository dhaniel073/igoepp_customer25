import { StyleSheet, Text, View, TouchableOpacity, Platform, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Color, marginStyle } from '../Component/Ui/GlobalStyle'
import GoBack from '../Component/Ui/GoBack'
import * as LocalAuthentication from 'expo-local-authentication'
import {Entypo, MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons'
import { AuthContext } from '../utils/AuthContext'
import { Image } from 'expo-image'


const AddToWallet = ({route, navigation}) => {
  const authCtx = useContext(AuthContext)
  const wallet_balance = route?.params?.walletBalance
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isBiometricSupported, setIsBiometricSupported] = useState(false)



const ShowAmount = () => {
  authCtx.customerShowAmount('show')
}

const HideAmount = () => {
  authCtx.customerShowAmount('hide')
}

  useEffect(() => {
  (async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    setIsBiometricSupported(compatible)
  })
  }, [])


function onAuthenticate (spec){
  const auth = LocalAuthentication.authenticateAsync({
    promptMessage:'Authenticate with Touch ID',
    fallbackLabel: 'Enter Password'
  });
    auth.then(result => {
      setIsAuthenticated(result.success);
      if(result.success === true){
        if(spec === 'hide'){
          HideAmount()
        }else{
          ShowAmount()
        }
      }else if(result.error === "not_enrolled"){
        Alert.alert("", "Device not enrolled, setup up a screen lock to use this feature")
      }
    })
  }

  // console.log(authCtx.showAmount)
  return (
    <View style={{marginTop: marginStyle.marginTp, marginHorizontal:10}}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <Text style={styles.addtowalletpaymentxt}>AddToWallet</Text>

      <View style={styles.subContainer}>


          <View style={styles.walletbalancepanel}>
              <View style={styles.nairaAmount}>
              
              <Text style={styles.amount}>
              <MaterialCommunityIcons name="currency-ngn" size={25} color="white" />
                  {authCtx.showAmount === 'show'  ? authCtx.balance :  <Text>******</Text>} 
              </Text>

              {/* <TouchableOpacity style={{alignSelf:'center', marginLeft:10}} onPress={() => onAuthenticate('Yes')}>
                <Entypo name="eye-with-line" size={24} color="white" /> 
              </TouchableOpacity> */}

                {authCtx.showAmount === 'show' ?
                   <TouchableOpacity style={{alignSelf:'center', marginLeft:10}} onPress={() => onAuthenticate('hide')}>

                      <Entypo name="eye-with-line" size={24} color="white" />
                    </TouchableOpacity>
                  : 
                    <TouchableOpacity style={{alignSelf:'center', marginLeft:10}} onPress={() => onAuthenticate('show')}>

                      <Entypo name="eye" size={24} color="white"/>
                    </TouchableOpacity>
                }
              </View>
              <Text style={styles.walletbalanceText}>Balance</Text>
          </View>
        </View>
        
        <View style={{marginTop:30, marginHorizontal:10}}>


          <View style={styles.shadowProps} >
            <TouchableOpacity  style={styles.fundwallet}
            onPress={()=> navigation.navigate('FundWithCard')}>
                <Image
                style={styles.fundwalletIcon}
                source={require("../assets/vector33.png")} />
                <Text style={styles.text1}>Fund With Card</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.shadowProps} >
            <TouchableOpacity  style={[styles.fundwallet]}
              onPress={() => Alert.alert("", "Payment method not available")}>
                    <Image
                    style={styles.fundwalletIcon}
                    source={require("../assets/vector33.png")}
                  />
                    <Text style={styles.text1}>Fund With Transfer</Text>
            </TouchableOpacity>
          </View>
        </View>
    </View>
  )
}

export default AddToWallet

const styles = StyleSheet.create({
  text1:{
    fontFamily:'poppinsRegular',
    fontSize:12
  },
  nairaAmount:{
    flexDirection: 'row',
    padding: 5,
    marginTop: 13,
  },
  container:{
    marginTop: marginStyle.marginTp,
    marginHorizontal: 10,
  },
  wallet:{
    fontSize: 25,
    fontFamily: 'poppinsSemiBold',
    color: Color.darkolivegreen_100
  },
  subContainer:{
    marginTop: 30,
    marginHorizontal: 30,
  },
  amount:{
    fontSize: 25,
    fontFamily:'poppinsSemiBold',
    color: Color.white,
  },
  addtowalletpaymentxt:{
    fontSize: 18,
    color: Color.darkolivegreen_100,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
    marginBottom:15,
  }, 
  pressed:{
    opacity: 0.9
  },
  shadowProps:{
    marginBottom: 30,
    borderRadius: 20, 
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    backgroundColor: 'white',
    overflow: Platform.OS === 'andriod' ? 'hidden' : 'visible',
  },
  fundwallet:{
    flexDirection: 'row',
    padding: 5,
    margin: 10,
    overflow: 'hidden'
  },
  fundwalletIcon:{
    width: 15,
    height: 15,
    marginRight: 10,
    marginTop: 2,
  },
  walletbalancepanel:{
    width: '100%',
    backgroundColor: Color.limegreen,
    padding: 15,
    borderRadius: 10,
    marginTop: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  nairasign:{
    width: 25,
    height: 25,
    marginTop: 10,
  },
  walletbalanceText:{
    marginTop: 10,
    color: Color.white,
    fontFamily: 'poppinsMedium',
    fontSize: 15
  },
})

// Pat@123/$%