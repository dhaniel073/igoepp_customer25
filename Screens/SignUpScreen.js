import { ScrollView, StyleSheet, Text, SafeAreaView, TouchableOpacity, View, Alert, Platform } from 'react-native'
import React, { useContext, useState }  from 'react'
import { Image } from 'expo-image'
import Input from '../Component/Ui/Input'
import SubmitButton from '../Component/Ui/SubmitButton';
import { Color, DIMENSION, marginStyle } from '../Component/Ui/GlobalStyle';
import { Dropdown } from 'react-native-element-dropdown';
import { SignUp } from '../utils/AuthRoute';
import { AuthContext } from '../utils/AuthContext';
import LoadingOverlay from '../Component/Ui/LoadingOverlay';
import  Modal  from 'react-native-modal';
import {MaterialIcons} from '@expo/vector-icons'

const data = [
  {
    id:"Y",
    name: "Accept"
  },
]

  const sex = [
    { label: 'Male', value: 'M' },
    { label: 'Female', value: 'F' },
  ];

  const IDTYPE = [
    { label: 'Nimc', value: 'nin' },
    { label: 'Drivers license', value: 'DL' },
    { label: 'Id Card', value: 'Idcard' },

  ];


const SignUpScreen = ({navigation}) => {
    const authCtx = useContext(AuthContext)
    const [enteredEmail, setEnteredEmail] = useState('')
    const [enteredPassword, setEnteredPassword] = useState('')
    const [enteredConfirmPassword, setEnteredConfirmPassword] = useState('')
    const [enteredfirstname, setEnteredFirstName] = useState('')
    const [enteredlastname, setEnteredLastName] = useState('')
    const [enteredPhone, setEnteredPhone] = useState('')
    const [enteredGender, setEnteredGender] = useState('')
    const [idtype, setIdType] = useState('')
    const [idnum, setidnum] = useState('')


    const [emailIsInvalid, setEmailIsInvalid] = useState(false)
    const [firstnameIsInvalid, setFirstNameIsInvalid] = useState(false)
    const [lastnameIsInvalid, setLastNameIsInvalid] = useState(false)
    const [passwordIsInvalid, setPasswordIsInvalid] = useState(false)
    const [confirmpasswordIsInvalid, setConfirmPasswordIsInvalid] = useState(false)
    const [phoneIsInvalid, setPhoneIsInvalid] = useState(false)
    const [Isidnum, setIsIdnum] = useState(false);
    const [Isidtype, setIsIdtype] = useState('');
    const [genderIsInvalid, setGenderIsInvalid] = useState('')
    
    const [isIdtypefocus, setIsIdtypeFocus] = useState(false);
    const [isgenderfocus, setisgenderfocus] = useState(false)

    const [isloading, setisloading] = useState(false)
    const [isAcceptTermsModalBisible, setisAcceptTermsModalBisible] = useState(false)
  const [avail, setavail] = useState()



    const updateInputValueHandler = (inputType, enteredValue) => {
      switch (inputType) {
        case 'email':
          setEnteredEmail(enteredValue)
          break;
        case 'password':
          setEnteredPassword(enteredValue)
          break;
        case 'confirmpassword':
          setEnteredConfirmPassword(enteredValue)
          break;
        case 'firstname':
          setEnteredFirstName(enteredValue)
          break;
        case 'lastname':
          setEnteredLastName(enteredValue)
          break;
        case 'phone':
          setEnteredPhone(enteredValue)
          break;
        case 'idnum':
          setidnum(enteredValue)
          break 
      }
    }

    const toggleAcceptTermsModal = () => {
      setisAcceptTermsModalBisible(!isAcceptTermsModalBisible)
    }

    const signupValaidate = () => {
      const emailIsValid = enteredEmail.includes('@') && enteredEmail.includes('.com');
      const passwordIsValid = enteredPassword.length < 7;
      const passcheck =  enteredPassword !== enteredConfirmPassword && enteredConfirmPassword === null || undefined || "" || enteredConfirmPassword.length === 0
      const phonecheck = enteredPhone === null || undefined || "" || enteredPhone.length === 0
      const gendercheck = enteredGender === null || undefined || "" || enteredGender.length === 0
      const idnumcheck = idnum === null || undefined || "" || idnum.length === 0
      const idtypecheck = idtype === null || undefined || "" || idtype.length === 0


      console.log(passcheck)
    
      if(!emailIsValid || passwordIsInvalid || passcheck || phonecheck || gendercheck || idnumcheck || idtypecheck || !enteredfirstname || !enteredlastname){

        const InvalidPhone = phonecheck
        setEmailIsInvalid(!emailIsValid)
        setPasswordIsInvalid(passwordIsValid)
        setConfirmPasswordIsInvalid(passcheck)
        setPhoneIsInvalid(InvalidPhone)
        setGenderIsInvalid(gendercheck)
        setFirstNameIsInvalid(!enteredfirstname)
        setLastNameIsInvalid(!enteredlastname)
        setIsIdnum(idnumcheck)
        setIsIdtype(idtypecheck)

        // console.log(emailIsInvalid, passwordIsInvalid, confirmpasswordIsInvalid, phoneIsInvalid, genderIsInvalid, firstnameIsInvalid, lastnameIsInvalid, Isidtype, Isidnum)

        Alert.alert('Invalid details', 'Please check your entered credentials.')
      }else{
        toggleAcceptTermsModal()
      }
    }

    const signuphandler = async () => {         
      try {
        setisloading(true)
        const response = await SignUp(enteredEmail, enteredPassword, enteredGender, enteredPhone, enteredfirstname, enteredlastname, idtype, idnum)
        console.log(response)
        authCtx.authenticated(response.access_token)  
        authCtx.customerId(response.customer_id)
        authCtx.customerEmail(response.email)
        authCtx.customerFirstName(response.first_name)
        authCtx.customerLastName(response.last_name)
        authCtx.customerBalance(response.wallet_balance)
        authCtx.customerPhone(response.phone)
        authCtx.customerPicture(response.picture)
        authCtx.customerShowAmount('show')
        setisloading(false)
      } catch (error) {
        setisloading(true)
        console.log(error.response)
        const myObj = error.response.data.email[0];
        Alert.alert('SignUp Failed', myObj)
        setisloading(false)
      }
      
    }

    if(isloading){
      return <LoadingOverlay message={"..."}/>
    }

  return (
    <SafeAreaView style={{flex:1, marginTop:35}}>
    <ScrollView showsVerticalScrollIndicator={false} style={{marginTop:20}}>
      <View style={{justifyContent:'center', flex:1, marginHorizontal:20}}>
      <Image style={{ width:100, height:100, alignSelf:'center'}} source={require("../assets/igoepp_transparent2.png")}   placeholder={'blurhash'} contentFit="contain"/>
      <Text style={styles.Title}>SignUp</Text>

      <View>
        <View style={styles.nameContainer}>
          <View style={styles.firstname}>

          <Input
            placeholder="First Name"
            onUpdateValue={updateInputValueHandler.bind(this, 'firstname')}
            value={enteredfirstname}
            isInvalid={firstnameIsInvalid}
            onFocus={() => setFirstNameIsInvalid(false)}
            />
        </View>

        <View style={styles.lastname}>
          <Input
            placeholder="Last Name"
            onUpdateValue={updateInputValueHandler.bind(this, 'lastname')}
            value={enteredlastname}
            isInvalid={lastnameIsInvalid}
            onFocus={() => setLastNameIsInvalid(false)}
            />
          </View>

        </View>

      </View>



      <Input
        placeholder="Email Address"
        onUpdateValue={updateInputValueHandler.bind(this, 'email')}
        value={enteredEmail}
        autoCapitalize={'none'}
        keyboardType="email-address"
        isInvalid={emailIsInvalid}
        onFocus={() => setEmailIsInvalid(false)}
      />

        <Dropdown
            style={[styles.dropdown, isgenderfocus && { borderColor: 'blue' }, genderIsInvalid ? styles.inputInvalid : null]}
            placeholderStyle={[styles.placeholderStyle, {fontFamily: 'poppinsRegular'}]}
            selectedTextStyle={[styles.selectedTextStyle, {fontFamily: 'poppinsRegular'}]}
            inputSearchStyle={[styles.inputSearchStyle, {fontFamily: 'poppinsRegular'}]}
            iconStyle={styles.iconStyle}
            data={sex}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isgenderfocus ? 'Select Gender' : '...'}
            searchPlaceholder="Search..."
            value={enteredGender}
            onFocus={() => [setisgenderfocus(true), setGenderIsInvalid(false)]}
            onBlur={() => setisgenderfocus(false)}
            onChange={item => {
                // handleCity(category, item.value)
                setEnteredGender(item.value)
                setisgenderfocus(false);
          }}
        />
        <View style={{marginBottom:5}}/>

        
        <Dropdown
          style={[styles.dropdown, isIdtypefocus && { borderColor: 'blue' }, Isidtype ? styles.inputInvalid : null]}
          placeholderStyle={[styles.placeholderStyle, {fontFamily: 'poppinsRegular'}]}
          selectedTextStyle={[styles.selectedTextStyle, {fontFamily: 'poppinsRegular'}]}
          inputSearchStyle={[styles.inputSearchStyle, {fontFamily: 'poppinsRegular'}]}
          iconStyle={styles.iconStyle}
          data={IDTYPE}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isIdtypefocus ? 'Select Identification Type' : '...'}
          searchPlaceholder="Search..."
          value={idtype}
          onFocus={() => [setIsIdtypeFocus(true), setIsIdtype(false)]}
          onBlur={() => setIsIdtypeFocus(false)}
          onChange={item => {
            // handleCity(category, item.value)
            setIdType(item.value)
            setIsIdtypeFocus(false);
          }}
        />

        {
        idtype
        &&
        <Input value={idnum}
          onUpdateValue={updateInputValueHandler.bind(this, 'idnum')}
          placeholder={idtype === "nin" ? "Nin number" : idtype === "DL" ? "Drivers license Number" : "Id card number"}
          isInvalid={Isidnum}
          onFocus={() => setIsIdnum(false)}
        />
        }

        <Input
          placeholder="Phone"
          onUpdateValue={updateInputValueHandler.bind(this, 'phone')}
          value={enteredPhone}
          isInvalid={phoneIsInvalid}
          maxLength={11}
          autoCapitalize={'none'}
          keyboardType={"numeric"}
          onFocus={() => setPhoneIsInvalid(false)}
        />

      <Input
        placeholder="Password"
        onUpdateValue={updateInputValueHandler.bind(this, 'password')}
        secure
        value={enteredPassword}
        isInvalid={passwordIsInvalid}
        autoCapitalize={'none'}
        onFocus={() => setPasswordIsInvalid(false)}
        />
          <>
            {
              passwordIsInvalid ? <Text style={{color:Color.tomato, fontSize:12, marginBottom:10}}>Password must be more than 7 characters</Text> : null
              
            }
          </>

          <Input
          placeholder="Confirm Password"
          onUpdateValue={updateInputValueHandler.bind(this, 'confirmpassword')}
          secure
          value={enteredConfirmPassword}
          isInvalid={confirmpasswordIsInvalid}
          autoCapitalize={'none'}
          onFocus={() => setConfirmPasswordIsInvalid(false)}
          />
            <>
              {
                confirmpasswordIsInvalid ? <Text style={{color:Color.tomato, fontSize:12, marginBottom:10}}>Password do not match</Text> : null
                
              }
            </>

      </View>

      <View style={{marginHorizontal:50, marginTop:10, }}>
        <SubmitButton message={"SignUp"} onPress={() => signupValaidate()}/>
      </View>

    <View style={{flexDirection:'row', marginTop:15, alignItem:'center', justifyContent:'center', }}>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.backtext}>Login</Text>
      </TouchableOpacity>
    </View>
    <View style={{marginBottom:20}}/>
    </ScrollView>

    <Modal isVisible={isAcceptTermsModalBisible}>

    <SafeAreaView style={styles.centeredView}>

    <TouchableOpacity style={{justifyContent:'flex-end', alignSelf:'flex-end', marginBottom:5, }} onPress={() => toggleAcceptTermsModal()}>
      <MaterialIcons name="cancel" size={30} color="white" />
    </TouchableOpacity>

    <View style={styles.modalView}>
    <Text style={styles.modalText}>Accept Bid</Text>
 
    <View style={{marginBottom:'2%'}}/>
    <ScrollView showsVerticalScrollIndicator={false}>
    <View style={{alignItems:'center'}}>
      <Text style={{textAlign:'center'}}>CUSTOMER SERVICE LEVEL AGREEMENT</Text> 
    </View>

    <Text> A.	SERVICE LEVEL AGREEMENT(SLA)</Text>

    <Text style={styles.textsty}> 
    1.	Services to be Performed
    I have agreed to work in the capacity of <Text> {enteredfirstname} {enteredlastname}</Text> as an Artisan 
    </Text>

    <Text style={styles.textsty}>
    2.	Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae quo quos laboriosam numquam facilis enim vel iusto similique earum nulla. Aliquid praesentium debitis nihil sed possimus sit corrupti veniam dolores.
    </Text>

    <Text style={styles.textsty}>
    3.  Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae quo quos laboriosam numquam facilis enim vel iusto similique earum nulla. Aliquid praesentium debitis nihil sed possimus sit corrupti veniam dolores.
    </Text>

    <Text style={styles.textsty}>
    4.	Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae quo quos laboriosam numquam facilis enim vel iusto similique earum nulla. Aliquid praesentium debitis nihil sed possimus sit corrupti veniam dolores.
    </Text>

    <Text style={styles.textsty}>
    5.	Terminating the Agreement
    With reasonable cause, either IGOEPP or Artisan may terminate the Agreement, effective immediately upon giving written notice.
    Reasonable cause includes:
    •	A material violation of this Agreement, or
    •	Any act exposing the other party of liability to others for the personal injury or property damage.
    OR
    Either party may terminate this Agreement at any time by giving 30 days written notice to the other party of the intention to terminate. However, Artisan cannot terminate this agreement when there is a pending dispute with one of IGOEPP’s customers involving him.
    </Text>

    <View style={{marginTop:'1%'}}>
      {data.map((item, key) => 
        <View key={key} style={{flexDirection:'row', justifyContent:'center', }}>
          <TouchableOpacity style={[styles.outer, ]} onPress={() => setavail(item.id)}>
            {avail === item.id && <View style={styles.inner}/>} 
          </TouchableOpacity>
          <Text> Accept</Text>
      </View>
      )}
    </View>
        <View style={{marginBottom:10}}/>
    {
      avail  && 
      <View style={{marginHorizontal:20}}>
        <SubmitButton message={"Continue"} onPress={() => signuphandler()}/>
      </View>
    }
      <View style={{marginBottom:10}}/>

    </ScrollView>

      </View>


      </SafeAreaView>
    </Modal>
  
  </SafeAreaView>
  )
}

