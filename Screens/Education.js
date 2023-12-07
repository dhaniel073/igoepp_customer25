import { Alert, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Color, DIMENSION, marginStyle } from '../Component/Ui/GlobalStyle'
import GoBack from '../Component/Ui/GoBack'
import { ImageBackground, Image } from 'expo-image'
import { Dropdown } from 'react-native-element-dropdown'
import Input from '../Component/Ui/Input'
import SubmitButton from '../Component/Ui/SubmitButton'
import { AuthContext } from '../utils/AuthContext'
import axios from 'axios'
import { CustomerInfoCheck, ValidatePin, WaecCard } from '../utils/AuthRoute'
import * as Notifications from 'expo-notifications'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'
import Modal from 'react-native-modal'
import {MaterialIcons, MaterialCommunityIcons, Entypo} from '@expo/vector-icons'
import { useRef } from 'react'



const Education = ({route, navigation}) => {
  const [category, setcategory] = useState([])
  const [isLoading, setisLoading] = useState(false)
  const [isFocus, setisFocus] = useState(false)
  const [id, setid] = useState()
  const [isEduFocus, setIsEduFocus] = useState(false)
  const [edu, setEdu] = useState('')
  const [bouquest, setBosquet] = useState([])
  const [pin, setPin] = useState()
  const [ref, setRef] = useState()
  const [price, setPrice] = useState('')
  const [isModalVisble, setIsModalVisible] = useState(false)
  const authId = route?.params?.id
  const authCtx = useContext(AuthContext)
  const [pinT, setpinT] = useState()
  const [pinvalid, setpinvalid] = useState(false)
  const [pincheckifempty, setpincheckifempty] = useState([])
  const [isSetpinModalVisible, setisSetpinModalVisible] = useState(false)
  const [pinerrormessage, setPinerrorMessage] = useState('')
  const [ischecking, setischecking] = useState(false)


  const maindate = new Date() 
  const date = maindate.toDateString()
  const time = maindate.toLocaleTimeString()

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        setisLoading(true)
        const response = await CustomerInfoCheck(authCtx.Id, authCtx.token)
        setpincheckifempty(response.transaction_pin_setup)
        setisLoading(false)
      } catch (error) {
        setisLoading(true)
        setisLoading(false)
        return;
      }
    })
    return unsubscribe;
  }, [])

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
          // console.log(error.response)
          return;
      })
  }


  let refT = useRef(0);

  function handleClick() {
    refT.current = refT.current + 1;
    // alert('You clicked ' + ref.current + ' times!');
  }

  const togglePinModal = (id, pricetag) => {
    setisSetpinModalVisible(!isSetpinModalVisible)
    
  }
  
  const pinValidateCheck = async () => {
    if(refT.current > 3){
      Alert.alert("", "To many attempt, try again later", [
        {
          text: "Ok",
          onPress: () => navigation.goBack()
        }
      ])
    }else{
      try {
        setischecking(true)
        const response = await ValidatePin(authCtx.Id, pinT, authCtx.token)
        // console.log(response)
        setpinT()
        validate()
      } catch (error) {
        setischecking(true)
        setpinT()
        setPinerrorMessage(error.response.data.message + "\n" + (3 - refT.current + ` trial${3-refT.current > 1 ? 's' : ""} remaining`))
        // console.log(error.response)
        Alert.alert("Error", error.response.data.message+ " " + "Try again", [
          {
            text: "Ok",
            onPress: () => {}
          },
        ])
        setischecking(false)

      }
    }
  }


  const validate = async () => {
    togglePinModal()
    try{
      setisLoading(true)
      const response = await WaecCard(authCtx.Id, id, edu, price, authCtx.token)
      // console.log(response)
      if(response.data.message === "failed"){
        Alert.alert(response.data.message, response.data.description + ", fund wallet and try again", [
          {
            text:"Ok",
            onPress:() => navigation.goBack()
          }
        ])
      }else{
        schedulePushNotification(response)
        setRef(response.data.requestID)
        setPin(response.data.PIN)
        toggleModal()
      }
      setisLoading(false)
  }catch(error) {
      setisLoading(true)
      Alert.alert("Error", "An error occured while making the purchase pease try agin later", [
          {
            text:"Ok",
            onPress: () => navigation.goBack()
          }
      ])
      // console.log(error.response.data)
      setisLoading(false)
      return;

  }
  }

  if(isLoading){
      return <LoadingOverlay message={"..."}/>
  }


  async function schedulePushNotification(response) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `WAEC Pin 🔔`,
        body: `${response.data.status}\nWaec Pin: ${response.data.PIN}\nAmount: ${price}\nRef: ${response.data.requestID}\nDate: ${date} ${time}`,
        data: { data: 'goes here' },
      },
      trigger: { seconds: 2 },
    });
  }


  return (
    <ScrollView style={{marginTop:marginStyle.marginTp, marginHorizontal:10}} showsVerticalScrollIndicator={false}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <Text style={styles.educationtxt}>Education</Text>

     
      {
        pincheckifempty === "N" ? Alert.alert("Message", "No transaction pin, set a transaction pin to be able to make transactions", [
          {
            text: "Ok",
            onPress: () =>  navigation.navigate('TransactionPin')
          }
        ]) 
        :

      <>
      <ImageBackground style={{flexDirection:'row', alignItems:'center', justifyContent:'space-evenly',}}>
          <Image contentFit='contain' source={require("../assets/waec.png")} style={[styles.image]}/>
      </ImageBackground>

      <View style={{marginTop:20}}/>

      <View style={{marginHorizontal:10}}>

            {/* <Text style={styles.label}>Select Distribution Company</Text> */}



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
            placeholder={!isFocus ? 'Select Option' : '...'}
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
            <View style={{ marginBottom:20}}/>


            {id &&

              <>
              {/* <Text style={styles.label}>Buy {id} Pin</Text> */}

                  <Dropdown
                  style={[styles.dropdown, isEduFocus && { borderColor: 'blue' }]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={bouquest}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isEduFocus ? 'Select Scratch Card Plan' : '...'}
                  searchPlaceholder="Search..."
                  value={edu}
                  onFocus={() => setIsEduFocus(true)}
                  onBlur={() => setIsEduFocus(false)}
                  onChange={item => {
                      setEdu(item.value);
                      setIsEduFocus(false);
                      setPrice(item.price)
                  }} 
                  />
                  <View style={{ marginBottom:20}}/>  
              </>

              }

              {
              price &&
              <>
              <Text style={styles.label}>Price</Text>
              <Input placeholder={"Amount to fund with"} value={price} editable={false}/>
              </>
              }

              {/* <View style={{ marginBottom:20}}/> */}

              {edu && 
              <View style={{marginHorizontal:20, marginTop:20}}>
              <SubmitButton message={"Submit"} onPress={togglePinModal}/>
              </View>
              }
            </View>
          </>
        }
        



          <Modal isVisible={isModalVisble}>
            <SafeAreaView style={styles.centeredView}>

            <TouchableOpacity style={{justifyContent:'flex-end', alignSelf:'flex-end', marginBottom:5, }} onPress={() => [toggleModal(), navigation.goBack()]}>
              <MaterialIcons name="cancel" size={30} color="white" />
            </TouchableOpacity>

            <View style={styles.modalView}>
            <Image source={require("../assets/igoepp_transparent2.png")} style={{height:130, width:130, position:'absolute', alignContent:'center', alignSelf:'center', top:DIMENSION.HEIGHT * 0.1,justifyContent:'center', opacity:0.3, }} contentFit='contain'/>
              <Text style={styles.modalText}>Reciept</Text>
                {
                  Platform.OS === "android" ? 
                    <View style={{borderBottomWidth:0.5, marginTop:5, borderStyle:"dashed"}}/>
                  :
                   <View style={{borderBottomWidth:0.5, marginTop:5}}/>
                }
             
                  <View style={{marginBottom:25, marginTop:25}}>
                      
                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Ref :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{ref}</Text>
                      </View>

                       <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Amount Funded :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{price}</Text>
                      </View>


                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Waec Pin :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{pin}</Text>
                      </View> 

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Date :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{date} {time}</Text>
                      </View>

                       <View style={{flexDirection:'row', justifyContent:'space-evenly', alignItems:'center', marginTop: 20,}}>
                        
                          <TouchableOpacity style={{}} onPress={() => {}}>
                                <Text><Entypo name="forward" size={24} color="black" /></Text>
                          </TouchableOpacity>

                          <TouchableOpacity style={{}} onPress={() => [toggleModal(), navigation.goBack()]}>
                              <Text style={{}}>Close</Text>
                          </TouchableOpacity>
                        </View>
                    </View>              
            </View>
            </SafeAreaView>
          </Modal>

          
  <Modal isVisible={isSetpinModalVisible} animationInTiming={500}
      >
        <SafeAreaView style={styles.centeredView}>
        <TouchableOpacity style={{justifyContent:'flex-end', alignSelf:'flex-end', marginBottom:5, }} onPress={() => [togglePinModal(), setpinT()]}>
          <MaterialIcons name="cancel" size={30} color="white" />
        </TouchableOpacity>
          <View style={[styles.modalView, {width: DIMENSION.WIDTH * 0.7}]}>
            {
              ischecking ? 
              <View style={{flex:1, marginTop: 30, marginBottom: 70}}>
                <LoadingOverlay/>  
              </View>

              :
              <>
            <View>
            <Text style={[styles.modalText, {fontSize:14}]}>Enter Transaction Pin</Text>

            <SafeAreaView style={{justifyContent:'center', alignItems:'center', marginHorizontal:40}}>
              <TextInput
                keyboardType={"numeric"}
                maxLength={4}
                style={{fontSize:25, textAlign:'center',width:150, margin:5, borderBottomWidth:1, padding:5}}
                onChangeText={setpinT}
                value={pinT}
                isInvalid={pinvalid}
                onFocus={() => [setpinvalid(false), setPinerrorMessage('')]}
                secureTextEntry
              />
              {
                pinvalid &&
                <Text style={{fontSize:11, textAlign:'center', color:Color.tomato}}>Pin must be 4 characters</Text>
              }
              {
                pinerrormessage.length !== 0 && <Text  style={{fontSize:11, textAlign:'center', color:Color.tomato}}>{pinerrormessage}</Text>
              }
            </SafeAreaView>
            <View style={{marginBottom:'5%'}}/>
            </View>
            {/* <View style={styles.buttonView}> */}

            <View style={{flexDirection:'row', justifyContent:'center'}}>
              <TouchableOpacity style={styles.cancelbtn} onPress={() => pinT === null || pinT === undefined || pinT === "" || pinT.length < 4  ? setpinvalid(true) : [handleClick(), pinValidateCheck()]}>
                <Text style={styles.canceltxt}>Continue</Text>
              </TouchableOpacity>
            </View>             
              {/* </View> */}
            </>
          }
          </View>
          </SafeAreaView>
      </Modal>
    </ScrollView>
  )
}

export default Education

const styles = StyleSheet.create({
  educationtxt:{
    fontSize: 18,
    color: Color.darkolivegreen_100,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
    marginBottom:15,
  }, 
  image:{
    width: 60,
    height: 60,
    borderRadius:100,
    padding:10
  },
  dropdown: {
    maxHeight: 70,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    padding:10,
    // marginTop: 10,
    // paddingVertical:10
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  }, 
  dropdown: {
    maxHeight: 70,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    padding:8,
    // marginTop: 10,
    // paddingVertical:10
  },
  selectedTextStyle:{
    fontSize:12
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
    fontSize: 13,
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
  modalText: {
    // marginBottom: 15,
    textAlign: 'center',
    fontSize:18, 
    fontFamily:'poppinsRegular'
  },
  cancelbtn:{
    backgroundColor:Color.darkolivegreen_100,
    borderColor: Color.darkolivegreen_100,
    borderWidth: 1,
    justifyContent:'center',
    borderRadius: 3,
    width: DIMENSION.WIDTH * 0.36,
    padding: 5
  },
  canceltxt:{
    textAlign:'center',
    alignSelf:'center',
    fontFamily: 'poppinsMedium',
    fontSize: 12,
    color: Color.white
  },
})