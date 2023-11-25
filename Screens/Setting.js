import { Alert, Linking, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext } from 'react'
import { Color, marginStyle } from '../Component/Ui/GlobalStyle'
import GoBack from '../Component/Ui/GoBack'
import {Ionicons, Feather} from "@expo/vector-icons"
import { AuthContext } from '../utils/AuthContext'

const Setting = ({navigation}) => {
  const authCtx = useContext(AuthContext)

  const whatsapp = () => {
     const response =  Linking.openURL('whatsapp://send?text=hello&phone=+2348103902560')
    .then((res) => {
      console.log(res)
    }).catch((error) => {
      Alert.alert("WhatsApp not found ", "WhatsApp not found on device please install whatsApp and try again")
      console.log(error)
    })
  }

  return (
    <View style={{ flex:1, marginTop:marginStyle.marginTp, marginHorizontal: 10, }}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <SafeAreaView style={{marginTop: 60, justifyContent:'center'}}>
        <Text style={{ fontFamily: 'poppinsBold', fontSize: 25, textAlign: 'center'  }}>Settings</Text>
      </SafeAreaView>


      <View style={{ marginTop: "10%", padding:15 }}>
          <TouchableOpacity style={{ alignItems: 'flex-start', borderBottomWidth:1,}} onPress={() => navigation.navigate('Profile')}>
            <View style={{ flexDirection: 'row',   paddingBottom: 20 }}>
              <Ionicons name='person-outline' size={24}/>
              <Text style={styles.textStyle}>Account</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={{ alignItems: 'flex-start', borderBottomWidth:1,}} onPress={() => navigation.navigate("Compliance")}>
            <View style={{ flexDirection: 'row',   paddingBottom: 15, marginTop: 15 }}>
            <Ionicons name="document-attach-outline" size={24} color='black' />
              <Text style={styles.textStyle}>Compliance Docs</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={{ alignItems: 'flex-start', borderBottomWidth:1,}} onPress={() => navigation.navigate("NotificationSetup")}>
            <View style={{ flexDirection: 'row',   paddingBottom: 15, marginTop: 15 }}>
              <Ionicons name='notifications-outline' size={24}/>
              <Text style={styles.textStyle}>Notification Setup</Text>
            </View>
          </TouchableOpacity>


          <TouchableOpacity style={{ alignItems: 'flex-start', borderBottomWidth:1,}} onPress={whatsapp}>
            <View style={{ flexDirection: 'row',   paddingBottom: 15, marginTop: 15 }}>
              <Ionicons name='headset' size={24}/>
              <Text style={styles.textStyle}>Help And Support</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={{ alignItems: 'flex-start', borderBottomWidth:1,}} onPress={() => navigation.navigate("TransactionPin")}>
            <View style={{ flexDirection: 'row',   paddingBottom: 15, marginTop: 15 }}>
            <Feather name="lock" size={24} color="black" />
              <Text style={styles.textStyle}>Set Transaction Pin</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={{ alignItems: 'flex-start', borderBottomWidth:1,}} onPress={() => navigation.navigate("Biometric")}>
            <View style={{ flexDirection: 'row',   paddingBottom: 15, marginTop: 15 }}>
            <Ionicons name="finger-print" size={24} color="black" />
              <Text style={styles.textStyle}>Biometric Setup</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={{ alignItems: '', justifyContent:'space-between', borderBottomWidth:1, width: '100%'}} onPress={() => Alert.alert("Logout", "Are you sure you want to logout", [
            {
              text:"No",
              onPress: () => {}
            },
            {
              text:"Yes",
              onPress:() => authCtx.logout()
            }
          ])}>
            <View style={{ flexDirection: 'row',  paddingBottom: 15, marginTop: 15 }}>
              <Ionicons name='exit-outline' size={24}/>
                <Text style={styles.textStyle}>LogOut</Text>
            </View>
          </TouchableOpacity>

      </View>
    </View>
  )
}

export default Setting

const styles = StyleSheet.create({
    addtowalletpaymentxt:{
      fontSize: 18,
      color: Color.darkolivegreen_100,
      fontFamily: 'poppinsSemiBold',
      left: 10,
      marginTop:10,
      marginBottom:15,
    },
    container: {
      marginTop: 20
    },
    textStyle:{
      fontFamily: 'poppinsMedium',
      fontSize: 12,
      marginLeft: 10,
      top: 8
    } 
})