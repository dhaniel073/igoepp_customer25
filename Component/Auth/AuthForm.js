import { ScrollView, StyleSheet, View,  Image, TouchableOpacity, Text,  } from 'react-native';
import { Color } from '../Ui/GlobalStyle';
import { Dropdown } from 'react-native-element-dropdown';
import SubmitButton from '../Ui/SubmitButton';
import Input from '../Ui/Input'
import { useState } from 'react';

const sex = [
  { label: 'Male', value: 'M' },
  { label: 'Female', value: 'F' },
 
];

function AuthForm({ isLogin, onSubmit, credentialsInvalid }) {
  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredFirstname, setEnteredFirstName] = useState('');
  const [enteredLastName, setEnteredLastName] = useState('');
  const [enteredGender, setEnteredGender] = useState('');
  const [enteredPhone, setEnteredPhone] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');
  const [enteredConfirmPassword, setEnteredConfirmPassword] = useState('');
  const [isSexFocus, setSexFocus] = useState('')


  const {
    email: emailIsInvalid,
    firstname: firstnameIsInvalid,
    lastname: lastnameIsInvalid,
    gender: genderIsInvalid,
    phone: phoneIsInvalid,
    // confirmEmail: emailsDontMatch,
    password: passwordIsInvalid,
    confirmPassword: passwordsDontMatch,
  } = credentialsInvalid;

  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case 'email':
        setEnteredEmail(enteredValue);
        break;
      case 'firstname':
        setEnteredFirstName(enteredValue);
        break;
      case 'lastname':
        setEnteredLastName(enteredValue);
        break;
      case 'phone':
        setEnteredPhone(enteredValue);
        break;
      case 'password':
        setEnteredPassword(enteredValue);
        break;
      case 'confirmPassword':
        setEnteredConfirmPassword(enteredValue);
        break;
    }
  }

  function submitHandler() {
    onSubmit({
      email: enteredEmail,
      firstname: enteredFirstname,
      lastname: enteredLastName,
      phone: enteredPhone,
      gender: enteredGender,
      password: enteredPassword,
      confirmPassword: enteredConfirmPassword,
    });
  }

  return (
    <ScrollView style={{marginHorizontal:5}}>
    <Text style={styles.Title}>{isLogin ? "Log In" : "Sign Up"}</Text>
    
      <View>
        <View style={styles.nameContainer}>
        <View style={styles.firstname}>
        {!isLogin && (
        <Input
          placeholder="First Name"
          onUpdateValue={updateInputValueHandler.bind(this, 'firstname')}
          value={enteredFirstname}
          isInvalid={firstnameIsInvalid}

          />
        )}
        </View>
        <View style={styles.lastname}>
        {!isLogin && (
          <Input
            placeholder="Last Name"
            onUpdateValue={updateInputValueHandler.bind(this, 'lastname')}
            value={enteredLastName}
            isInvalid={lastnameIsInvalid}

            />
          )}
          </View>
        </View>

        <Input
          placeholder="Email Address"
          onUpdateValue={updateInputValueHandler.bind(this, 'email')}
          value={enteredEmail}
          autoCapitalize={'none'}
          keyboardType="email-address"
          isInvalid={emailIsInvalid}
        />
        {!isLogin && (
            <View style={{ borderBottomColor:Color.darkslategray_300, borderBottomWidth:1}}>
                <Dropdown
                style={[styles.dropdown, isSexFocus && { borderColor: 'blue' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={sex}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isSexFocus ? 'Select Gender' : '...'}
                searchPlaceholder="Search..."
                value={enteredGender}
                onFocus={() => setSexFocus(true)}
                onBlur={() => setSexFocus(false)}
                onChange={item => {
                    setEnteredGender(item.value);
                    setSexFocus(false);
                }}
                />
                <View style={{ marginBottom:10 }}/>
            </View>

        )}

        {!isLogin && (
          <Input
            placeholder="Phone"
            onUpdateValue={updateInputValueHandler.bind(this, 'phone')}
            value={enteredPhone}
            keyboardType="numeric"
            isInvalid={phoneIsInvalid}
            maxLength={11}
          />
        )}
        <>
        <Input
          placeholder="Password"
          onUpdateValue={updateInputValueHandler.bind(this, 'password')}
          secure
          value={enteredPassword}
          isInvalid={passwordIsInvalid}
          autoCapitalize={'none'}
          />
          {!isLogin  && (
            <>
              {
                enteredPassword.length <= 7 ? <Text style={{color:Color.tomato, fontSize:12}}>Password must be more than 7 characters</Text> : null
                
              }
              </>
          )}
          </>
        {!isLogin && (
          <>
          <Input
            placeholder="Verify Password"
            onUpdateValue={updateInputValueHandler.bind(
              this,
              'confirmPassword'
              )}
              secure
              value={enteredConfirmPassword}
              isInvalid={passwordsDontMatch}
              />
            {enteredPassword !== enteredConfirmPassword && <Text style={{color:Color.tomato, fontSize:12}}>Password must Doesn't match</Text>}
          </>

        )}

        <View style={styles.buttons}>   
        <SubmitButton onPress={submitHandler} message={isLogin ? 'Log In' : 'Sign Up'}/>
        </View>
       
      </View>
    </ScrollView>
  );
}

export default AuthForm;

const styles = StyleSheet.create({
  selectedTextStyle: {
    fontSize: 16,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 10
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
  },
  buttons: {
    marginTop: 25,
    marginBottom:20,
    marginLeft:20,
    marginRight:20
  },
  nameContainer:{
    flex: 1,
    flexDirection: "row",
    // justifyContent: 'space-between',
  },
  firstname:{
    width: "50%"
  },
  lastname:{
    marginHorizontal: 10,
    width: "50%"

  },
  Title:{
    marginTop: 10, 
    marginBottom: 10,
    // marginHorizontal: 50,
    fontSize: 30,
    // fontWeight: 'bold',
    fontFamily: 'poppinsMedium',
    color: Color.darkolivegreen_100
  },

  
});
