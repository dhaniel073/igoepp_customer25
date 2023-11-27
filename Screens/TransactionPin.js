import { Platform, SafeAreaView, StyleSheet, Text, TextInput, View, ScrollView, Switch, Alert } from 'react-native'
import React, { useContext, useRef, useState, useEffect } from 'react'
import GoBack from '../Component/Ui/GoBack'
import { Color, marginStyle } from '../Component/Ui/GlobalStyle'
import SubmitButton from '../Component/Ui/SubmitButton'
import { CustomerInfoCheck } from '../utils/AuthRoute'
import { AuthContext } from '../utils/AuthContext'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'
import Modal from 'react-native-modal'
import * as LocalAuthentication from 'expo-local-authentication'




const TransactionPin = ({navigation, route}) => {
    const length = 4
    const disabled = false
    const inputRefs = useRef([])
    const value = []
    const  [pin, setpin] = useState()
    const authCtx = useContext(AuthContext)
    const [isloading, setisloading] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [pinset, setPinSet] = useState(true)


    const [check, setCheck] = useState([])
    useEffect(() => {
         const unsuscribe = navigation.addListener('focus', async () => {
           try {
            setisloading(true)
            const response = await CustomerInfoCheck(authCtx.Id, authCtx.token)
            console.log(response)
            setCheck(response.transaction_pin_setup)
            setisloading(false)
           } catch (error) {
            setisloading(true)
            console.log(error)
            setisloading(false)
           }
         })
         return unsuscribe;
       }, [])
   
  function toggleTransactionpin(){
    onAuthenticate()
  }

  const Enabled = () => {

  }
  const DisEnabled = () => {
    
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
              setPinSet(previousState => !previousState)
              console.log('enable')
              Enabled()
            }else{
              setPinSet(previousState => !previousState)
              console.log('disable')
              DisEnabled()
              Enabled()
            }
          }else if (result.error === 'not_enrolled'){
            Alert.alert('', 'Fingerprint not enrolled on device')
          }
        })
      }

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

    if(isloading){
        return <LoadingOverlay message={"..."}/>
    }

  return (
    <ScrollView style={{marginTop:marginStyle.marginTp, marginHorizontal:10, flex:1}}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <Text style={styles.transactiontxt}>Transaction Pin</Text>

      <View style={{ flexDirection: 'row', marginTop: '5%', justifyContent:'space-between', marginHorizontal:10 }}>
        <View style={{flexDirection:'row'}}>
          <Text style={styles.text}>Use fingerprint</Text>
        </View>

        <Switch
          trackColor={{ false: 'grey', true: Color.darkolivegreen_100 }}
          thumbColor={'white'}
          ios_backgroundColor={'white'}
          onValueChange={toggleTransactionpin}
          value={check === "N" ? !pinset : pinset}
        />
      </View>

      <Modal>

      </Modal>
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
</SafeAreaView> */}