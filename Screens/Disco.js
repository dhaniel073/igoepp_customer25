import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, SafeAreaView, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Color, DIMENSION, marginStyle } from '../Component/Ui/GlobalStyle'
import GoBack from '../Component/Ui/GoBack'
import axios from 'axios'
import { Image, ImageBackground } from 'expo-image'
import { Dropdown } from 'react-native-element-dropdown'
import SubmitButton from '../Component/Ui/SubmitButton'
import Input from '../Component/Ui/Input'
import {MaterialIcons, MaterialCommunityIcons, Entypo} from '@expo/vector-icons' 
import * as Notifications from 'expo-notifications'
import { DiscoPayment, ValidateDisco } from '../utils/AuthRoute'
import { AuthContext } from '../utils/AuthContext'
import Modal from 'react-native-modal'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'


const Disco = ({route, navigation}) => {
  const [category, setcategory] = useState([])
  const [isLoading, setisLoading] = useState(false)
  const [isFocus, setisFocus] = useState(false)
  const [id, setid] = useState()
  const authCtx = useContext(AuthContext)
  const [isModalVisble, setIsModalVisible] = useState(false)
  const [isConfirmModalVisble, setIsConfirmModalVisible] = useState(false)
  const [amount, setAmount] = useState()
  const [username, setUserName] = useState()
  const [useraddress, setUserAddress] = useState()
  const [token, setToken] = useState()
  const [ref, setRef] = useState()
  const [meterno, setMeterNo] = useState()
  const authId = route?.params?.id

  const maindate = new Date() 
  const date = maindate.toDateString()
  const time = maindate.toLocaleTimeString()
  const amountCheck = amount >= 1000

  useEffect(() => {
    setisLoading(true)
    const url = `https://phixotech.com/igoepp/public/api/auth/billpayment/getAllBillersByCategory/${authId}`
    const response = axios.get(url, {
        headers:{
            Accept:'application/json',
            Authorization: `Bearer ${authCtx.token}`
        }
    }).then((res) => {
        // console.log(res.data)dx
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

  const updatehandleValue = (inputType, enteredValue) => {
    switch (inputType) {
      case 'meterno':
        setMeterNo(enteredValue)
        break;
      case 'amount':
        setAmount(enteredValue)
        break;
    
    }
  }

  
  const toggleConfirmModal =  () => {
    setIsConfirmModalVisible(!isConfirmModalVisble)
  }

  const toggleModal =  () => {
    setIsModalVisible(!isModalVisble)
  }

  const validatehandle = async () => {
    // console.log(meterno, amount, id)
    try {
      setisLoading(true)
      const response = await ValidateDisco(authCtx.Id, id, meterno, authCtx.token)
      // console.log(response.data)
      if(response.data.status === 'Success'){
        setRef(response.data.requestID)
        setUserAddress(response.data.customerAddress)
        setUserName(response.data.customerName)
        toggleConfirmModal()
      }else{
        Alert.alert("Error", "An error occured while validating meter no. Please  check your meter no and try again later", [
          {
              text: "Ok",
              onPress: () => navigation.goBack()
          },
        ])
      }
    setisLoading(false)
    } catch (error) {
      setisLoading(true)
      Alert.alert("Sorry", "An error occured try again later", [
        {
          text:"Ok",
          onPress: () => navigation.goBack()
        }
      ])
      setisLoading(false)
      return;
      // console.log(error)
    }
  }

  const makePayment = async () => {
    try {
        setisLoading(true)
        const response = await DiscoPayment(ref, amount, authCtx.token)
        // console.log(response)
        if(response.message === "failed"){
          Alert.alert(response.message, response.description + ", fund wallet and try again", [
            {
              text:"Ok",
              onPress:() => navigation.goBack()
            }
          ])
        }else{
          // console.log(response)
          schedulePushNotification(response)
          setToken(response.token)
          // setRef(response.requestID)
          toggleModal()
        }
       
        setisLoading(false)
    } catch (error) {
      // console.log(error.response.data)
      setisLoading(true)
      Alert.alert("Sorry", "An error occured try again later", [
        {
          text:"Ok",
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
        title: `Electricity Bill 🔔`,
        body: `${response.message}.\nElectricity Token:${response.token}\nRef:${response.requestID}\nAmount:${amount}\nDate: ${date} ${time}`,
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
      <Text style={styles.discotxt}>Disco</Text>

      <ImageBackground>
        <View style={{flexDirection:'row', justifyContent:'space-evenly', alignItems:'center', }}>
        <Image contentFit='contain' source={require("../assets/eedcc.png")} style={[styles.image]}/>
        <Image contentFit='contain' source={require("../assets/ekedc.jpg")} style={styles.image}/>
        <Image contentFit='contain' source={require("../assets/ibedc1.jpg")} style={[styles.image, ]}/>
        <Image contentFit='contain' source={require("../assets/kedco.jpg")} style={[styles.image]}/>
        <Image contentFit='contain' source={require("../assets/phedc.jpg")} style={[styles.image, {position:'absolute',  left:'40%', top:"70%" }]}/>
        </View>
      </ImageBackground>

      <View style={{marginTop:35}}/>
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
            placeholder={!isFocus ? 'Select Distribution Company' : '...'}
            searchPlaceholder="Search..."
            value={id}
            onFocus={() => setisFocus(true)}
            onBlur={() => setisFocus(false)}
            onChange={item => {
                setid(item.value);
                setisFocus(false);
            }}
            />
            <View style={{ marginBottom:20}}/>

            {id && 
              <>
                <Text style={styles.label}>Meter No</Text>
                <Input placeholder={"Enter Meter No"} value={meterno} keyboardType={"numeric"}  onUpdateValue={updatehandleValue.bind(this, 'meterno')}/>
              </>

            }

            {meterno && 
              <>
                <View style={{ marginBottom:10}}/>

                <Text style={styles.label}>Amount to recharge</Text>
                <Input placeholder={"Amount to fund with"} value={amount} keyboardType={"numeric"} onUpdateValue={updatehandleValue.bind(this, 'amount')}/>
                
                {!amountCheck && 
                   <Text style={{marginBottom:20, color:'red'}}>Amount must be <MaterialCommunityIcons name="currency-ngn" size={14} />1000 and above</Text>
                }
                <View style={{ marginBottom:20}}/>
              </>
            }
             {!meterno || amountCheck &&
              <>
                <View style={{marginHorizontal:20, marginTop:20}}>
                    <SubmitButton message={"Submit"} onPress={validatehandle}/>
                </View>
              </>
            
            }
          </View>

        <Modal isVisible={isConfirmModalVisble}>
            <SafeAreaView style={styles.centeredView}>

            <TouchableOpacity style={{justifyContent:'flex-end', alignSelf:'flex-end', marginBottom:5, }} onPress={() => [toggleConfirmModal(), navigation.goBack()]}>
              <MaterialIcons name="cancel" size={30} color="white" />
            </TouchableOpacity>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Confirm Payment</Text>
                {/* <Text style={{fontFamily:'poppinsRegular'}}>-------------------------------------------</Text> */}

                  <View style={{marginBottom:10, marginTop:10}}>
                      
                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular',  fontSize:10}}>Meter No :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{meterno}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>User Name :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{username}</Text>
                      </View> 

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <View>
                          <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>User Address :</Text>
                        </View>
                        <View style={{maxWidth:DIMENSION.WIDTH * 0.6, }}>
                          <Text  style={{fontFamily:'poppinsRegular', textAlign:'right', fontSize:10}}>{useraddress}</Text>
                        </View>
                      </View> 

                       <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Amount :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{amount}</Text>
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
                        
                        <TouchableOpacity style={styles.viewbtn} onPress={() => toggleConfirmModal()}>
                              <Text style={styles.viewtext}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cancelbtn} onPress={() => [toggleConfirmModal(), makePayment()]}>
                            <Text style={styles.canceltext}>Confirm</Text>
                        </TouchableOpacity>
                      </View>
                   
                        
                    </View>              
            </View>
            </SafeAreaView>
          </Modal>

        <Modal isVisible={isModalVisble}>
            <SafeAreaView style={styles.centeredView}>

            <TouchableOpacity style={{justifyContent:'flex-end', alignSelf:'flex-end', marginBottom:5, }} onPress={() => [toggleModal(), navigation.goBack()]}>
              <MaterialIcons name="cancel" size={30} color="white" />
            </TouchableOpacity>
            <View style={styles.modalView}>
            <Image source={require("../assets/igoepp_transparent2.png")} style={{height:130, width:130, position:'absolute', alignContent:'center', alignSelf:'center', top:DIMENSION.HEIGHT * 0.141,justifyContent:'center', opacity:0.3, }} contentFit='contain'/>
              <Text style={styles.modalText}>Reciept</Text>
                {/* <Text style={{fontFamily:'poppinsRegular'}}>-------------------------------------------</Text> */}

                {
                  Platform.OS === "android" ? 
                    <View style={{borderBottomWidth:0.5, marginTop:5, borderStyle:"dashed"}}/>
                  :
                   <View style={{borderBottomWidth:0.5, marginTop:5}}/>
                }
                
                
                  <View style={{marginBottom:25, marginTop:15}}>
                        
                      
                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Meter No :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{meterno}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Distribution Company :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{id}</Text>
                      </View> 

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>User Name :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{username}</Text>
                      </View> 

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <View>
                          <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>User Address :</Text>
                        </View>
                        <View style={{maxWidth:DIMENSION.WIDTH * 0.6, }}>
                          <Text  style={{fontFamily:'poppinsRegular', textAlign:'right', fontSize:10}}>{useraddress}</Text>
                        </View>
                      </View> 

                       <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Amount Funded :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{amount}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Ref :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{ref}</Text>
                      </View> 

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Token :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{token}</Text>
                      </View> 

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Date :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{date} {time}</Text>
                      </View>

                       {/* <View style={{flexDirection:'row', justifyContent:'space-evenly', alignItems:'center', marginTop: 20,}}>
                        
                          <TouchableOpacity style={styles.cancelbtn} onPress={() => {}}>
                                <Text><Entypo name="share" size={24} color="black" /></Text>
                          </TouchableOpacity>

                          <TouchableOpacity style={styles.viewbtn} onPress={() => [toggleBidModal(), navigation.goBack()]}>
                              <Text style={styles.viewtext}>Back</Text>
                          </TouchableOpacity>
                          
                        </View> 
                        */}
                        <View style={{flexDirection:'row', justifyContent:'space-evenly', alignItems:'center', marginTop: 20,}}>
                        
                        <TouchableOpacity style={styles.sharebtn} onPress={() => {}}>
                              <Text><Entypo name="forward" size={24} color="black" /></Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.sharebtn} onPress={() => [toggleModal(), navigation.goBack()]}>
                            <Text>Close</Text>
                        </TouchableOpacity>
                      </View>
                   
                        
                    </View>              
            </View>
            </SafeAreaView>
          </Modal>


    </ScrollView>
  )
}

export default Disco

const styles = StyleSheet.create({
  image:{
    width: 60,
    height: 60,
    borderRadius:100,
  },
  sharebtn:{
    justifyContent:'center',
    alignItems:'center',
    borderRadius: 3,
    width: DIMENSION.WIDTH * 0.36,
    padding: 5
  },

  viewbtn:{
    backgroundColor:Color.white,
    borderColor: Color.brown,
    borderWidth: 1,
    justifyContent:'center',
    borderRadius: 3,
    width: DIMENSION.WIDTH * 0.36,
    padding: 5
  },
  viewtext:{
    textAlign:'center',
    alignSelf:'center',
    fontFamily: 'poppinsMedium',
    fontSize: 12,
    color: Color.brown
  },
  cancelbtn: {
    backgroundColor: Color.darkolivegreen_100,
    borderRadius: 3,
    justifyContent:'center',
    width: DIMENSION.WIDTH * 0.36,
    padding: 5
  },
  canceltext:{
    fontFamily: 'poppinsMedium',
    fontSize: 12,
    color: Color.white,
    textAlign: "center",
  },
  selectedTextStyle:{
    fontSize:12
  },
  discotxt:{
    fontSize: 18,
    color: Color.darkolivegreen_100,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
    marginBottom:15,
  }, 
  dropdown: {
    maxHeight: 100,
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
  placeholderStyle: {
    fontSize: 12,
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
    padding: 20,
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