import { Alert, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, TextInput, Keyboard } from 'react-native'
import React, { useContext, useState, useEffect, useRef } from 'react'
import { Color, DIMENSION, marginStyle } from '../Component/Ui/GlobalStyle'
import GoBack from '../Component/Ui/GoBack'
import Input from '../Component/Ui/Input'
import { Dropdown } from 'react-native-element-dropdown'
import SubmitButton from '../Component/Ui/SubmitButton'
import { CartCheckout, CartCheckoutCash, CustomerInfoCheck, ValidatePin } from '../utils/AuthRoute'
import { AuthContext } from '../utils/AuthContext'
import {Ionicons, Entypo, MaterialCommunityIcons, MaterialIcons, FontAwesome5} from '@expo/vector-icons'
import axios from 'axios'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'
import * as Notification from 'expo-notifications'
import Modal from 'react-native-modal'
import OTPFieldInput from '../Component/Ui/OTPFieldInput'

import styled from 'styled-components'

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
  { label: 'Cash ', value: 'C' },
  { label: 'Wallet ', value: 'W' },

];


const CheckOut = ({navigation, route}) => {
  const priceToShow = route?.params?.price
  const maindate = new Date() 
  const date = maindate.toDateString()
  const time = maindate.toLocaleTimeString()
  const authCtx = useContext(AuthContext)
  const [first_name, setFirstName] = useState()
  const [last_name, setLastName] = useState()
  const [phone, setPhone] = useState()
  const [address, setAddress] = useState()
  const [landmark, setLandmark] = useState()
  const [email, setEmail] = useState('')

  const [firstnameinvalid, setfirstnameinvalid] = useState(false)
  const [lastnameinvalid, setlastnameinvalid] = useState(false)
  const [phoneinvalid, setphoneinvalid] = useState(false)
  const [addressinvalid, setaddressinvalid] = useState(false)
  const [landmarkinvalid, setlamdmarkinvalid] = useState(false)
  const [emailinvalid, setemailinvalid] = useState(false)
  const [countryinvalid, setcountryinvalid] = useState(false)
  const [stateinvalid, setstateinvalid] = useState(false)
  const [cityinvalid, setcityinvalid] = useState(false)
  const [paymentinvalid, setpaymentinvalid] = useState(false)


  // console.log(priceToShow)

  const [paymentmethod, setPaymentMethod] = useState('')

  const [isCountryFocus, setIsCountryFocus] = useState(false);
  const [isStateFocus, setIsStateFocus] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [isCityFocus, setIsCityFocus] = useState(false);

  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);

  const [country, setCountry] = useState([]);
  const [state, setState] = useState([]);
  const [city, setCity] = useState([]);


  const [countryName, setCountryName] = useState('');
  const [stateName, setStateName] = useState('');
  const [cityName, setCityName] = useState('');

  const [isLoading,setIsLoading]=useState(false)

  const  [pin, setpin] = useState()
  const [pinvalid, setpinvalid] = useState(false)
  const [isSetpinModalVisible, setisSetpinModalVisible] = useState(false)
  const [pincheckifempty, setpincheckifempty] = useState([])
  const [pinerrormessage, setPinerrorMessage] = useState('')
  const [ischecking, setischecking] = useState(false)

  const [code, setCode] = useState('')
  const [pinReady, setPinReady] = useState(false)
  const MAX_CODE_LENGTH = 4;


  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    // alert('You clicked ' + ref.current + ' times!');
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        setIsLoading(true)
        const response = await CustomerInfoCheck(authCtx.Id, authCtx.token)
        setpincheckifempty(response.transaction_pin_setup)
        setIsLoading(false)
      } catch (error) {
        setIsLoading(true)
        setIsLoading(false)
        return;
      }
    })
    return unsubscribe;
  }, [])

  useEffect(() => {
    var config = {
      method: 'get',
      url: "https://phixotech.com/igoepp/public/api/auth/general/country",
      headers:{
        Accept: 'application/json',
        Authorization: `Bearer ${authCtx.token}`
      } 
    }

    axios (config)
    .then(function (response) {
      console.log(JSON.stringify(response.data.data))
      var count = Object.keys(response.data.data).length
      // console.log(count)
      let countryArray = []
      for (var i = 0; i < count; i++){
        countryArray.push({
          label: response.data.data[i].country_name,
          value: response.data.data[i].id,
        })
        // setCountryCode(response.data.data[i].id)
      }
      setCountryData(countryArray)
    })
    .catch(function (error) {
      // console.log(error);
      return;
    })
  }, [])

  const handleState = (countryCode) => {
    var config = {
      method: 'get',
      url: `https://phixotech.com/igoepp/public/api/auth/general/state/${countryCode}`,
      headers:{
        Accept: 'application/json',
        Authorization: `Bearer ${authCtx.token}`
      }
    }
    axios(config)
    .then(function (response) {
        console.log(JSON.stringify(response.data))
      var count = Object.keys(response.data.data).length;
      let stateArray = []
      for (var i = 0; i < count; i++){
        stateArray.push({
          label: response.data.data[i].state_name,
          value: response.data.data[i].id,
        })
        // setStateCode(response.data.data[i].id)
      }
      setStateData(stateArray)
    })
    .catch(function (error) {
        console.log(error.response);
        return;
    })
  }

