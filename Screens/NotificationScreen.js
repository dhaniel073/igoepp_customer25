import { FlatList, SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Border, Color, DIMENSION, marginStyle } from '../Component/Ui/GlobalStyle'
import { Notification, NotificationById } from '../utils/AuthRoute'
import { AuthContext } from '../utils/AuthContext'
import GoBack from '../Component/Ui/GoBack'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'
import Modal from 'react-native-modal'
import {MaterialIcons} from '@expo/vector-icons'

const NotificationScreen = ({navigation}) => {
  const authCtx = useContext(AuthContext)
  const [data, setdata] = useState([])
  const [isloading, setisloading] = useState(false)
  const [ischecking, setischecking] = useState(false)
  const [ismodalvisible, setismodalvisible] = useState(false)
  const [notificationbyidmessage, setnotificationbyidmessage] = useState([])
  const maxCharacters = 150;

  useEffect(() => {
    const unsuscribe = navigation.addListener('focus', async () => {
      try {
        setisloading(true)
        const response = await Notification(authCtx.userid, authCtx.token)
        setdata(response)
        // console.log(response)
        setisloading(false)
      } catch (error) {
        setisloading(true)
        // console.log(error.response)
        setisloading(true)
      }
    })
    return unsuscribe;
  }, [])

  
  const refresh = async () => {
    try {
      const response = await Notification(authCtx.userid, authCtx.token)
      setdata(response)
    } catch (error) {
      // console.log(error)
      return
    }
  }

  const checknotid = async (id) => {
    try {
      setischecking(true)
      const response = await NotificationById(id, authCtx.token)
      // console.log(response)
      setnotificationbyidmessage(response.data)
      setischecking(false)
    } catch (error) {
      setischecking(true)
      // console.log(error)
      setischecking(false)
      return;
      
    }
  }

  const toggleModal = () => {
    setismodalvisible(!ismodalvisible)
  }

    
  if(isloading){
    return <LoadingOverlay/>
  }
  const NoSubCategoryNote = () => {
    return (
      <View style={{ justifyContent:'center', alignItems:'center', marginTop: DIMENSION.HEIGHT * 0.33 }}>
        <Text style={{ fontSize: 14, color: 'grey', fontFamily: 'poppinsSemiBold' }}>Notifaction Empty</Text>
        <TouchableOpacity onPress={()=> navigation.navigate('RequestHelp')}>
        {/* <Text style={{  fontSize: 14, color:Color.limegreen, fontFamily: 'poppinsSemiBold'  }}>No Notifaction</Text> */}
        </TouchableOpacity>
      </View>
    )
  }
     

  return (
    <SafeAreaView style={{marginTop: marginStyle.marginTp, marginHorizontal:10, flex:1}}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <Text style={styles.addtowalletpaymentxt}>Notifications</Text>
      
      {
        data.length === 0 ? <NoSubCategoryNote/> 
        :
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <TouchableOpacity style={styles.pressable} onPress={() => [toggleModal(), checknotid(item.id)]}>
            <Text style={item.status === 'U' ? styles.unread : styles.read}>{item.message.slice(0, maxCharacters)+ "...."}</Text>

            <Text style={{position: 'absolute', justifyContent:'flex-end', fontSize:11, alignSelf:'flex-end', top:'130%', right: 15,}}>
              Tap to view
            </Text>
          </TouchableOpacity>
          )}
        />
      }

      <Modal isVisible={ismodalvisible}>
        <SafeAreaView style={styles.centeredView}>
          <TouchableOpacity style={{justifyContent:'flex-end', alignSelf:'flex-end', marginBottom:5, }} onPress={() => [toggleModal(), refresh()]}>
            <MaterialIcons name="cancel" size={30} color="white" />
          </TouchableOpacity>
            <View style={styles.modalView}>
            {
            ischecking ? 
            <View style={{flex:1, marginTop: 30, marginBottom: 70}}>
              <LoadingOverlay/>  
            </View>
            :
              <Text>{notificationbyidmessage.message}</Text>
            }
            </View>
        </SafeAreaView>
       </Modal>
    </SafeAreaView>
  )
}

export default NotificationScreen

const styles = StyleSheet.create({
  addtowalletpaymentxt:{
    fontSize: 18,
    color: Color.darkolivegreen_100,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
    marginBottom:15,
  }, 
  pressable:{
    backgroundColor: Color.mintcream,
    borderColor: "rgba(151, 173, 182, 0.2)",
    borderWidth: 1,
    borderStyle: "solid",
    margin:5,
    borderRadius: Border.br_3xs,
    padding:23,
  },
  unread:{
    fontFamily: 'poppinsBold',
    fontSize:13
  },
  read:{
    fontFamily: 'poppinsRegular',
    fontSize:13
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
    width: DIMENSION.WIDTH  * 0.9,
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
})