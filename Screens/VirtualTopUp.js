import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, Alert, TouchableOpacity, View, TextInput, Pressable, Keyboard } from 'react-native'
import React, {useEffect, useState, useContext} from 'react'
import { Color, DIMENSION, marginStyle } from '../Component/Ui/GlobalStyle'
import GoBack from '../Component/Ui/GoBack'
import SubmitButton from '../Component/Ui/SubmitButton'
import Input from '../Component/Ui/Input'
import { Dropdown } from 'react-native-element-dropdown'
import { Image, ImageBackground } from 'expo-image'
import Modal from 'react-native-modal'
import {MaterialCommunityIcons, MaterialIcons, Entypo} from '@expo/vector-icons'
import * as Notifications from 'expo-notifications'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'
import { AuthContext } from '../utils/AuthContext'
import axios from 'axios'
import { CustomerBillerCommission, CustomerInfoCheck, CustomerSelf, CustomerThirdParty, CustomerVtuAirtime, CustomerVtuData, ValidatePin } from '../utils/AuthRoute'
import { useRef } from 'react'
import styled from 'styled-components'
import OTPFieldInput from '../Component/Ui/OTPFieldInput'

const StyledButton = styled.TouchableOpacity`
  padding: 15px;
  background-color: ${Color.darkolivegreen_100};
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  margin-vertical: 5px;
  height: 50px;
  width: 60%
`;

export const ButtonText = styled.Text`
  font-size: 15px;
  color: ${Color.white};
  font-family: poppinsRegular
`;


const data = [
  { label: 'Self', value: 'self' },
  { label: 'Third Party', value: 'thirdparty' },
]



const VirtualTopUp = ({navigation, route}) => {
  const [category, setcategory] = useState([])
  const [isloading, setisloading] = useState(false)
  const [id, setid] = useState('')
  const [isFocus, setisFocus] = useState(false)
  const [isSelfFocus, setIsSelfFocus] = useState(false)
    
    const [requestId, setRequestId] = useState()
    const [bosquet, setBosquet] = useState([])
    const [bosquetData, setBosquetData] = useState()
    const [bosquetPrice, setBosquetPrice] = useState()
    
    
    const [IsbosquetFocus, setIsBosquetFocus] = useState(false)
    const [self, setSelf] = useState('')
    const [phoneValidation, setPhoneValidation] = useState('')
    const [ref, setRef] = useState()
    const [amount, setAmount] = useState()
    const [isModalVisble, setModalVisible] = useState(false)
    const [ischecking, setischecking] = useState(false)
    const [pinerrormessage, setPinerrorMessage] = useState('')
    const [commissonvalue, setcommissonvalue] = useState()
    
    const [code, setCode] = useState('')
    const [pinReady, setPinReady] = useState(false)
    const MAX_CODE_LENGTH = 4;


    const maindate = new Date() 
    const date = maindate.toLocaleDateString()
    const time = maindate.toLocaleTimeString()

    
  const [pinT, setpinT] = useState()
  const [pinvalid, setpinvalid] = useState(false)
  const [pincheckifempty, setpincheckifempty] = useState([])
  const [isSetpinModalVisible, setisSetpinModalVisible] = useState(false)
    
    // const phone = self === "self" && authCtx.phone 
    const DATACHECK = id.includes('DATA')
    const AIRTIMECHECK = id.includes('AIRTIME')
    const amountCheck = amount >= 100
    const phonecheck = phoneValidation.length === 11
    const authCtx = useContext(AuthContext)
    const authId = route?.params?.id
    let reqId;

    // console.log(authCtx.phone)

    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', async () => {
        try {
          setisloading(true)
          const response = await CustomerInfoCheck(authCtx.Id, authCtx.token)
          setpincheckifempty(response.transaction_pin_setup)
          setisloading(false)
        } catch (error) {
          setisloading(true)
          setisloading(false)
          return;
        }
      })
      return unsubscribe;
    }, [])

  useEffect(() => {
    setisloading(true)
    const url = `https://phixotech.com/igoepp/public/api/auth/billpayment/getAllBillersByCategory/${authId}`
    const response = axios.get(url, {
        headers:{
            Accept:'application/json',
            Authorization: `Bearer ${authCtx.token}`
        }
    }).then((res) => {
        // console.log(res.data)dx
        var count = Object.keys(res.data).length;
        let catarray = []
        for (var i = 0; i < count; i++){
            catarray.push({
                label: res.data[i].name,
                value: res.data[i].id,
            })
            // setCityCode(response.data.data[i].lga_code)
        }
        setcategory(catarray)
    }).catch((error) => {
        // console.log(error)
      })
      setisloading(false)
  }, [])

  const updatevalue = (inputType, enteredValue) => {
    switch(inputType){
        case 'phonevalidation':
            setPhoneValidation(enteredValue);
            break;
        case 'amount':
            setAmount(enteredValue);
            break;
    }
}