const handleCity = (countryCode, stateCode) => {
    // console.log(`http://phixotech.com/igoepp/public/api/auth/general/lga/${stateCode}`)
    var config = {
      method: 'get',
      url: `https://phixotech.com/igoepp/public/api/auth/general/lga/${stateCode}`,
      headers:{
        Accept: 'application/json',
        Authorization: `Bearer ${authCtx.token}`
      }
    }

    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data))
      var count = Object.keys(response.data.data).length;
      let cityArray = []
      for (var i = 0; i < count; i++){
        cityArray.push({
          label: response.data.data[i].lga_name,
          value: response.data.data[i].id,
        })
        // setCityCode(response.data.data[i].lga_code)
      }
      setCityData(cityArray)
    })
    .catch(function (error) {
      // console.log(error);
      return;

    })
  }

  const toggleModal1 = () => {
    setisSetpinModalVisible(!isSetpinModalVisible)
  }

  async function CheckoutHandler(){
    const emailICheck = email.includes('@') && email.includes(".com")
    const firstnamecheck = first_name === null || first_name === undefined ||  first_name === ""
    const lastnamecheck = last_name === null || last_name === undefined ||  last_name === ""
    const landmarkcheck = landmark === null || landmark === undefined ||  landmark === ""
    const phonecheck = phone === null || phone === undefined ||  phone === "" || phone.length === 0
    const addresscheck = address === null || address === undefined ||  address === ""
    const countrycheck = countryName === null || countryName === undefined ||  countryName === ""
    const statecheck = stateName === null || stateName === undefined ||  stateName === ""
    const citycheck = cityName === null || cityName === undefined ||  cityName === ""
    const paymentcheck = paymentmethod === null || paymentmethod === undefined ||  paymentmethod === ""



    // console.log(phonecheck)
    // console.log(emailICheck,firstnamecheck,lastnamecheck,landmarkcheck,phonecheck,addresscheck,countrycheck,statecheck,citycheck)

    if(!emailICheck || firstnamecheck || lastnamecheck || landmarkcheck || phonecheck || addresscheck || countrycheck || statecheck || citycheck){
      Alert.alert("Invalid Entry", "Check all fields and try again")
      setfirstnameinvalid(firstnamecheck)
      setlastnameinvalid(lastnamecheck)
      setphoneinvalid(phonecheck)
      setaddressinvalid(addresscheck)
      setlamdmarkinvalid(landmarkcheck)
      setemailinvalid(!emailICheck)
      setcountryinvalid(countrycheck)
      setstateinvalid(statecheck)
      setcityinvalid(citycheck)
      setpaymentinvalid(paymentcheck)
    }else{
      toggleModal1()
    }
  }

  const pinValidateCheck = async () => {
    if(ref.current > 3){
      Alert.alert("", "To many pin trials try again later", [
        {
          text: "Ok",
          onPress: () => {}
        }
      ])
    }else{
      try {
        setischecking(true)
        const response = await ValidatePin(authCtx.Id, code, authCtx.token)
        // console.log(response)
        setCode('')
        MakePurchase()
        setischecking(false)
      } catch (error) {
        setischecking(true)
        setCode('')
        setPinerrorMessage(error.response.data.message + "\n" + (3 - ref.current + ` trial${3-ref.current > 1 ? 's' : ""} remaining`))
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

  const MakePurchase= async () => {
    toggleModal1()
    try {
      setIsLoading(true)
      if(paymentmethod === "W"){
        const response = await CartCheckout(first_name,last_name,address,landmark,phone,email,stateName,cityName,countryName,authCtx.Id,paymentmethod,authCtx.token)
        // console.log(response)
          if(response.message !== 'success'){
            Alert.alert('Purchase Failed', response.message,[
              {
                text: 'OK',
                onPress: () => navigation.goBack()
              }
            ])
          }else{
            // if(response.message !== 'success'){
              schedulePushNotification()
              Alert.alert('Successful', 'item purchased successfully',[
                {
                  text: 'OK',
                  onPress: () => navigation.goBack()
                }
              ])
            // }
          }
      }else{
        const response = await CartCheckoutCash(first_name,last_name,address,landmark,phone,email,stateName,cityName,countryName,authCtx.Id,paymentmethod,authCtx.token)
        // console.log(response)
          if(response.message !== 'success'){
            Alert.alert('Purchase Failed', response.message,[
              {
                text: 'OK',
                onPress: () => navigation.goBack()
              }
            ])
          }else{
            // if(response.message !== 'success'){
              schedulePushNotification()
              Alert.alert('Successful', 'item purchased successfully',[
                {
                  text: 'OK',
                  onPress: () => navigation.goBack()
                }
              ])
            //}
          }
      }
      setIsLoading(false)
      } catch (error) {
        setIsLoading(true)
        console.log(error.response)
        Alert.alert("", error.response.data.message, [
          {
            text: "OK",
            onPress: () => navigation.goBack()
          }
        ])
        setIsLoading(false)
      }
  }

  async function schedulePushNotification() {
    const askPermision = Notification.requestPermissionsAsync()
    await Notification.scheduleNotificationAsync({
      content: {
      //   title: "You've got mail! 📬",
        title: `Cart Item Purchase 🔔`,
        body: `You successfully purchase all items in your cart.\nAmount: NGN${priceToShow}\nDate: ${date} ${time}`,
        data: { data: 'goes here' },
      },
      trigger: { seconds: 10 },
    });
  }

  if(isLoading){
    return <LoadingOverlay message={"..."}/>
  }
  return (
    <ScrollView style={{marginTop:marginStyle.marginTp, marginHorizontal:10, flex:1}} showsVerticalScrollIndicator={false}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <Text style={styles.checkouttxt}>CheckOut</Text>

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


      <ScrollView style={{ margin: 10}} showsVerticalScrollIndicator={false}>
      {/* <Ionicons style={{ marginTop: Platform.OS === 'ios' ? 10 : 0 }}  size={20} color={'black'} name="person"/>   */}
      <View style={{flexDirection:'row', flex:1}}>
      <View style={{flex:1, marginRight:5}}>
        <Input
          placeholder="First Name"
          placeholderTextColor="#666666"
          onUpdateValue={setFirstName}
          autoCorrect={false}
          autoCapitalize='sentences'
          value={first_name}
          isInvalid={firstnameinvalid}
          onFocus={() => setfirstnameinvalid(false)}
          // autoCapitalize={true}
          />      
      </View>

      {/* <Ionicons size={20} style={{ marginTop: Platform.OS === 'ios' ? 10 : 0 }} color={'black'} name="person"/> */}
      <View style={{flex:1, marginLeft:5}}>
      <Input
        placeholder="Last Name"
        placeholderTextColor="#666666"
        onUpdateValue={setLastName}
        autoCorrect={false}
        autoCapitalize='sentences'
        value={last_name}
        isInvalid={lastnameinvalid}
        onFocus={() => setlastnameinvalid(false)}
        // autoCapitalize={true}
      />  
      </View>    
      </View>
    
      {/* <Ionicons style={{ marginTop: Platform.OS === 'ios' ? 10 : 0 }}  size={20} color={'black'} name="call"/> */}
      <Input
        placeholder="Phone number"
        onUpdateValue={setPhone}
        placeholderTextColor="#666666"
        autoCorrect={false}
        autoCapitalize='none'
        value={phone}
        maxLength={11}
        keyboardType="numeric"
        isInvalid={phoneinvalid}
        onFocus={() => setphoneinvalid(false)}
      />        

      {/* <Ionicons style={{ marginTop: Platform.OS === 'ios' ? 10 : 0 }}  size={20} color={'black'} name="mail"/> */}
      <Input
        placeholder="Email"
        onUpdateValue={setEmail}
        placeholderTextColor="#666666"
        autoCorrect={false}
        autoCapitalize='none'
        value={email}
        keyboardType="email-address"
        isInvalid={emailinvalid}
        onFocus={() => setemailinvalid(false)}
      />      

      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: 'blue' }, paymentinvalid && styles.invalid]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Select Payment Method' : '...'}
        searchPlaceholder="Search..."
        value={paymentmethod}
        onFocus={() => [setIsFocus(true), setpaymentinvalid(false)]}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setPaymentMethod(item.value);
          setIsFocus(false);
        }}
        //   onChangeText={updateInputValueHandler.bind(this, 'sex')}
        renderLeftIcon= {() => (
          <MaterialIcons name="payments" style={{marginRight:5}} size={24} color="black" />
        )}
      />

      {/* <Entypo style={{ marginTop: Platform.OS === 'ios' ? 10 : 0 }}  name="address" size={24} color="black" /> */}
      <Input
        placeholder="Address"
        onUpdateValue={setAddress}
        placeholderTextColor="#666666"
        autoCorrect={false}
        value={address}
        // keyboardType="email-address"
        isInvalid={addressinvalid}
        onFocus={() => setaddressinvalid(false)}
      />      

      {/* <FontAwesome5 name="landmark" size={24} color="black" /> */}
      <Input
        placeholder="Landmark"
        onUpdateValue={setLandmark}
        placeholderTextColor="#666666"
        autoCorrect={false}
        value={landmark}
        isInvalid={landmarkinvalid}
        onFocus={() => setlamdmarkinvalid(false)}
      />      

      <Dropdown
        style={[styles.dropdown, isCountryFocus && { borderColor: 'blue' }, countryinvalid && styles.invalid]}
        placeholderStyle={[styles.placeholderStyle, {fontFamily: 'poppinsRegular'}]}
        selectedTextStyle={[styles.selectedTextStyle, {fontFamily: 'poppinsRegular'}]}
        inputSearchStyle={[styles.inputSearchStyle, {fontFamily: 'poppinsRegular'}]}
        iconStyle={styles.iconStyle}
        data={countryData}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isCountryFocus ? 'Select Country' : '...'}
        searchPlaceholder="Search..."
        value={country}
        onFocus={() => [setIsCountryFocus(true), setcountryinvalid(false)]}
        onBlur={() => setIsCountryFocus(false)}
        onChange={item => {
          setCountry(item.value);
          handleState(item.value);
          setCountryName(item.label)
          setIsCountryFocus(false);
        }}
        renderLeftIcon={() => (
          <Entypo name="globe" size={24} style={{marginRight:5}} color="black" />
        )}
        />

        <Dropdown
          style={[styles.dropdown, isStateFocus && { borderColor: 'blue' }, stateinvalid && styles.invalid]}
          placeholderStyle={[styles.placeholderStyle, {fontFamily: 'poppinsRegular'}]}
          selectedTextStyle={[styles.selectedTextStyle, {fontFamily: 'poppinsRegular'}]}
          inputSearchStyle={[styles.inputSearchStyle, {fontFamily: 'poppinsRegular'}]}
          iconStyle={styles.iconStyle}
          data={stateData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isStateFocus ? 'Select State' : '...'}
          searchPlaceholder="Search..."
          value={state}
          onFocus={() => [setIsStateFocus(true), setstateinvalid(false)]}
          onBlur={() => setIsStateFocus(false)}
          onChange={item => {
            setState(item.value);
            handleCity(country, item.value)
            setStateName(item.label)
            setIsStateFocus(false);
          }}
          renderLeftIcon={() => (
            <Entypo name="location" size={24} style={{marginRight:5}} color="black" />
          )}
        />

        
        <Dropdown
          style={[styles.dropdown, isCityFocus && { borderColor: 'blue' }, cityinvalid && styles.invalid]}
          placeholderStyle={[styles.placeholderStyle, {fontFamily: 'poppinsRegular'}]}
          selectedTextStyle={[styles.selectedTextStyle, {fontFamily: 'poppinsRegular'}]}
          inputSearchStyle={[styles.inputSearchStyle, {fontFamily: 'poppinsRegular'}]}
          iconStyle={styles.iconStyle}
          data={cityData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isCityFocus ? 'Select City' : '...'}
          searchPlaceholder="Search..."
          value={city}
          onFocus={() => [setIsCityFocus(true), setcityinvalid(false)]}
          onBlur={() => setIsCityFocus(false)}
          onChange={item => {
            setCity(item.value);
            setCityName(item.label)
            setIsCityFocus(false);
          }}
          renderLeftIcon={() => (
            <MaterialCommunityIcons name="city-variant-outline" style={{marginRight:5}} size={24} color="black" />
          )}
        />
        <View style={{marginBottom:'10%',marginTop: '5%',  marginHorizontal:15}}>
          <SubmitButton onPress={CheckoutHandler} message={'Submit'}/>
        </View>
        </ScrollView>
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

    </ScrollView>
  )
}

export default CheckOut

const styles = StyleSheet.create({
  invalid:{
    backgroundColor: Color.error100
  },
  modalView1: {
    backgroundColor: 'white',
    width: DIMENSION.WIDTH  * 0.9,
    borderRadius: 20,
    // flex:1,
    alignItems:'center',
    height: DIMENSION.HEIGHT * 0.4
  },
  checkouttxt:{
    fontSize: 18,
    color: Color.darkolivegreen_100,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
    marginBottom:15,
  }, 
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5
  },
  textInput:{
    flex: 1,
    fontFamily: 'poppinsRegular',
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    padding:5,
    color: '#05375a',
    fontSize: 15,
    top: 5,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 10
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  }, 
  placeholderStyle: {
    fontSize: 14,
    color: Color.gray
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
    fontSize:14, 
    fontFamily:'poppinsRegular'
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
})