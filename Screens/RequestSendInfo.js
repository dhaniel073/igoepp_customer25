import { Alert, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { Color, marginStyle } from '../Component/Ui/GlobalStyle'
import GoBack from '../Component/Ui/GoBack'
import Input from '../Component/Ui/Input'
import { Dropdown } from 'react-native-element-dropdown'
import DateTimePicker from "@react-native-community/datetimepicker"
import SubmitButton from '../Component/Ui/SubmitButton'
import { AuthContext } from '../utils/AuthContext'
import axios from 'axios'
import { RequestInfo } from '../utils/AuthRoute'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'

const vehicle = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
 
];

const sizeofhelp = [
  { label: 'Small', value: 'Small' },
  { label: 'Medium', value: 'Medium' },
  { label: 'Large', value: 'Large' },
 
];

const frequencies = [
  { label: 'One-off', value: 'One-off' },
  { label: 'Daily', value: 'Daily' },
  { label: 'Weekly', value: 'Weekly' },
  { label: 'Bi-Weekly', value: 'Bi-Weekly' },
  { label: 'Monthly', value: 'Monthly' },
  { label: 'Bi-Monthly', value: 'Bi-Monthly' },
  { label: 'Quarterly', value: 'Quarterly' },
  { label: 'Yearly', value: 'Yearly' },
];

const interestfield = [
  { label: 'Request for help now', value: 'Request for help now' },
  { label: 'Request for help later', value: 'Request for help later' },
  // { label: ' Browse through the system', value: 'Browse through the system' },
]