export default SignUpScreen

const styles = StyleSheet.create({
  shadow:{
    marginBottom: 20,
    borderRadius: 20, 
    elevation: 7,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    backgroundColor: 'white',
    overflow: Platform.OS === 'andriod' ? 'hidden' : 'visible',
  },
  containerBoard:{
    borderTopLeftRadius: 30,
    borderTopRightRadius:30,
    width:DIMENSION.WIDTH, 
    height:DIMENSION.HEIGHT, 
    padding: 10, 
    marginTop:20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
    backgroundColor: 'white',
    overflow: Platform.OS === 'andriod' ? 'hidden' : 'visible',
  },
  availtext:{
    fontSize:15,
    fontFamily:'poppinsSemiBold',
    color: Color.new_color
  },
  outer:{
    width:25,
    height: 25,
    borderWidth: 1,
    borderRadius: 15,
    justifyContent:'center',
    alignItems: 'center'
  },
  inner:{
    width:15,
    height:15,
    backgroundColor: Color.darkolivegreen_100,
    borderRadius:10
  },
  textsty:{
    fontFamily:'poppinsRegular'
  },
  backtext:{
    fontSize:16,
    fontFamily: 'poppinsMedium'
  },
  nameContainer:{
    flexDirection: "row",
    flex:1
  },
  firstname:{
    flex:1,
    marginRight:5
  },
  lastname:{
    marginLeft:5,
    flex:1
  },
  Title:{
    marginTop: 10, 
    marginBottom: 10,
    fontSize: 25,
    fontFamily: 'poppinsMedium',
    color: Color.darkolivegreen_100
  },
  inputInvalid: {
    backgroundColor: Color.error100,
  },
  selectedTextStyle: {
    fontSize: 16,
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
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  }, 
  placeholderStyle: {
    fontSize: 16,
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
    margin: 15,
    backgroundColor: 'white',
    width: DIMENSION.WIDTH  * 0.9,
    borderRadius: 20,
    padding: 25,
    // alignItems: 'center',
    maxHeight: DIMENSION.HEIGHT * 0.7,
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
})