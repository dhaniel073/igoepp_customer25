import { Alert, Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { Color, marginStyle } from '../Component/Ui/GlobalStyle'
import GoBack from '../Component/Ui/GoBack'
import Input from '../Component/Ui/Input'
import { Dropdown } from 'react-native-element-dropdown'
import SubmitButton from '../Component/Ui/SubmitButton'
import { CartCheckout } from '../utils/AuthRoute'
import { AuthContext } from '../utils/AuthContext'
import {Ionicons, Entypo, MaterialCommunityIcons, MaterialIcons, FontAwesome5} from '@expo/vector-icons'
import axios from 'axios'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'
import * as Notification from 'expo-notifications'

const data = [
  // { label: 'Cash ', value: 'C' },
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


  console.log(priceToShow)

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
      // console.log(JSON.stringify(response.data.data))
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
        // console.log(JSON.stringify(response.data))
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
        // console.log(error);
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
      // console.log(JSON.stringify(response.data))
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


  async function CheckoutHandler(){
    const emailICheck = email.includes('@') && email.includes(".com")
    const firstnamecheck = first_name === null || first_name === undefined ||  first_name === ""
    const lastnamecheck = last_name === null || last_name === undefined ||  last_name === ""
    const landmarkcheck = landmark === null || landmark === undefined ||  landmark === ""
    const phonecheck = phone === null || phone === undefined ||  phone === ""
    const addresscheck = address === null || address === undefined ||  address === ""
    const countrycheck = countryName === null || countryName === undefined ||  countryName === ""
    const statecheck = stateName === null || stateName === undefined ||  stateName === ""
    const citycheck = cityName === null || cityName === undefined ||  cityName === ""
    const paymentcheck = paymentmethod === null || paymentmethod === undefined ||  paymentmethod === ""



    // console.log(phone)
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
      setIsLoading(true)

      try {
      setIsLoading(true)
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
        
      } catch (error) {
        // console.log(error)
        Alert.alert("", error.response.data.message, [
          {
            text: "OK",
            onPress: () => navigation.goBack()
          }
        ])
      }
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
      trigger: { seconds: 2 },
    });
  }

  if(isLoading){
    return <LoadingOverlay message={"..."}/>
  }
  return (
    <ScrollView style={{marginTop:marginStyle.marginTp, marginHorizontal:10, flex:1}} showsVerticalScrollIndicator={false}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <Text style={styles.checkouttxt}>CheckOut</Text>


      <ScrollView style={{ margin: 10}} showsVerticalScrollIndicator={false}>
          {/* <Ionicons style={{ marginTop: Platform.OS === 'ios' ? 10 : 0 }}  size={20} color={'black'} name="person"/>   */}
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

          {/* <Ionicons size={20} style={{ marginTop: Platform.OS === 'ios' ? 10 : 0 }} color={'black'} name="person"/> */}
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
            onFocus={() => setemailinvalid}
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
            onFocus={() => setemailinvalid}
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
        <View style={{marginBottom:'10%', marginHorizontal:15, marginTop:10}}>
          <SubmitButton onPress={CheckoutHandler} message={'Submit'}/>
        </View>
        </ScrollView>

    </ScrollView>
  )
}

export default CheckOut

const styles = StyleSheet.create({
  invalid:{
    backgroundColor: Color.error100
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
})