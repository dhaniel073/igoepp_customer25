import { Alert, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, TextInput, Pressable, Keyboard } from 'react-native'
import React, {useState, useContext, useEffect, useRef} from 'react'
import { Color, DIMENSION, marginStyle } from '../Component/Ui/GlobalStyle'
import GoBack from '../Component/Ui/GoBack'
import Input from '../Component/Ui/Input'
import SubmitButton from '../Component/Ui/SubmitButton'
import { Dropdown } from 'react-native-element-dropdown'
import { Image, ImageBackground } from 'expo-image'
import {MaterialIcons, MaterialCommunityIcons, Entypo} from '@expo/vector-icons'
import Modal from 'react-native-modal'
import { AuthContext } from '../utils/AuthContext'
import { CustomerBillerCommission, CustomerInfoCheck, TvPayment, TvRenewalPay, ValidatePin, ValidateTv } from '../utils/AuthRoute'
import axios from 'axios'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'
import * as Notifications from 'expo-notifications'
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


const Television = ({route, navigation}) => {
  const [category, setcategory] = useState([])
  const [isLoading, setisLoading] = useState(false)
  const [isFocus, setisFocus] = useState()
  const [id, setid] = useState()
  const [bouquet, setBouquet] = useState([])
  const [price, setPrice] = useState()
  const [rprice, setRPrice] = useState()
  const [smartcard, setSmartCard] = useState('')
  const [isbouquetfocus, setIsBouquetFocus] = useState(false)
  const [ref, setRef] = useState()
  const [username, setUserName] = useState()
  const [bouquetData, setBouquetData] = useState()
  const [isModalVisble, setIsModalVisible] = useState(false)
  const [isCompleteModalVisble, setIsCompleteModalVisible] = useState(false)

  const [code, setCode] = useState('')
  const [pinReady, setPinReady] = useState(false)
  const MAX_CODE_LENGTH = 4;

  const maindate = new Date() 
  const date = maindate.toDateString()
  const time = maindate.toLocaleTimeString()

  
  const [pinT, setpinT] = useState()
  const [pinvalid, setpinvalid] = useState(false)
  const [pincheckifempty, setpincheckifempty] = useState([])
  const [isSetpinModalVisible, setisSetpinModalVisible] = useState(false)
  const [pinerrormessage, setPinerrorMessage] = useState('')
  const [ischecking, setischecking] = useState(false)
  const [commissonvalue, setcommissonvalue] = useState()


  const authCtx = useContext(AuthContext)
  const authId = route?.params?.id

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        setisLoading(true)
        const response = await CustomerInfoCheck(authCtx.Id, authCtx.token)
        setpincheckifempty(response.transaction_pin_setup)
        setisLoading(false)
      } catch (error) {
        setisLoading(true)
        Alert.alert('Error', "An error occured try again later", [
          {
            text:"Ok",
            onPress: () => navigation.goBack()
          }
        ])
        setisLoading(false)
        // return;
      }
    })
    return unsubscribe;
  }, [])

  useEffect(() => {
    setisLoading(true)
    const url = `https://igoeppms.com/igoepp/public/api/auth/billpayment/getAllBillersByCategory/${authId}`
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
        return;
      })
      setisLoading(false)
  }, [])

  const getBouquets = (value) => {
    // console.log(authId, id)
    
    const url = `https://igoeppms.com/igoepp/public/api/auth/billpayment/getAllBouquetByBillerID/${authId}/${value}`
    const response = axios.get(url, {
        headers:{
            Accept:'application/json',
            Authorization: `Bearer ${authCtx.token}`
        }
    }).then((res) => {
        var count = Object.keys(res.data.data.bouquets).length;
        let catarray = []
        for (var i = 0; i < count; i++){
            catarray.push({
                label: res.data.data.bouquets[i].name,
                value: res.data.data.bouquets[i].code,
                price: res.data.data.bouquets[i].price
            })
        }
        setBouquet(catarray)
    }).catch((error) => {
        // console.log(error.response.data)
        return;
    })
  }

  const updatehandleValue = (inputType, enteredValue) => {
    switch (inputType) {
      case 'smartcardId':
        setSmartCard(enteredValue)
        break;
    }
  }

  const toggleModal =  () => {
    setIsModalVisible(!isModalVisble)
  }

  const toggleConfirmModal =  () => {
    setIsCompleteModalVisible(!isCompleteModalVisble)
  }


  const validateTv = async () => {
    try {
      setisLoading(true)
      const response = await ValidateTv(authCtx.Id, id, smartcard, authCtx.token)
      // console.log(response.data)
      if(response.data.status === "Success"){
        if(id === "DSTVR" || id === "GOTVR"){
        setRef(response.data.requestID)
        setUserName(response.data.customerName)
        setRPrice(response.data.dueAmount)
        toggleConfirmModal()
        }else{
        setRef(response.data.requestID)
        setUserName(response.data.customerName)
        toggleConfirmModal()
        }
      }else{
        Alert.alert("Failed", response.data, [
          {
            text:"Ok",
            onPress:() => navigation.goBack()
          }
        ])
      }
      setisLoading(false)
    } catch (error) {
      setisLoading(true)
      Alert.alert("Sorry", "An error occured try again later", [
        {
          text:"Ok",
          onPress: () => navigation.goBack()
        }
      ])
      setisLoading(false)
      return;
      
    }
  }

  // console.log(ref)

  const tvRenewalPayment = async (data) => {
    toggleModal1()
    try {
      setisLoading(true)
      const response = await TvRenewalPay(ref, rprice, authCtx.token, commissonvalue)
      // console.log(response.data)  
      // if(response.data.status){
        if(response.data.message === "failed" || "Failed" && response.data.description === "Insufficient wallet balance"){
          Alert.alert("Failed", response.data.description, [
            {
              text:"Ok",
              onPress:() => navigation.goBack()
            }
          ])
        }else{
          schedulePushNotification(response)
          setRef(response.data.requestID)
          setRPrice(response.data.dueAmount)
          toggleModal()
        }
      setisLoading(false)
    } catch (error) {
      setisLoading(true)
      Alert.alert("Sorry", "An error occured try again later", [
        {
            text:"Ok",
            onPress: () => navigation.goBack()
        }
    ])
      // console.log(error.response.data)
      setisLoading(false)
      return;
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
  const tvPayment = async () => {
    toggleModal1()
    try {
        setisLoading(true)
        const response = await TvPayment(ref, price, bouquetData, authCtx.token, commissonvalue)
        // console.log(response.data)
        
        if(response.data.message === "failed" || "Failed" && response.data.description === "Insufficient wallet balance"){
          Alert.alert("Failed", response.data.description, [
            {
              text:"Ok",
              onPress:() => navigation.goBack()
            }
          ])
        }else{
          schedulePushNotification(response)
          setRef(response.data.requestID)
          toggleModal()
        }
      setisLoading(false)
    } catch (error) {
      setisLoading(true)
      // console.log(error)
      Alert.alert("Error", "An error occured please try again later", [
        {
          text:'Ok',
          onPress: () => navigation.goBack()
        }
      ])
      setisLoading(false)
      return;
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
        if(id === "DSTVR" || id === "GOTVR"){
          tvRenewalPayment() 
        }else{
          tvPayment()
        }
      } catch (error) {
        setischecking(true)
        setCode('')
        setPinerrorMessage(error.response.data.message + "\n" + (3 - refT.current + ` trial${3-refT.current > 1 ? 's' : ""} remaining`))
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

  
  async function schedulePushNotification(response) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${id === "DSTVR" ? "Dstv Renewal" : id === "GOTVR" ? "Gotv Renewal" : id} Subscription 🔔`,
        body: `${id === "DSTVR" ? "Dstv Renewal" : id === "GOTVR" ? "Gotv Renewal" : id + "Subscription"}  ${response.data.message}\nAmount: ${id === "DSTVR" || id === "GOTVR" ? rprice : price}\nSmartCard Number: ${smartcard}\nRef: ${response.data.requestID}\nDate: ${date} ${time}`,
        data: { data: 'goes here' },
      },
      trigger: { seconds: 10 },
    });
  }

  // console.log(smartcard)
  if(isLoading){
    return <LoadingOverlay message={"..."}/>
  }

  return (
    <ScrollView style={{marginTop:marginStyle.marginTp, marginHorizontal:10}} showsVerticalScrollIndicator={false}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <Text style={styles.tvtxt}>Television</Text>

    {
      pincheckifempty === "N" ? Alert.alert("Message", "No transaction pin, set a transaction pin to be able to make transactions", [
        {
          text: "Ok",
          onPress: () => navigation.navigate('TransactionPin')
        },
        {
          text: "Cancel",
          onPress: () => navigation.goBack()
        }
      ]) 
      :
      <>

   <ImageBackground style={{flexDirection:'row', alignItems:'center', justifyContent:'space-evenly',}}>
        <Image contentFit='contain' source={require("../assets/dstv-logo.png")} style={[styles.image]}/>
        <Image source={require("../assets/GOtv.png")} style={styles.image}/>
        <Image contentFit='contain' source={require("../assets/showmax.png")} style={styles.image}/>
        <Image contentFit='contain' source={require("../assets/startimes-logo.jpg")} style={styles.image}/>
      </ImageBackground>

      <View style={{marginTop:10}}/>
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
        placeholder={!isFocus ? 'Select Satellite Network' : '...'}
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

            {id === "DSTVR" || id === "GOTVR" ? "" : 
              <>
                <View style={{marginTop:20}}/>
                  {/* <Text style={styles.label}>Select Tv Type</Text> */}

                  <Dropdown
                  style={[styles.dropdown, isbouquetfocus && { borderColor: 'blue' }]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={bouquet}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isbouquetfocus ? 'Select Plan' : '...'}
                  searchPlaceholder="Search..."
                  value={bouquetData}
                  onFocus={() => setIsBouquetFocus(true)}
                  onBlur={() => setIsBouquetFocus(false)}
                  onChange={item => {
                      setBouquetData(item.value);
                      setPrice(item.price)
                      setIsBouquetFocus(false);
                  }}
                  />
                <View style={{ marginBottom:10}}/>
              </>

            }

            {id === "DSTVR" || id === "GOTVR" ? "": price &&
              <>
                <Text style={styles.label}>Price</Text>
                <Input placeholder={"Amount to fund with"} value={price} editable={false}/>
              </>
            }

            { id === "DSTVR" || id === "GOTVR" ? 
              <>
                  <Text style={styles.label}></Text>
                  <Text style={styles.label}>SmartCard Number</Text>
                  <Input placeholder={`Enter SmartCard Number `} value={smartcard} onUpdateValue={updatehandleValue.bind(this, 'smartcardId')}/>
                </>
                : price && 
                <>
                  <Text style={styles.label}></Text>
                  <Text style={styles.label}>SmartCard Number</Text>
                  <Input placeholder={`Enter SmartCard Number `} value={smartcard} onUpdateValue={updatehandleValue.bind(this, 'smartcardId')}/>
              </>
            }

            {
              smartcard && id ?
              <View style={{marginHorizontal:20, marginTop:20}}>
                  <SubmitButton message={"Submit"} onPress={validateTv}/>
              </View>
              : null
            }
        </View>
        </>
      }

          <Modal isVisible={isCompleteModalVisble}>
            <SafeAreaView style={styles.centeredView}>
            <TouchableOpacity style={{justifyContent:'flex-end', alignSelf:'flex-end', marginBottom:5, }} onPress={() => [toggleConfirmModal(), navigation.goBack()]}>
              <MaterialIcons name="cancel" size={30} color="white" />
            </TouchableOpacity>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Confirm Payment</Text>  
                  <View style={{marginBottom:10, marginTop:25}}>

                  <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                    <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>SmartCard Pin :</Text>
                    <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{smartcard}</Text>
                  </View>

                  <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                    <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Customer Name:</Text>
                    <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{username}</Text>
                  </View>


                    <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                    <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Amount :</Text>
                    <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{id === "DSTVR" || id === "GOTVR" ? rprice : price}</Text>
                  </View>

                  <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                    <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Ref :</Text>
                    <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{ref}</Text>
                  </View> 

                  <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                    <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Date :</Text>
                    <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{date} {time}</Text>
                  </View>

                    <View style={{flexDirection:'row', justifyContent:'space-evenly', alignItems:'center', marginTop: 20,}}>
                    
                      <TouchableOpacity style={styles.viewbtn} onPress={() => toggleConfirmModal()}>
                            <Text style={styles.viewtext}>Back</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.cancelbtn} onPress={() => [toggleConfirmModal(), toggleModal1()]}>
                          <Text style={styles.canceltext}>Cofirm</Text>
                      </TouchableOpacity>
                    </View>
                </View>              
            </View>
            </SafeAreaView>
          </Modal>


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
                {
                  Platform.OS === "android" ? 
                    <View style={{borderBottomWidth:0.5, marginTop:5, borderStyle:"dashed"}}/>
                  :
                   <View style={{borderBottomWidth:0.5, marginTop:5}}/>
                }
                
                  <View style={{marginBottom:10, marginTop:25}}>
                      
                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>SmartCard Pin :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{smartcard}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Customer Name:</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{username}</Text>
                      </View>

                       <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Amount Funded :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{id === "DSTVR" || id === "GOTVR" ? rprice : price}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Ref :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{ref}</Text>
                      </View> 

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Date :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{date} {time}</Text>
                      </View>

                       <View style={{flexDirection:'row', justifyContent:'space-evenly', alignItems:'center', marginTop: 20,}}>
                        
                          <TouchableOpacity style={styles.sharebtn} onPress={() => navigation.goBack()}>
                                <Text><Entypo name="forward" size={24} color="black" /></Text>
                          </TouchableOpacity>

                          <TouchableOpacity style={styles.sharebtn} onPress={() => [toggleModal(), navigation.goBack()]}>
                              <Text>Close</Text>
                          </TouchableOpacity>
                        </View>
                    </View>              
               </View>
            </SafeAreaView>
          </Modal>
    </ScrollView>
  )
}

export default Television

const styles = StyleSheet.create({
  sharebtn:{
    justifyContent:'center',
    alignItems:'center',
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
  viewbtn:{
    backgroundColor:Color.white,
    borderColor: Color.brown,
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
    color: Color.brown
  },
  cancelbtn: {
    backgroundColor: Color.darkolivegreen_100,
    borderRadius: 3,
    justifyContent:'center',
    width: DIMENSION.WIDTH * 0.36,
    padding: 5
  },
  canceltext:{
    fontFamily: 'poppinsMedium',
    fontSize: 12,
    color: Color.white,
    textAlign: "center",
  },
  image:{
    width: 60,
    height: 60,
    borderRadius:100,
    padding:10,
  },
  tvtxt:{
    fontSize: 16,
    color: Color.darkolivegreen_100,
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
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    width: DIMENSION.WIDTH  * 0.9,
    borderRadius: 20,
    padding: 25,
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
    textAlign: 'center',
    fontSize:18, 
    fontFamily:'poppinsRegular'
  },
})