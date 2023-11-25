import { ScrollView, StyleSheet, Text, SafeAreaView, TouchableOpacity, View, Alert } from 'react-native'
import React, { useContext, useState }  from 'react'
import { Image } from 'expo-image'
import Input from '../Component/Ui/Input'
import SubmitButton from '../Component/Ui/SubmitButton';
import { Color } from '../Component/Ui/GlobalStyle';
import { Dropdown } from 'react-native-element-dropdown';
import { SignUp } from '../utils/AuthRoute';
import { AuthContext } from '../utils/AuthContext';
import LoadingOverlay from '../Component/Ui/LoadingOverlay';

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

    const signuphandler = async () => {
      const emailIsValid = enteredEmail.includes('@') && enteredEmail.includes('.com');
      const passwordIsValid = enteredPassword.length < 7;
      const passcheck =  enteredPassword === enteredConfirmPassword || enteredConfirmPassword !== null || undefined
      const phonecheck = enteredPhone === null || undefined || "" || enteredPhone.length === 0
      const gendercheck = enteredGender === null || undefined || "" || enteredGender.length === 0
      const idnumcheck = idnum === null || undefined || "" || idnum.length === 0
      const idtypecheck = idtype === null || undefined || "" || idtype.length === 0

      console.log(passcheck)
    
      if(!emailIsValid || passwordIsInvalid || !passcheck || phonecheck || gendercheck || idnumcheck || idtypecheck || !enteredfirstname || !enteredlastname){

        const InvalidPhone = phonecheck
        setEmailIsInvalid(!emailIsValid)
        setPasswordIsInvalid(passwordIsValid)
        setConfirmPasswordIsInvalid(!passcheck)
        setPhoneIsInvalid(InvalidPhone)
        setGenderIsInvalid(gendercheck)
        setFirstNameIsInvalid(!enteredfirstname)
        setLastNameIsInvalid(!enteredlastname)
        setIsIdnum(idnumcheck)
        setIsIdtype(idtypecheck)

        console.log(emailIsInvalid, passwordIsInvalid, confirmpasswordIsInvalid, phoneIsInvalid, genderIsInvalid, firstnameIsInvalid, lastnameIsInvalid, Isidtype, Isidnum)

        Alert.alert('Invalid details', 'Please check your entered credentials.')
      }else{
          console.log(enteredEmail,
            enteredPassword,
            enteredConfirmPassword,
            enteredfirstname,
            enteredlastname,
            enteredPhone,
            idnum,
            idtype,
            enteredGender)
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
            setisloading(false)
          } catch (error) {
            setisloading(true)
            console.log(error.response)
            const myObj = error.response.data.email[0];
            Alert.alert('SignUp Failed', myObj)
            setisloading(false)
          }
      }
    }

    if(isloading){
      return <LoadingOverlay message={"..."}/>
    }

  return (
    <SafeAreaView>
    <ScrollView showsVerticalScrollIndicator={false} style={{marginTop:35}}>
      <View style={{justifyContent:'center', flex:1, marginTop:'10%', marginHorizontal:20}}>
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
          keyboardType={"numeric"}      
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
        <SubmitButton message={"SignUp"} onPress={() => signuphandler()}/>
      </View>

    <View style={{flexDirection:'row', marginTop:15, alignItem:'center', justifyContent:'center', }}>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.backtext}>Login</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  
  </SafeAreaView>
  )
}

export default SignUpScreen

const styles = StyleSheet.create({
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
})