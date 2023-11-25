import { Alert, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import AuthForm from './AuthForm';
import Flat from '../Ui/Flat';
import { useState } from 'react';
// import Button from '../ui/Button';

function AuthContent({ isLogin, onAuthenticate }) {
  const navigation = useNavigation();

  const [credentialsInvalid, setCredentialsInvalid] = useState({
    email: false,
    firstname: false,
    lastname: false,
    gender: false,
    phone: false,
    password: false,
    confirmEmail: false,
    confirmPassword: false,
  });

  function switchAuthModeHandler() {
    if (isLogin) {
      navigation.replace('Signup');
    } else {
      navigation.replace('Login');
    }
  }

  function ForgetPasswordHandler(){
    navigation.navigate('ForgotPassword')
  }

  function submitHandler(credentials) {
    let { email, firstname, lastname, gender, phone, password, confirmPassword } = credentials;

    email = email.trim();
    password = password.trim();

    const emailIsValid = email.includes('@');
    const passwordIsValid = password.length > 7;
    const passwordsAreEqual = password === confirmPassword;
    if (
      !emailIsValid ||
      !passwordIsValid ||
      (!isLogin && (!passwordsAreEqual))
    ) {
      Alert.alert('Invalid input', 'Please check your entered credentials.');
      setCredentialsInvalid({
        email: !emailIsValid,
        // firstname: !firtnameIsValid,
        // confirmEmail: !emailIsValid || !emailsAreEqual,
        password: !passwordIsValid,
        confirmPassword: !passwordIsValid || !passwordsAreEqual,
      });
      return;
    }
    onAuthenticate({ email, password, gender, phone, firstname, lastname});
  }


  return (
    <View style={styles.authContent}>
      <Image style={{ width:100, height:100, alignSelf:'center'}} source={require("../../assets/igoepp_transparent2.png")}   placeholder={'blurhash'} contentFit="contain"
      />
      <AuthForm
        isLogin={isLogin}
        onSubmit={submitHandler}
        credentialsInvalid={credentialsInvalid}
      />
      <View style={styles.button}>
        {isLogin && (
          <Flat onPress={ForgetPasswordHandler}>
            Forgot Password
          </Flat>
        )}
      </View>
    </View>
  )
}

export default AuthContent;

const styles = StyleSheet.create({
  authContent: {
    marginHorizontal: 8,
    padding: 10,
    borderRadius: 8,
  },
  buttons: {
    color: 'white'
  },
  image4: {
    position: 'absolute',
    width: 10,
    height: 80,
    marginLeft: "34%",
    marginTop: "90%",

  },
});
