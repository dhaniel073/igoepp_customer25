import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView, Alert, Pressable } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { Color, DIMENSION, marginStyle } from '../Component/Ui/GlobalStyle'
import { Dropdown } from 'react-native-element-dropdown'
import { AuthContext } from '../utils/AuthContext'
import GoBack from '../Component/Ui/GoBack'
import { ImageBackground } from 'expo-image'
import {Ionicons, MaterialCommunityIcons, MaterialIcons, FontAwesome, Entypo, Fontisto} from '@expo/vector-icons'
import SubmitButton from '../Component/Ui/SubmitButton'
import axios from 'axios'
import * as ImagePicker from 'expo-image-picker'
import Modal from 'react-native-modal'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'
import { ProfileUpdate, UploadImage } from '../utils/AuthRoute'
import DateTimePicker from "@react-native-community/datetimepicker"



const data = [
  { label: 'Male ', value: 'M' },
  { label: 'Female ', value: 'F' },

];



const ProfileEdit = ({route, navigation}) => {
  const authCtx = useContext(AuthContext)
  const [isFocus, setIsFocus] = useState(false);

  const [fetchedmessage, setFetchedMesssage] = useState('')
  const [image, setImage] = useState(null);
  const [imagebase, setImageBase] = useState(null);
  const [imagemodalvisible, setimagemodalvisible] = useState(false)

  const [first_name, setFirstName] = useState(route?.params?.firstName)
  const [last_name, setLastName] = useState(route?.params?.lastName)
  const [phone, setPhone] = useState(route?.params?.Phone)
  const [sex, setSex] = useState(route?.params?.Sex)
  const [dob, setdob] = useState(route?.params?.Dob)
  const [address, setaddress] = useState(route?.params?.Address)

  const [isloading, setisloading] = useState(false)

  const [isCountryFocus, setIsCountryFocus] = useState(false);
  const [isStateFocus, setIsStateFocus] = useState(false);
  const [isCityFocus, setIsCityFocus] = useState(false);

  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);

  const [country, setCountry] = useState([]);
  const [state, setState] = useState([]);
  const [city, setCity] = useState([]);


  const [countryName, setCountryName] = useState(route.params.Country);
  const [stateName, setStateName] = useState(route.params.State);
  const [cityName, setCityName] = useState(route.params.lga);

  const [helpdate, setHelpDate] = useState('')
  const [date, setDate] = useState(new Date())
  const [showdatePicker, setShowDatePicker] = useState(false)
  const [helpdateInvalid, sethelpdateInvalid] = useState(false)


  useEffect(() => {
    var config = {
      method: 'get',
      url: "https://phixotech.com/igoepp/public/api/auth/general/country",
      headers:{
          Accept: 'application/json',
          Authorization: `Bearer ${authCtx.token}`
      } 
    }
    axios(config)
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

console.log(route.params)


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

  // console.log(route.params)

const handleCity = (countryCode, stateCode) => {
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

  
  const updateInputValueHandler = (inputType, enteredValue) => {
    switch (inputType) {
      case 'firstname':
        setFirstName(enteredValue)
        break;
      case 'lastname':
        setLastName(enteredValue)
        break;
      case 'phone':
        setPhone(enteredValue)
        break;
      case 'dob':
        setdob(enteredValue)
        break;
      case 'address':
        setaddress(enteredValue)
        break;
    }
  }

  const toggleImageModal = () => {
    setimagemodalvisible(!imagemodalvisible)
  }

  const captureimage = async () => {
    ImagePicker.getCameraPermissionsAsync()
    
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect:[6,8],
      quality: 0.75,
      base64: true
    })

    if(result.canceled){
      toggleImageModal()
      return;
    }
    
    if(!result.canceled){
      setImage(result.assets[0].uri)
      setImageBase(result.assets[0].base64)
      toggleImageModal()
    }
}
const pickImage = async () => {
    ImagePicker.getMediaLibraryPermissionsAsync()

    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect:[6,8],
        quality: 0.75,
        base64: true
    })

    if(result.canceled){
      toggleImageModal()
      return;
    }
    
    if(!result.canceled){
      setImage(result.assets[0].uri)
      setImageBase(result.assets[0].base64)
      toggleImageModal()
    }
  }

  const deleteImage = () => {
    setisloading(true)
    Alert.alert("Remove Image", "Do you want to delete selected Image", [
      {
        text: "No",
        onPress: () => {}
      },
      {
        text: "Yes",
        onPress: () => [
          setisloading(true),
          setImage(null), 
          setImageBase(null),
          setisloading(false)
        ]
      },
    ])
    setisloading(false)
  }

  const toggleDatePicker = () => {
    setShowDatePicker(!showdatePicker)
  }
  
  const onChangeDatePicker = ({type}, selectdDate) => {
    if(type == 'set'){
      const currentDate = selectdDate;
      setDate(currentDate)
  
      if(Platform.OS === 'android'){
          toggleDatePicker();
          const getdobdate = currentDate.getDate()
          const getdobyear = currentDate.getFullYear()
          const getdobmonth = currentDate.getMonth()+1

          // console.log(currentDate.getMonth())
          // console.log(currentDate.getDate())


          const dobtosend = getdobyear + "-" + getdobmonth + "-" + getdobdate
          // console.log(dobtosend)
          // setHelpDate(currentDate.toLocaleDateString())
          setHelpDate(dobtosend)
      }
    }else{
      toggleDatePicker()
    }
  }
  
  const confirmIOSDate = () => {
    const getdobdate = date.getDate()
    const getdobyear = date.getFullYear()
    const getdobmonth = date.getMonth()+1

    const dobtosend = getdobyear + "-" + getdobmonth + "-" + getdobdate

    // setHelpDate(date.toDateString())
    setHelpDate(dobtosend)
    toggleDatePicker()
  }
  



  const updateProfilehandler = async () => {
    if(!last_name || !first_name || !sex || !phone || !countryName || !stateName || !cityName || !helpdate ){
        Alert.alert("Empty Field", "Please fill in the fields correctly")
      }else{
        // console.log(last_name,   first_name, sex, phone, countryName, stateName, cityName)
      try {
        setisloading(true)
        const response = await ProfileUpdate(last_name, first_name, helpdate, sex, phone, authCtx.Id, authCtx.token, countryName, stateName, cityName, address)
        // console.log(response)
        Alert.alert('Successful', 'Your profile has been updated successfully', [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ])
        setisloading(false)
      } catch (error) {
        console.log(error.response)
        Alert.alert('Error', 'An error occured while updating your profile please try again later', [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ])
      }
    }
  }

  const uploadImage = async () => {
    const uploadUrl = `data:image/jpeg;base64,${imagebase}`
    try {
      setisloading(true)
      const response = await UploadImage(uploadUrl, authCtx.Id, authCtx.token) 
    //   console.log(response)
      setisloading(false)
      setImage()
      setImageBase()
      Alert.alert('Successful', 'Profile image uploaded successfully', [
        {
          text: 'Ok',
          onPress: () => navigation.goBack()
        }
      ])
    } catch (error) {
      setisloading(true)
      // console.log(error.response)
      Alert.alert('Error', "An error occured please try again later")
      setisloading(false)
      setImage()
      setImageBase()
      return;
    }
  }

    const pictureReturn = () => {
      if(authCtx.picture === 'NoImage'){
        return  require("../assets/person-4.png")
      }else{
        return {uri:`https://phixotech.com/igoepp/public/customers/${authCtx.picture}`}
      }
    }

  // console.log(image)

  if(isloading){
    return <LoadingOverlay message={"..."}/>
  }
  return (
    <View style={{ flex:1, marginTop: marginStyle.marginTp, marginHorizontal:10}}>
    <View style={{flexDirection:'row', width:'100%',}}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      {/* <Text style={{ marginLeft:45, marginTop:-5, fontSize: 25, fontWeight:'bold', textAlign:'center' }}>{route?.params?.firstName} {route?.params?.lastName}</Text> */}
    </View>

    <ScrollView style={[styles.container]} showsVerticalScrollIndicator={false}>
      <View style={{ margin: 10 }}>

      {/* <Image source={myImage} style={{width:30, height:30}}/> */}
      
      <View style={{justifyContent:'center', alignItems:'center'}}>
         {/* {defaultimage()} */}
        <View style={{ alignItems: 'center',}}>
          <TouchableOpacity  onPress={ () => toggleImageModal()}>
            <View style={{ 
                // height: 100,
                // width: 100,
                borderRadius: 15,
                justifyContent: 'center',
                alignItems: 'center'
             }}>
                <ImageBackground
                source={!image ? pictureReturn() : image}
                style={{ height: 100, width:100, borderWidth: 1, borderRadius: 15}}
                imageStyle={{ borderRadius: 15, }}
                >
                  <View style={{ 
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                   }}>
                    <Ionicons name="camera" size={35} style={{ 
                      opacity: 0.7,
                      alignItems: 'center',
                      justifyContent:'center',
                      borderWidth: 1,
                      borderColor: '#fff',
                      borderRadius: 10,
                      }} color={Color.darkolivegreen_100}/>
                  </View>   
                
                </ImageBackground>
            </View>
          </TouchableOpacity>
        </View>
      </View>
       
    <View style={{justifyContent:'center', marginTop:10}}>

        {!image ? 
        <TouchableOpacity>
            <Text style={{textAlign:'center', fontSize:16,fontFamily:'poppinsRegular'}}>Select Passport</Text>
        </TouchableOpacity>
        :
        <View style={{margin:1 ,alignItems:'center', flexDirection:'row', gap:15, justifyContent:'center', }}>
            <TouchableOpacity onPress={() => uploadImage()} style={{backgroundColor: Color.darkolivegreen_100, padding:10, borderRadius:10}}>
                <Ionicons name='cloud-upload' color='#fff' size={24} style={{alignSelf:'center'}}/>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => deleteImage()} style={{backgroundColor: Color.darkolivegreen_100, padding:10, borderRadius:10}}>
                <Ionicons name='trash' color='#fff' size={24}/>
            </TouchableOpacity>
        </View>
        }
    </View>
          
          <View style={styles.action}>
            <Ionicons size={20} color="black" name="person"/>
            <TextInput
              placeholder="First Name"
              placeholderTextColor="#666666"
              onChangeText={updateInputValueHandler.bind(this, 'firstname')}
              autoCorrect={false}
              autoCapitalize='sentences'
              // value={route.params.firstName}
              value={first_name}
              // autoCapitalize={true}
              style={[styles.textInput, 
              ]}
            />      
          </View>
          
          <View style={styles.action}>
              <Ionicons size={20} 
                color="black" 
              name="person"/>
              <TextInput
                placeholder="Last Name"
                placeholderTextColor="#666666"
                onChangeText={updateInputValueHandler.bind(this, 'lastname')}
                autoCorrect={false}
                autoCapitalize='sentences'
                // value={route.params.lastName}
                value={last_name}
                // autoCapitalize={true}
                style={[styles.textInput]}
              />      
          </View>

          
          <View style={styles.action}>
              <Ionicons size={20} 
              color="black" 
              name="call"/>
              <TextInput
                placeholder="Phone"
                onChangeText={updateInputValueHandler.bind(this, 'phone')}
                placeholderTextColor="#666666"
                autoCorrect={false}
                value={phone}
                // value={route.params.Phone}
                maxLength={11}
                keyboardType="number-pad"
                style={[styles.textInput, 
                ]}
              />      
          </View>

          {showdatePicker && (
          <DateTimePicker
            mode="date"
            display='spinner'
            value={date}
            onChange={onChangeDatePicker}
            style={{ height: 120, marginTop: -10, fontFamily: 'poppinsRegular'}}
            // minimumDate={new Date()}
          />
        )}  

        {showdatePicker && Platform.OS === "ios" && (
        <View style={{ flexDirection: "row", justifyContent: 'space-around' }}>
          <TouchableOpacity style={[styles.button1, styles.pickerButton, {backgroundColor: "#11182711"}]}
            onPress={toggleDatePicker}
          >
            <Text style={[styles.buttonText, {color: "#075985", fontFamily: 'poppinsRegular'}]}>Cancel</Text>
          </TouchableOpacity>


          <TouchableOpacity style={[styles.button1, styles.pickerButton,]}
            onPress={confirmIOSDate}
          >
            <Text style={[styles.buttonText, {fontFamily: 'poppinsRegular'}]}>Confirm</Text>
          </TouchableOpacity>
        </View>
        )}

      {!showdatePicker && (
        <Pressable style={styles.action} onPress={ () => [toggleDatePicker(), helpdateInvalid && sethelpdateInvalid(false)]}>
          <FontAwesome size={20} 
              color="black" 
              name="calendar"/>
          <TextInput
            placeholder={!dob ? 'Select Date of Birth' : dob}
            value={helpdate}
            onChangeText={updateInputValueHandler.bind(this, 'date')}
            placeholderTextColor={"#11182744"}
            editable={false}
            // isInvalid={helpdateInvalid}
            // onFocus={() => sethelpdateInvalid(false)}
            onPressIn={toggleDatePicker}
            style={[styles.textInput, 
            ]}
          />
        </Pressable>
        )}



          <View style={styles.action2}>
          <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          // iconStyle={styles.iconStyle}
          data={data}
          // data={route.params.Sex}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select a Gender' : '...'}
          searchPlaceholder="Search..."
          value={sex}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setSex(item.value);
            setIsFocus(false);
          }}
        //   onChangeText={updateInputValueHandler.bind(this, 'sex')}
          
        />
        </View>


        <View style={styles.action2}>
        <Dropdown
          style={[styles.dropdown, isCountryFocus && { borderColor: 'blue' }]}
          placeholderStyle={[styles.placeholderStyle, {fontFamily: 'poppinsRegular'}]}
          selectedTextStyle={[styles.selectedTextStyle, {fontFamily: 'poppinsRegular'}]}
          inputSearchStyle={[styles.inputSearchStyle, {fontFamily: 'poppinsRegular'}]}
          // iconStyle={styles.iconStyle}
          data={countryData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isCountryFocus ? (route.params.Country === null ? "Select a Country" : route.params.Country ) : '...'}
          searchPlaceholder="Search..."
          // value={country}
          value={country}
          onFocus={() => setIsCountryFocus(true)}
          onBlur={() => setIsCountryFocus(false)}
          onChange={item => {
            setCountry(item.value);
            handleState(item.value);
            setCountryName(item.label)
            setIsCountryFocus(false);
          }}
  
        />
        </View>

        <View style={styles.action2}>
          <Dropdown
          style={[styles.dropdown, isStateFocus && { borderColor: 'blue' }]}
          placeholderStyle={[styles.placeholderStyle, {fontFamily: 'poppinsRegular'}]}
          selectedTextStyle={[styles.selectedTextStyle, {fontFamily: 'poppinsRegular'}]}
          inputSearchStyle={[styles.inputSearchStyle, {fontFamily: 'poppinsRegular'}]}
          // iconStyle={styles.iconStyle}
          data={stateData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isStateFocus ? (route.params.State === null ? "Select a State" : route.params.State ) : '...'}
          searchPlaceholder="Search..."
          value={state}
          onFocus={() => setIsStateFocus(true)}
          onBlur={() => setIsStateFocus(false)}
          onChange={item => {
            setState(item.value);
            handleCity(country, item.value)
            setStateName(item.label)
            setIsStateFocus(false);
          }}
          />
        </View>

       
        <View style={[styles.action2, {marginBottom:8}]}>
        <Dropdown
          style={[styles.dropdown, isCityFocus && { borderColor: 'blue' }]}
          placeholderStyle={[styles.placeholderStyle, {fontFamily: 'poppinsRegular'}]}
          selectedTextStyle={[styles.selectedTextStyle, {fontFamily: 'poppinsRegular'}]}
          inputSearchStyle={[styles.inputSearchStyle, {fontFamily: 'poppinsRegular'}]}
          // iconStyle={styles.iconStyle}
          data={cityData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isCityFocus ? (route.params.lga === null ? "Select a LGA" : route.params.lga ) : '...'}
          searchPlaceholder="Search..."
          value={city}
          onFocus={() => setIsCityFocus(true)}
          onBlur={() => setIsCityFocus(false)}
          onChange={item => {
            setCity(item.value);
            setCityName(item.label)
            setIsCityFocus(false);
          }}
        />
        </View>

        <View style={[styles.action, ]}>
        <Entypo size={20} 
              color="black" 
              name="address"/>
        <TextInput
          placeholder={!address ? "Enter Address" : address}
          onChangeText={updateInputValueHandler.bind(this, 'address')}
          placeholderTextColor="#666666"
          autoCorrect={false}
          value={address}
          // value={route.params.Phone}
          style={[styles.textInput, 
          ]}
          />  
        </View>
          <SubmitButton message={"Submit"}  onPress={() => updateProfilehandler()}/>
        <View style={{marginBottom:30}}/>
      </View>

  </ScrollView>

    <Modal isVisible={imagemodalvisible}>
      <SafeAreaView style={styles.centeredView}>

      <TouchableOpacity style={{justifyContent:'flex-end', alignSelf:'flex-end', marginBottom:5, }} onPress={() => toggleImageModal()}>
        <MaterialIcons name="cancel" size={30} color="white" />
      </TouchableOpacity>
      <View style={[styles.modalView,  {width: DIMENSION.WIDTH * 0.7}]} showsVerticalScrollIndicator={false}>
        <Text style={[styles.modalText, {fontSize:15}]}>
          Upload Images
        </Text>

          <View style={{ marginBottom:10}}/>  

        <View style={{flexDirection:'row', justifyContent:'center'}}>
          <View style={{alignItems:'center', justifyContent:'center'}}>
            <TouchableOpacity style={[styles.shadow,{borderWidth:1, padding:15, borderRadius:10, marginRight:10, borderColor:Color.darkolivegreen_100}]} onPress={() => captureimage()}>
              <FontAwesome name="camera" size={24} color={Color.darkolivegreen_100} />
            </TouchableOpacity>
            <Text style={[styles.panelBottomTitle, {marginRight:15}]}> Camera</Text>
          </View>

          <View style={{alignItems:'center', justifyContent:'center'}}>
            <TouchableOpacity style={[styles.shadow,{borderWidth:1, padding:15, borderRadius:10, marginLeft:10, borderColor:Color.darkolivegreen_100}]} onPress={() => pickImage()}>
              <Ionicons name="ios-library-sharp" size={24} color={Color.darkolivegreen_100} />
            </TouchableOpacity>
            <Text style={[styles.panelBottomTitle, {marginLeft:15, marginRight:10}]}> Libraries</Text>
          </View>
        </View>

          <View style={{marginBottom:5}}/>
        </View>

      </SafeAreaView>
    </Modal>
  </View>
  )
}

export default ProfileEdit

const styles = StyleSheet.create({
  
  addtowalletpaymentxt:{
    fontSize: 18,
    color: Color.darkolivegreen_100,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
    marginBottom:15,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
  }, 
  textInput:{
    flex: 1,
    fontFamily: 'poppinsRegular',
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    padding:5,
    fontSize: 15,
    top: 8,
  },
  action:{
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5
  },
  action2:{
    marginTop: 2,
    marginBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 2
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
    padding: 20,
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
  shadow:{
    borderRadius: 20, 
    elevation: 7,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    backgroundColor: 'white',
    overflow: Platform.OS === 'andriod' ? 'hidden' : 'visible',
  },
  panelBottomTitle: {
    fontSize: 12,
    fontFamily: 'poppinsRegular',
    color: Color.orange_100,
    marginTop:10
},
})