const getBouquets = (value) => {
    // console.log(authId, id)
    
    const url = `https://phixotech.com/igoepp/public/api/auth/billpayment/getAllBouquetByBillerID/${authId}/${value}`
    const response = axios.get(url, {
        headers:{
            Accept:'application/json',
            Authorization: `Bearer ${authCtx.token}`
        }
    }).then((res) => {
        // console.log(res.data.data.bouquets)
        var count = Object.keys(res.data.data.bouquets).length;
        let catarray = []
        for (var i = 0; i < count; i++){
            catarray.push({
                label: res.data.data.bouquets[i].name,
                value: res.data.data.bouquets[i].code,
                price: res.data.data.bouquets[i].price
            })
            // setCityCode(response.data.data[i].lga_code)
        }
        setBosquet(catarray)
    }).catch((error) => {
        // console.log(error.response)
        return;
    })
  }
  const toggleModal = () => {
    setModalVisible(!isModalVisble)
  }

  const TopupAirtime = () => {
    if(self === 'self'){
        // alert(self + " self")
        if(AIRTIMECHECK){
            if(amountCheck && authCtx.phone){
                // alert(amount + " " + authCtx.phone + " " + self)
                mobilevalidationSelf()
            }else{
                Alert.alert("Error", "invalid details")
            }
        }else if(DATACHECK){
            if(bosquetData){
                mobilevalidationSelf()
                // alert("DATA" + " "+ bosquetData + " " +self)
            }else{

            }
        }
    }else{
        if(AIRTIMECHECK){
          if(amountCheck && phonecheck){
              mobilevalidationThirdparty()
          }else{
              Alert.alert("Error", "invalid details")
          }
        }else if(DATACHECK){
          if(bosquetData && phonecheck){
              mobilevalidationThirdparty()
          }else{
              Alert.alert("Error", "invalid details")
          }
        }
      }
    }

    // console.log(requestId)
    
    const mobilevalidationThirdparty = async () => {
      try {
        setisloading(true)
          const response = await CustomerThirdParty(authCtx.Id, phoneValidation, authCtx.token)
          // console.log(response)
          setRequestId(response.requestID)
          if(response.status === "Success"){
              if(DATACHECK){
                  Alert.alert("Confirm Purchase", `Confirm Data Topup for ${phoneValidation} `, [
                      {
                          text: "Cancel",
                          onPress: () => {}
                      },
                      {
                          text:'Confirm',
                          onPress: () => toggleModal1()
                      }
                  ])
              }else{
                if(AIRTIMECHECK){
                  Alert.alert("Confirm Purchase", `Confirm Airtime Purchase for ${phoneValidation}`, [
                    {
                      text: "Cancel",
                      onPress: () => []
                    },
                    {
                      text:'Confirm',
                      onPress: () => toggleModal1()
                    }
                  ])
                }
              }
              setisloading(false)
          }else{
              Alert.alert("Error", response, [
                  {
                      text:"Ok",
                      onPress: () => {}
                  }
              ])
          }
          setisloading(false)
      } catch (error) {
          // console.log(error)
          setisloading(true)
          Alert.alert("Error", "An error occured please try again later", [
            {
              text:'Ok',
              onPress: () => navigation.goBack()
            }
          ])
          setisloading(false)


      }
  }

    const mobilevalidationSelf = async () => {
      try {
          setisloading(true)
          const response = await CustomerSelf(authCtx.Id, authCtx.token)
          // console.log(response)
          setRequestId(response.requestID)
          if(response.status === "Success"){
              if(DATACHECK){
                  Alert.alert("Confirm Purchase", `Confirm Data Topup for ${authCtx.phone}`, [
                    {
                      text: "Cancel",
                      onPress: () => {}
                    },
                    {
                      text:'Confirm',
                      onPress: () => toggleModal1()
                    }
                  ])
              }else{
                  if(AIRTIMECHECK){
                    Alert.alert("Confirm Purchase", `Confirm Airtime Purchase for ${authCtx.phone}`, [
                      {
                        text: "Cancel",
                        onPress: () => []
                      },
                      {
                        text:'Confirm',
                        onPress: () => toggleModal1()
                      }
                    ])
                  }
              }
              setisloading(false)
          }else{
              Alert.alert("Error", response, [
                {
                  text:"Ok",
                  onPress: () => {}
                }
              ])
          }
          setisloading(false)
      } catch (error) {
          // console.log(error)
          setisloading(true)
          Alert.alert("Error", "An error occured please try again later", [
            {
              text:'Ok',
              onPress: () => navigation.goBack()
            }
          ])
          setisloading(false)

      }
   }

   let refT = useRef(0);
  
   function handleClick() {
     refT.current = refT.current + 1;
     // alert('You clicked ' + ref.current + ' times!');
   }
 
   const toggleModal1 = () => {
     setisSetpinModalVisible(!isSetpinModalVisible)
   }
   

   const pinValidateCheck = async () => {
    if(refT.current > 3){
      Alert.alert("", "To many attempt, try again later", [
        {
          text: "Ok",
          onPress: () => navigation.goBack()
        }
      ])
    }else{
      try {
        setischecking(true)
        const response = await ValidatePin(authCtx.Id, code, authCtx.token)
        // console.log(response)
        setCode('')
        if(DATACHECK){
          datatoptup() 
        }else{
          airtimetopup()
        }
      } catch (error) {
        setischecking(true)
        setCode('')
        setPinerrorMessage(error.response.data.message + "\n" + (3 - refT.current + " trials remaining"))
        // console.log(error.response)
        Alert.alert("Error", error.response.data.message+ " " + "Try again", [
          {
            text: "Ok",
            onPress: () => {}
          },
        ])
        setischecking(false)

      }
    }
  }

  const commissionget = async (id) => {
     try {
       const response = await CustomerBillerCommission(id, authCtx.token)
       console.log(response)
       setcommissonvalue(response)
     } catch (error) {
       return;
     }
   }


  
  const airtimetopup = async () => {
    toggleModal1()
    try {
      setisloading(true)
        const response = await CustomerVtuAirtime(requestId, id, amount, authCtx.token, commissonvalue)
        // console.log(response)

        if(response.message === "failed"){
            Alert.alert(response.message, response.description + ", fund wallet and try again", [
              {
                text:"Ok",
                onPress:() => navigation.goBack()
              }
            ])
          }else{
            schedulePushNotification(response)
            toggleModal()
          }
        setisloading(false)
    } catch (error) {
        setisloading(true)
        Alert.alert("Error", "An error occured please try again later", [
            {
              text:'Ok',
              onPress: () => navigation.goBack()
            }
          ])
          setisloading(false)
        // console.log(error.response)
    }
  }