const RequestSendInfo = ({navigation, route}) => {
  const authCtx = useContext(AuthContext)
  const subcatId = route.params.subcatId
  const catId= route.params.catId
  const preassessment = route.params.preassessment

  const [isCountryFocus, setIsCountryFocus] = useState(false);
  const [isStateFocus, setIsStateFocus] = useState(false);
  const [isCityFocus, setIsCityFocus] = useState(false);
  const [isFrequencyFocus, setIsFrequencyFocus] = useState(false);
  const [isVehicleFocus, setIsVehicleFocus] = useState(false);
  const [isHelpSizeFocus, setIsHelpSizeFocus] = useState(false);
  const [isInterestFocus, setIsInterestFocus] = useState(false)


  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);

  const [country, setCountry] = useState([]);
  const [state, setState] = useState([]);
  const [city, setCity] = useState([]);


  const [countryName, setCountryName] = useState('');
  const [stateName, setStateName] = useState('');
  const [cityName, setCityName] = useState('');

  const [helpdate, setHelpDate] = useState('')
  const [date, setDate] = useState(new Date())
  const [showdatePicker, setShowDatePicker] = useState(false)

  const [helptime, setHelpTime] = useState('')
  const [time, setTime] = useState(new Date())
  const [showTimePicker, setShowTimePicker] = useState(false)
  

  const [addressfield, setAddressField] = useState('')
  const [interest, setInterest] = useState('')
  const [landmark, setLandmark] = useState('')
  const [description, setDescription] = useState('')
  const [vehiclerequest, setVehicleRequest] = useState('')
  const [frequency, setFrequency] = useState('')
  const [helpsize, setHelpSize] = useState('')

  const [addressInvalid, setaddressInvalid] = useState(false)
  const [interestInvalid, setinterestInvalid] = useState(false)
  const [landmarkInvalid, setlandmarkInvalid] = useState(false)
  const [descriptionInvalid, setdescriptionInvalid] = useState(false)
  const [vehicleInvalid, setvehicleInvalid] = useState(false)
  const [frequencyInvalid, setfrequencyInvalid] = useState(false)
  const [helpsizeInvalid, sethelpsizeInvalid] = useState(false)
  const [stateInvalid, setstateInvalid] = useState(false)
  const [countryInvalid, setcountryInvalid] = useState(false)
  const [cityInvalid, setcityInvalid] = useState(false)
  const [helpdateInvalid, sethelpdateInvalid] = useState(false)
  const [helptimInvalid, sethelptimInvalid] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

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
    // console.log(`https://phixotech.com/igoepp/public/api/auth/general/lga/${stateCode}`)
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
    setIsLoading(false)
  }

  function updateInputValueHandler(inputType, enteredValue) {
    switch(inputType){
      case 'address':
        setAddressField(enteredValue);
        break;

      case 'country':
        setCountryData(enteredValue);
        break;

      case 'state':
        setStateData(enteredValue);
        break;

      case 'city':
        setCityData(enteredValue);
        break;

      case 'description':
        setDescription(enteredValue);
        break;
      
      case 'landmark':
        setLandmark(enteredValue);
        break;   
        
    }
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
          setHelpDate(currentDate.toDateString())
      }
    }else{
      toggleDatePicker()
    }
  }

  const confirmIOSDate = () => {
    setHelpDate(date.toDateString())
    toggleDatePicker()
  }

  const toggleTimePicker = () => {
    setShowTimePicker(!showTimePicker)
}

  const onChangeTimePicker = ({type}, selectdTime) => {
    if(type == 'set'){
      const currentTime = selectdTime;
      setTime(currentTime)
      if(Platform.OS === 'android'){
        toggleTimePicker();
        setHelpTime(currentTime.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }))
      }
    }else{
      toggleTimePicker()
    }
  }

  const confirmIOSTime = ({type}, selectdTime) => {
    var timeset = time.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
    setHelpTime(timeset)
    toggleTimePicker()
  }

  const SubmitInformationHandler = async () => {
    const newdate = date
    const month = newdate.getUTCMonth() +1;
    const year = newdate.getUTCFullYear();
    const day = newdate.getUTCDate();
    const maindate = year + "-" + month + "-" +  day


    const addresscheck = addressfield === null || addressfield === undefined || addressfield === "" || addressfield.length === 0
    const countrycheck = countryName === null || countryName === undefined || countryName === "" || countryName.length === 0
    const helpdatecheck = helpdate === null || helpdate === undefined || helpdate === "" || helpdate.length === 0
    const helptimecheck = helptime === null || helptime === undefined || helptime === "" || helptime.length === 0
    const stateNamecheck = stateName === null || stateName === undefined || stateName === "" || stateName.length === 0
    const cityNamecheck = cityName === null || cityName === undefined || cityName === "" || cityName.length === 0
    const landmarkcheck = landmark === null || landmark === undefined || landmark === "" || landmark.length === 0
    const descriptioncheck = description === null || description === undefined || description === "" || description.length === 0
    const vehiclerequestcheck = vehiclerequest === null || vehiclerequest === undefined || vehiclerequest === "" || vehiclerequest.length === 0
    const frequencycheck = frequency === null || frequency === undefined || frequency === "" || frequency.length === 0
    const helpsizecheck = helpsize === null || helpsize === undefined || helpsize === "" || helpsize.length === 0
    const interestcheck = interest === null || interest === undefined || interest === "" || interest.length === 0





    if(addresscheck|| countrycheck || helpdatecheck || helptimecheck ||stateNamecheck || cityNamecheck || landmarkcheck || descriptioncheck 
      || vehiclerequestcheck || frequencycheck || helpsizecheck || interestcheck )
    {      
          setaddressInvalid(addresscheck)
          setinterestInvalid(interestcheck)
          setlandmarkInvalid(landmarkcheck)
          setdescriptionInvalid(descriptioncheck)
          setvehicleInvalid(vehiclerequestcheck)
          setfrequencyInvalid(frequencycheck)
          sethelpsizeInvalid(helpsizecheck)
          setstateInvalid(stateNamecheck)
          setcountryInvalid(countrycheck)
          setcityInvalid(cityNamecheck)
          sethelpdateInvalid(helpdatecheck)
          sethelptimInvalid(helptimecheck)
      Alert.alert("Invalid Input", "Fill in the fields correctly to continue")
    }else{
      try {
        setIsLoading(true)
        const response = await RequestInfo(authCtx.Id,interest,addressfield,countryName,stateName,cityName,
          landmark,helpsize,vehiclerequest,description,catId,subcatId,helptime,maindate,frequency, preassessment, authCtx.token)
        console.log(response)
        Alert.alert("Success", "Request Made Successfully", [
          {
            text:"Ok",
            onPress:() => navigation.navigate('Welcome')
          }
        ])
        setIsLoading(false)
      } catch (error) {
          console.log(error.response)
          setIsLoading(true)
          Alert.alert("Error", "Error Making Request, Try Again Later", [
            {
              text: "Ok",
              onPress: () => navigation.goBack()
            }
          ])
          setIsLoading(false)
        }
    }}  
    
    if(isLoading){
      return <LoadingOverlay message={"Making request"}/>
    }

  return (
    <SafeAreaView style={{marginTop: marginStyle.marginTp, marginHorizontal:10, flex:1,}}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <Text style={styles.requestsendinfotxt}>Make Request</Text>

      <ScrollView showsVerticalScrollIndicator={false} style={{marginBottom:10}}>
      <Text style={[styles.label, styles.labelInvalid]}>
          Address for Service :
        </Text>
        <Input
          style={styles.address}
          value={addressfield}
          onUpdateValue={updateInputValueHandler.bind(this, 'address')}
          placeholder ={"Enter Address For Service"}
          isInvalid={addressInvalid}
          onFocus={() => setaddressInvalid(false)}
        />

      {/*Country dropdown */}
      <View style={{ backgroundColor: "#fff", borderBottomWidth: 1, paddingBottom: 20, borderBottomColor: Color.darkslategray_300,}}>
      <Text style={[styles.label, styles.labelInvalid]}>Country :</Text>
      <Dropdown
          style={[styles.dropdown, isCountryFocus && { borderColor: 'blue' }, countryInvalid && styles.inputInvalid]}
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
          onFocus={() => [setIsCountryFocus(true), setcountryInvalid(false)]}
          onBlur={() => setIsCountryFocus(false)}
          onChange={item => {
            setCountry(item.value);
            handleState(item.value);
            setCountryName(item.label)
            setIsCountryFocus(false);
          }}
        />

        <Text style={[styles.label, styles.labelInvalid]}>State :</Text>
        <Dropdown
          style={[styles.dropdown, isStateFocus && { borderColor: 'blue' }, stateInvalid && styles.inputInvalid]}
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
          onFocus={() => [setIsStateFocus(true), setstateInvalid(false)]}
          onBlur={() => setIsStateFocus(false)}
          onChange={item => {
            setState(item.value);
            handleCity(country, item.value)
            setStateName(item.label)
            setIsStateFocus(false);
          }}
        />

        <Text style={[styles.label, styles.labelInvalid]}>LGA :</Text>
        <Dropdown
          style={[styles.dropdown, isCityFocus && { borderColor: 'blue' }, cityInvalid && styles.inputInvalid]}
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
          onFocus={() => [setIsCityFocus(true), setcityInvalid(false)]}
          onBlur={() => setIsCityFocus(false)}
          onChange={item => {
            setCity(item.value);
            setCityName(item.label)
            setIsCityFocus(false);
          }}
        />
        </View>


        {/*date of service */}
        <Text style={[styles.label, styles.labelInvalid]}>
          Date for Service :
        </Text>

        {showdatePicker && (
          <DateTimePicker
            mode="date"
            display='spinner'
            value={date}
            onChange={onChangeDatePicker}
            style={{ height: 120, marginTop: -10, fontFamily: 'poppinsRegular'}}
            minimumDate={new Date()}
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
          <Pressable onPress={ () => [toggleDatePicker(), helpdateInvalid && sethelpdateInvalid(false)]}>

            <Input
              placeholder="Select date..."
              value={helpdate}
              onChangeText={updateInputValueHandler.bind(this, 'date')}
              placeholderTextColor={"#11182744"}
              editable={false}
              isInvalid={helpdateInvalid}
              onFocus={() => sethelpdateInvalid(false)}
              onPressIn={toggleDatePicker}
            />
          </Pressable>
        )}


            
        <Text style={[styles.label, styles.labelInvalid]}>Size of Help</Text>
          <Dropdown
          style={[styles.dropdown, isHelpSizeFocus && { borderColor: 'blue' }, helpsizeInvalid && styles.inputInvalid]}
          placeholderStyle={[styles.placeholderStyle, {fontFamily: 'poppinsRegular'}]}
          selectedTextStyle={[styles.selectedTextStyle, {fontFamily: 'poppinsRegular'}]}
          inputSearchStyle={[styles.inputSearchStyle, {fontFamily: 'poppinsRegular'}]}
          iconStyle={styles.iconStyle}
          data={sizeofhelp}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isHelpSizeFocus ? 'Select Help Size' : '...'}
          searchPlaceholder="Search..."
          value={helpsize}
          onFocus={() => [setIsHelpSizeFocus(true), sethelpsizeInvalid(false)]}
          onBlur={() => setIsHelpSizeFocus(false)}
          onChange={item => {
            setHelpSize(item.value);
            setIsHelpSizeFocus(false);
          }}
        />

          <Text style={[styles.label, styles.labelInvalid]}>
            LandMark:
          </Text>
          <Input
            placeholder={"Whats your Landmark"}
            value={landmark}
            // keyboardType={'numeric'}
            onUpdateValue={updateInputValueHandler.bind(this, 'landmark')}
            isInvalid={landmarkInvalid}
            onFocus={() => setlandmarkInvalid(false)}
            // style={styles.description}
          />

          <Text style={[styles.label, styles.labelInvalid]}>Frequency</Text>
            <Dropdown
            style={[styles.dropdown, isFrequencyFocus && { borderColor: 'blue' }, frequencyInvalid && styles.inputInvalid]}
            placeholderStyle={[styles.placeholderStyle, {fontFamily: 'poppinsRegular'}]}
            selectedTextStyle={[styles.selectedTextStyle, {fontFamily: 'poppinsRegular'}]}
            inputSearchStyle={[styles.inputSearchStyle, {fontFamily: 'poppinsRegular'}]}
            iconStyle={styles.iconStyle}
            data={frequencies}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFrequencyFocus ? 'Select Frequency' : '...'}
            searchPlaceholder="Search..."
            value={frequency}
            onFocus={() => [setIsFrequencyFocus(true), setfrequencyInvalid(false)]}
            onBlur={() => setIsFrequencyFocus(false)}
            onChange={item => {
              setFrequency(item.value);
              setIsFrequencyFocus(false);
            }}
          />

            

          <Text style={[styles.label, styles.labelInvalid]}>
            Additional Note:
          </Text>
          <Input
            placeholder={"Whats your help Description"}
            value={description}
            isInvalid={descriptionInvalid}
            onUpdateValue={updateInputValueHandler.bind(this, 'description')}
            multiline={true}
            onFocus={() => setdescriptionInvalid(false)}
            // style={styles.description}
          />

          <Text style={[styles.label, styles.labelInvalid]}>Vehicle Req:</Text>
            <Dropdown
            style={[styles.dropdown, isVehicleFocus && { borderColor: 'blue' }, vehicleInvalid && styles.inputInvalid]}
            placeholderStyle={[styles.placeholderStyle, {fontFamily: 'poppinsRegular'}]}
            selectedTextStyle={[styles.selectedTextStyle, {fontFamily: 'poppinsRegular'}]}
            inputSearchStyle={[styles.inputSearchStyle, {fontFamily: 'poppinsRegular'}]}
            iconStyle={styles.iconStyle}
            data={vehicle}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isVehicleFocus ? 'Do you need a Vehicle' : '...'}
            searchPlaceholder="Search..."
            value={vehiclerequest}
            onFocus={() => [setIsVehicleFocus(true), setvehicleInvalid(false)]}
            onBlur={() => setIsVehicleFocus(false)}
            onChange={item => {
              setVehicleRequest(item.value);
              setIsVehicleFocus(false);
            }}
          />


          <Text style={[styles.label, styles.labelInvalid]}>
            Time for Service :
          </Text>

          {showTimePicker && (
            <DateTimePicker
              mode="time"
              display='spinner'
              value={time}
              onChange={onChangeTimePicker}
              style={{ height: 120, marginTop: -10, fontFamily: 'poppinsRegular'}}
              // minimumDate={new Date()}
            />
          )}  

          {showTimePicker && Platform.OS === "ios" && (
          <View style={{ flexDirection: "row", justifyContent: 'space-around' }}>
            <TouchableOpacity style={[styles.button1, styles.pickerButton, {backgroundColor: "#11182711"}]}
              onPress={toggleTimePicker}
            >
              <Text style={[styles.buttonText, {color: "#075985", fontFamily: 'poppinsRegular'}]}>Cancel</Text>
            </TouchableOpacity>


            <TouchableOpacity style={[styles.button1, styles.pickerButton,]}
              onPress={confirmIOSTime}
            >
              <Text style={[styles.buttonText, {fontFamily: 'poppinsRegular'}]}>Confirm</Text>
            </TouchableOpacity>
          </View>
          )}

          {!showTimePicker && (
            <Pressable onPress={() => [toggleTimePicker(), helptimInvalid && sethelptimInvalid(false)]}>
              <Input
                style={[styles.date, {fontFamily: 'poppinsRegular'}]}
                placeholder="Select time..."
                value={helptime}
                onChangeText={updateInputValueHandler.bind(this, 'time')}
                placeholderTextColor={"#11182744"}
                editable={false}
                isInvalid={helptimInvalid}
                onPressIn={toggleTimePicker}
              />
            </Pressable>
          )}

              
           
          <Text style={[styles.label, styles.labelInvalid]}>Request Period</Text>
          <Dropdown
            style={[styles.dropdown, isInterestFocus && { borderColor: 'blue' }, interestInvalid && styles.inputInvalid]}
            placeholderStyle={[styles.placeholderStyle,{fontFamily: 'poppinsRegular'}]}
            selectedTextStyle={[styles.selectedTextStyle, {fontFamily: 'poppinsRegular'}]}
            inputSearchStyle={[styles.inputSearchStyle, {fontFamily: 'poppinsRegular'}]}
            iconStyle={styles.iconStyle}
            data={interestfield}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isInterestFocus ? 'Select Period' : '...'}
            searchPlaceholder="Search..."
            value={interest}
            onFocus={() => [setIsInterestFocus(true), setinterestInvalid(false)]}
            onBlur={() => setIsInterestFocus(false)}
            onChange={item => {
              setInterest(item.value);
              setIsInterestFocus(false);
            }}
          />
          
          <View style={{marginTop: 30, marginBottom: 30}}>
              <SubmitButton onPress={SubmitInformationHandler} message={'Make Request'}/>
          </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default RequestSendInfo

const styles = StyleSheet.create({
  requestsendinfotxt:{
    fontSize: 18,
    color: Color.darkolivegreen_100,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
    marginBottom:15,
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
  label: {
    marginTop:5,
    fontFamily: 'poppinsRegular'
  },
  inputInvalid: {
    backgroundColor: Color.error100,
  },
})