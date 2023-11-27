import { Alert, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { Color, DIMENSION, marginStyle } from '../Component/Ui/GlobalStyle'
import GoBack from '../Component/Ui/GoBack'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'
import { InternetPayment, ValidateInternet } from '../utils/AuthRoute'
import { AuthContext } from '../utils/AuthContext'
import Input from '../Component/Ui/Input'
import { Dropdown } from 'react-native-element-dropdown'
import {MaterialIcons, Entypo} from '@expo/vector-icons'
import Modal from 'react-native-modal'
import { Image, ImageBackground } from 'expo-image'
import axios from 'axios'
import SubmitButton from '../Component/Ui/SubmitButton'
import * as Notifications from 'expo-notifications'


const Internet = ({route, navigation}) => {
  const [category, setcategory] = useState([])
  const [isLoading, setisLoading] = useState(false)
  const [isFocus, setisFocus] = useState()
  const [id, setid] = useState()
  const authCtx = useContext(AuthContext)
  const [bouquest, setBosquet] = useState([])
  const [isbouquestfocus, setIsBosquetFocus] = useState(false)
  const [bouquestData, setBosquetData] = useState()
  const [isModalVisble, setIsModalVisible] = useState(false)
  const [price, setPrice] = useState()
  const [smartcard, setSmartCard] = useState()
  const [ref, setRef] = useState('')
  const maindate = new Date() 
  const date = maindate.toDateString()
  const time = maindate.toLocaleTimeString()



  const authId = route?.params?.id
  let reqId;


  useEffect(() => {
    setisLoading(true)
    const url = `https://phixotech.com/igoepp/public/api/auth/billpayment/getAllBillersByCategory/${authId}`
    const response = axios.get(url, {
        headers:{
            Accept:'application/json',
            Authorization: `Bearer ${authCtx.token}`
        }
    }).then((res) => {
        // console.log(res.data)
        var count = Object.keys(res.data).length;
        let catarray = []
        for (var i = 0; i < count; i++){
            catarray.push({
                label: res.data[i].name,
                value: res.data[i].id,
            })
            // setCityCode(response.data.data[i].lga_code)
        }
        setcategory(catarray)
    }).catch((error) => {
        // console.log(error)
        return;
      })
      setisLoading(false)
  }, [])

  const toggleModal =  (value) => {
    setIsModalVisible(!isModalVisble)
    // console.log(id)
    reqId = value
  }
  const getBouquets = (value) => {
    // console.log(authId, id)
    
    const url = `https://phixotech.com/igoepp/public/api/auth/billpayment/getAllBouquetByBillerID/${authId}/${value}`
    const response = axios.get(url, {
        headers:{
            Accept:'application/json',
            Authorization: `Bearer ${authCtx.token}`
        }
    }).then((res) => {
        // console.log(res.data.data.bouquets)
        var count = Object.keys(res.data.data.bouquets).length;
        let catarray = []
        for (var i = 0; i < count; i++){
            catarray.push({
                label: res.data.data.bouquets[i].name,
                value: res.data.data.bouquets[i].code,
                price: res.data.data.bouquets[i].price
            })
            // setCityCode(response.data.data[i].lga_code)
        }
        setBosquet(catarray)
    }).catch((error) => {
        // console.log(error.response.data)
        Alert.alert(error.response.data.status, error.response.data.message+ " internet type not available",[
          {
            text:'Ok',
            onPress: () => setBosquet([])
          }
        ])
        return;
    })
  }

  const validateNumber = async () => {
      try {
        setisLoading(true)
        const response = await ValidateInternet(authCtx.Id, id, smartcard, authCtx.token)
        console.log(response.data)
        if(response.data.status === 'Success'){
          Alert.alert("Confirm Purchase", `Confirm Internet Purchase  for ${smartcard}`, [
            {
                text: "Cancel",
                onPress: () => {}
            },
            {
                text:'Confirm',
                onPress: () => makePayment(response.data.requestID)
            }
        ])
        }else{
          Alert.alert("Error", response.data, [
            {
              text: "Ok",
              onPress: () => {}
            }
         ])
        }
        setisLoading(false)
      } catch (error) {
        setisLoading(true)
        Alert.alert("Error", "Invalid SmartCardId", [
          {
            text:"Ok",
            onPress: () => navigation.goBack()
          }
        ])
        console.log(error)
        setisLoading(false)
        return;
      }
  }

  const updatevalue = (inputType, enteredValue) => {
    switch(inputType){
      case 'smartcard':
        setSmartCard(enteredValue)
        break;
    }
  }

  const makePayment = async (requestID) => {
    try {
      setisLoading(true)
      const response = await InternetPayment(requestID, price, bouquestData, authCtx.token)
      // console.log(response)
      if(response.data.message === "failed"){
        Alert.alert(response.data.message, response.data.description + ", fund wallet and try again", [
          {
            text:"Ok",
            onPress:() => navigation.goBack()
          }
        ])
      }else{
        setRef(response.data.requestID)
        schedulePushNotification(response)
        toggleModal()
      }
      setisLoading(false)
    } catch (error) {
      // console.log(error.response)
      setisLoading(true)
      Alert.alert("Error", "An error occured please try again later", [
        {
          text:'Ok',
          onPress: () => navigation.goBack()
        }
      ])
      setisLoading(false)
      return;
    }
  }
  async function schedulePushNotification(response) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Internet Subscription 🔔`,
        body: `Internet subscription payment was successful\nAmount: ${price}\nSmartCard Id: ${smartcard}\nRef: ${response.data.requestID}\nDate: ${date} ${time} `,
        data: { data: 'goes here' },
      },
      trigger: { seconds: 2 },
    });
  }

  if(isLoading){
    return <LoadingOverlay message={"..."}/>
  }

  return (
    <ScrollView style={{marginTop: marginStyle.marginTp, marginHorizontal:10}}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <Text style={styles.internettxt}>Internet</Text>

      <ImageBackground style={{flexDirection:'row', alignItems:'center', justifyContent:'space-evenly',}}>
        <Image contentFit='contain' source={require("../assets/smile.png")} style={[styles.image]}/>
        <Image contentFit='contain' source={require("../assets/spectranet.png")} style={[styles.image]}/>
      </ImageBackground>

      <View style={{marginTop:10}}/>

      <View style={{marginHorizontal:10}}>

        <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={category}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Select Data Network' : '...'}
        searchPlaceholder="Search..."
        value={id}
        onFocus={() => setisFocus(true)}
        onBlur={() => setisFocus(false)}
        onChange={item => {
          setid(item.value);
          setisFocus(false);
          getBouquets(item.value)
        }}
        />

        {id && 
            <>
            <View style={{ marginBottom:30}}/>
              {/* <Text style={styles.label}>Select Internet Plan </Text> */}

              <Dropdown
              style={[styles.dropdown, isbouquestfocus && { borderColor: 'blue' }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={bouquest}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isbouquestfocus ? 'Select Network Plan' : '...'}
              searchPlaceholder="Search..."
              value={bouquestData}
              onFocus={() => setIsBosquetFocus(true)}
              onBlur={() => setIsBosquetFocus(false)}
              onChange={item => {
                  setBosquetData(item.value);
                  setPrice(item.price)
                  setIsBosquetFocus(false);
              }}
              />
            <View style={{ marginBottom:20}}/>
            </>
        }

        {bouquestData && 
          <>
            <Text style={styles.label}>Price</Text>
            <Input editable={false} value={price} />              
          </>
        }

        {bouquestData &&
        <>
        <Input placeholder={"Enter Smart Card Id"} maxLength={15} keyboardType={"numeric"} value={smartcard} onUpdateValue={updatevalue.bind(this, 'smartcard')}/>
          
          <View style={{marginHorizontal:20, marginTop:20}}>
              <SubmitButton message={"Submit"} onPress={() => smartcard === null || smartcard === undefined || smartcard === "" ? Alert.alert('No Smard Card Id', "Enter a smart card id to continue") :  validateNumber()}/>
          </View>
        </>
        }

      </View>

      <Modal isVisible={isModalVisble}>
        <SafeAreaView style={styles.centeredView}>

        <TouchableOpacity style={{justifyContent:'flex-end', alignSelf:'flex-end', marginBottom:5, }} onPress={() => [toggleModal(), navigation.goBack()]}>
          <MaterialIcons name="cancel" size={30} color="white" />
        </TouchableOpacity>

        <View style={styles.modalView}>
          <Text style={styles.modalText}>Reciept</Text>
        <Image source={require("../assets/igoepp_transparent2.png")} style={{height:130, width:130, position:'absolute', alignContent:'center', alignSelf:'center', top: DIMENSION.HEIGHT * 0.1, justifyContent:'center', opacity:0.3, }} contentFit='contain'/>
            {
              Platform.OS === "android" ? 
                <View style={{borderBottomWidth:0.5, marginTop:5, borderStyle:"dashed"}}/>
              :
                <View style={{borderBottomWidth:0.5, marginTop:5}}/>
            }

            {/* <Text style={{fontFamily:'poppinsRegular'}}>-------------------------------------------</Text> */}
            
              <View style={{marginBottom:25, marginTop:25}}>
                  
                  <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                    <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>SmartCard Id :</Text>
                    <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{smartcard}</Text>
                  </View>

                    <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                    <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Amount Funded :</Text>
                    <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{price}</Text>
                  </View>

                  <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                    <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Ref :</Text>
                    <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{ref}</Text>
                  </View> 

                  <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                    <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Date :</Text>
                    <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{date} {time}</Text>
                  </View>

                    <View style={{flexDirection:'row', justifyContent:'space-evenly', alignItems:'center', marginTop: 20,}}>
                    
                      <TouchableOpacity style={styles.cancelbtn} onPress={() => {}}>
                            <Text><Entypo name="forward" size={24} color="black" /></Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.viewbtn} onPress={() => [toggleModal(), navigation.goBack()]}>
                          <Text style={styles.viewtext}>Close</Text>
                      </TouchableOpacity>
                    </View>
                </View>              
        </View>
        </SafeAreaView>
      </Modal>
    </ScrollView>
  )
}

export default Internet

const styles = StyleSheet.create({
  internettxt:{
    fontSize: 18,
    color: Color.darkolivegreen_100,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
    marginBottom:15,
  }, 
  selectedTextStyle:{
    fontSize:12,
  },
  dropdown: {
    maxHeight: 70,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    padding:10,
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
    fontSize: 12,
  },
  image:{
    width: 60,
    height: 60,
    borderRadius:100,
    padding:10,
    
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
    width: DIMENSION.WIDTH * 0.9,
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
    fontSize:18, 
    fontFamily:'poppinsRegular'
  },
})