const datatoptup = async() => {
    toggleModal1()
    // console.log(requestID, id, bosquetPrice, bosquetData, authCtx.token)
    try {
      setisloading(true)
        const response = await CustomerVtuData(requestId, id, bosquetPrice, bosquetData, authCtx.token, commissonvalue)
        // console.log(response)

        if(response.message === "failed"){
            Alert.alert(response.message, response.description + ", fund wallet and try again", [
              {
                text:"Ok",
                onPress:() => navigation.goBack()
              }
            ])
          }else{
            schedulePushNotification(response)
            toggleModal()
        }
        setisloading(false)
    } catch (error) {
        setisloading(true)
        // console.log(error.response)
        Alert.alert("Error", "An error occured please try again later", [
            {
              text:'Ok',
              onPress: () => navigation.goBack()
            }
        ])
        setisloading(false)   
    }
  }

  async function schedulePushNotification(response) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${id} Purchase 🔔`,
        body: `${id} ${response.message}.\nAmount: ${DATACHECK ? bosquetPrice : amount} \nPhone Number ${self === "self" ? authCtx.phone : phoneValidation} \nReference: ${response.requestID} \nDate: ${date} ${time}`,
        data: { data: 'goes here' },
      },
      trigger: { seconds: 2 },
    });
  }


  if(isloading){
    return <LoadingOverlay message={"..."}/>
  }
  return (
    <ScrollView style={{marginTop:marginStyle.marginTp, marginHorizontal:10}}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <Text style={styles.virtuatopuptxt}>VirtualTopUp</Text>

      
      {
        pincheckifempty === "N" ? Alert.alert("Message", "No transaction pin, set a transaction pin to be able to make transactions", [
          {
            text: "Ok",
            onPress: () => navigation.navigate('TransactionPin')
          }
        ]) 

        :

        <>
      <ImageBackground style={{flexDirection:'row', alignItems:'center', justifyContent:'space-evenly',}}>
        <Image source={require("../assets/Glo_Limited.png")} style={[styles.image, {height:60}]}/>
        <Image source={require("../assets/mtn.png")} contentFit='contain' style={styles.image}/>
        <Image source={require("../assets/9Mobile.jpg")} contentFit='contain' style={styles.image}/>
        <Image contentFit='contain' source={require("../assets/airtel.png")} style={styles.image}/>
      </ImageBackground>

      <View style={{marginTop:20}}/>
      <View style={{marginHorizontal:10}}>

            {/* <Text style={styles.label}>Select Distribution Company</Text> */}

            <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={category}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? 'Select Network' : '...'}
            searchPlaceholder="Search..."
            value={id}
            onFocus={() => setisFocus(true)}
            onBlur={() => setisFocus(false)}
            onChange={item => {
                setid(item.value);
                setisFocus(false);
                getBouquets(item.value)
                commissionget(item.value)
            }}
            />
            <View style={{ marginBottom:20}}/>

            {id && 
                <>
                {/* <Text style={styles.label}>Buy {id} For</Text> */}

                <Dropdown
                style={[styles.dropdown, isSelfFocus && { borderColor: 'blue' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={data}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isSelfFocus ? 'Self or Third Party' : '...'}
                searchPlaceholder="Search..."
                value={self}
                onFocus={() => setIsSelfFocus(true)}
                onBlur={() => setIsSelfFocus(false)}
                onChange={item => {
                    setSelf(item.value);
                    setIsSelfFocus(false);
                    
                    
                }}
                />
            <View style={{ marginBottom:30}}/>
                </>
            }

            {DATACHECK && 
                <>
                {/* <Text style={styles.label}>Select Data Plan</Text> */}

                <Dropdown
                style={[styles.dropdown, IsbosquetFocus && { borderColor: 'blue' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={bosquet}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!IsbosquetFocus ? 'Select Data Plan' : '...'}
                searchPlaceholder="Search..."
                value={bosquetData}
                onFocus={() => setIsBosquetFocus(true)}
                onBlur={() => setIsBosquetFocus(false)}
                onChange={item => {
                    setBosquetData(item.value);
                    setBosquetPrice(item.price)
                    setIsBosquetFocus(false);
                }}
                />
            <View style={{ marginBottom:20}}/>
                </>
            }

            {AIRTIMECHECK &&
                <>
                <Text style={styles.label}>Amount</Text>
                <Input placeholder={"Enter Amount"} maxLength={11} value={amount} onUpdateValue={updatevalue.bind(this, 'amount')}  keyboardType={'numeric'}/>
                {!amountCheck && 
                    <Text style={{marginBottom:20, color:'red'}}>Amount must be <MaterialCommunityIcons name="currency-ngn" size={14} />100 and above</Text>
                }
                </>
            }

            {self && 
            <>
            <Text style={styles.label}>Phone Number</Text>
            <Input placeholder={"Phone Number"} maxLength={11} value={self === "self" ? authCtx.phone : phoneValidation} onUpdateValue={updatevalue.bind(this, 'phonevalidation')}  keyboardType={'numeric'} editable={self === "self" ? false : true}/>
            </>
            }

            {!id || !self   ? "" : 
              <View style={{marginHorizontal:20, marginTop:20}}>
                <SubmitButton message={"Submit"} onPress={TopupAirtime}/>
              </View>
            }
          </View>
          </>

        }

          <Modal isVisible={isSetpinModalVisible}>
            <Pressable  onPress={Keyboard.dismiss} style={styles.centeredView}>
            <TouchableOpacity style={{justifyContent:'flex-end', alignSelf:'flex-end', marginBottom:5, }} onPress={() => [toggleModal1(), setCode('')]}>
                <MaterialIcons name="cancel" size={30} color="white" />
            </TouchableOpacity>

            <View style={styles.modalView1}>
              {
                ischecking ? 
                <View style={{flex:1, marginTop: 30, marginBottom: 70}}>
                    <LoadingOverlay/>  
                </View>

                :
              <>
            <View style={{marginTop: '13%'}}/>
                <Text style={{fontFamily:'poppinsRegular'}}>Enter Transaction Pin</Text>

                <OTPFieldInput
                  setPinReady={setPinReady}
                  code={code}
                  setCode={setCode}
                  maxLength={MAX_CODE_LENGTH}
                />
                {
                  pinerrormessage.length !== 0 && <Text  style={{fontSize:11, textAlign:'center', color:Color.tomato}}>{pinerrormessage}</Text>
                }
            <StyledButton disabled={!pinReady} 
            onPress={() => [handleClick(), pinValidateCheck()]}
            style={{
                backgroundColor: !pinReady ? Color.grey : Color.darkolivegreen_100
            }}>
                <ButtonText
                style={{
                    color: !pinReady ? Color.black : Color.white
                }}
                >Submit</ButtonText>
            </StyledButton>
            </>
            }
            </View>
            </Pressable>
        </Modal>



            <Modal isVisible={isModalVisble}>
            <SafeAreaView style={styles.centeredView}>

            <TouchableOpacity style={{justifyContent:'flex-end', alignSelf:'flex-end', marginBottom:5, }} onPress={() => [toggleModal(), navigation.goBack()]}>
              <MaterialIcons name="cancel" size={30} color="white" />
            </TouchableOpacity>
            <View style={styles.modalView}>
            <Image source={require("../assets/igoepp_transparent2.png")} style={{height:130, width:130, position:'absolute', alignContent:'center', alignSelf:'center', top:DIMENSION.HEIGHT * 0.1,justifyContent:'center', opacity:0.3, }} contentFit='contain'/>
              <Text style={styles.modalText}>Reciept</Text>
                {/* <Text style={{fontFamily:'poppinsRegular'}}>------------------------------</Text> */}
                {
                  Platform.OS === "android" ? 
                    <View style={{borderBottomWidth:0.5, marginTop:5, borderStyle:"dashed"}}/>
                  :
                   <View style={{borderBottomWidth:0.5, marginTop:5}}/>
                }
                
                  <View style={{marginBottom:10, marginTop:25}}>
                      
                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Phone Number</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{self === "self"  ? authCtx.phone : phoneValidation}</Text>
                      </View>

                       <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>{DATACHECK ? "Data Price" : "Airtime Price"} :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{DATACHECK ? bosquetPrice : amount }</Text>
                      </View>

                      {DATACHECK &&
                         <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                         <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Data Plan :</Text>
                         <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{bosquetData}</Text>
                       </View> 
                      }


                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Ref :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{requestId}</Text>
                      </View> 

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Date :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{date} {time}</Text>
                      </View>

                       <View style={{flexDirection:'row', justifyContent:'space-evenly', alignItems:'center', marginTop: 20,}}>
                        
                          <TouchableOpacity style={{}} onPress={() => {}}>
                                <Text><Entypo name="forward" size={24} color="black" /></Text>
                          </TouchableOpacity>

                          <TouchableOpacity style={{}} onPress={() => [toggleModal(),  navigation.goBack()]}>
                              <Text style={{}}>Close</Text>
                          </TouchableOpacity>
                        </View>
                    </View>              
            </View>
            </SafeAreaView>
          </Modal>
    </ScrollView>
  )
}

export default VirtualTopUp

const styles = StyleSheet.create({
  cancel:{
    backgroundColor:Color.darkolivegreen_100,
    borderColor: Color.darkolivegreen_100,
    borderWidth: 1,
    justifyContent:'center',
    borderRadius: 3,
    width: DIMENSION.WIDTH * 0.36,
    padding: 5
  },
  modalView1: {
    backgroundColor: 'white',
    width: DIMENSION.WIDTH  * 0.9,
    borderRadius: 20,
    // flex:1,
    alignItems:'center',
    height: DIMENSION.HEIGHT * 0.4
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
    width: DIMENSION.WIDTH  * 0.9,
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
  image:{
    width: 40,
    height: 40,
    borderRadius:100,
    padding:10,
  },
  internettxt:{
    fontSize: 18,
    color: Color.new_color,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
    marginBottom:15,
  }, 
  dropdown: {
    maxHeight: 70,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    padding:10,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  }, 
  placeholderStyle: {
    fontSize: 12,
  },
  selectedTextStyle:{
    fontSize:12
  }
})