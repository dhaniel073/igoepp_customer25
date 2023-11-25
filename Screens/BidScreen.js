import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, TextInput, Alert, Button } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { Border, Color, DIMENSION, marginStyle } from '../Component/Ui/GlobalStyle'
import GoBack from '../Component/Ui/GoBack'
import { AuthContext } from '../utils/AuthContext';
import { BidAccept, BidAcceptCash, BidDecline, BidNegotiate, BidRequests, SessionIDCheck } from '../utils/AuthRoute';
import LoadingOverlay from '../Component/Ui/LoadingOverlay';
import { Image, ImageBackground } from 'expo-image';
import {MaterialCommunityIcons} from "@expo/vector-icons"
import Modal from 'react-native-modal'
import Input from '../Component/Ui/Input';
import { Dropdown } from 'react-native-element-dropdown';
import * as Notification from 'expo-notifications'


const data = [
  { label: 'Cash ', value: 'C' },
  { label: 'Wallet ', value: 'W' },
];




const BidScreen = ({navigation, route}) => {
  const authCtx = useContext(AuthContext)
  const [bidRequest, setbidRequest] = useState([])
  const [isloading, setisloading] = useState(false)
  const bid_id = route?.params[0]?.bid_id
  const cat_name = route.params.cat_name
  const [isAcceptModalVisible, setAcceptModalVisible] = useState(false);
  const [isNegotiateModalVisible, setNegotiatetModalVisible] = useState(false);
  const [ Id, setId] = useState()
  const [budget, setbudget] = useState()
  const [budgetInvalid, setbudgetInvalid] = useState(false)
  const [paymentmethod, setPaymentMethod] = useState('')
  const [isFocus, setIsFocus] = useState(false);
  const [paymentmethodInvalid,setPaymentMethodInvalid] = useState(false)
  const maindate = new Date() 
  const date = maindate.toDateString()
  const [amount, setamount] = useState()
  const time = maindate.toLocaleTimeString()




  const fetchBidRequest = async() => {
    setisloading(true)
    const response = await BidRequests(bid_id, authCtx.token)
    console.log(response)
    setbidRequest(response)
    setisloading(false)
  }

  const unsubscribe = async () => {
    try {
    const response = await SessionIDCheck(authCtx.email, authCtx.token)
    console.log(response)
    authCtx.customerSessionId(response.login_session_id)
    } catch (error) {
    // console.log(error.response.data)
    }
  };

  useEffect(() => {
    navigation.addListener('focus', async() => {
      fetchBidRequest()
      unsubscribe()
    })
  }, [])


  
  const NoRequestNote = () => {
    return (
      <View style={{ justifyContent:'center', alignItems:'center',marginTop: DIMENSION.HEIGHT * 0.33 }}>
        <Text style={{ fontSize: 14, color: 'grey', fontFamily: 'poppinsSemiBold' }}>No Bids Made On Request</Text>
      </View>
    )
  }

  const toggleAcceptModal = (id, pricetag) => {
    setAcceptModalVisible(!isAcceptModalVisible)
    let sendId = id
    setId(sendId)
    let sendprice = pricetag
    setamount(sendprice)
    // setPrice(pricetag)
  }

  const toggleNegotiateModal = (id, ) => {
    let sendId = id
    setId(sendId)
    setNegotiatetModalVisible(!isNegotiateModalVisible)
  }


  const NegotiationSubmitHandler = async() => {
    const negotiationcheck = budget === null || budget === undefined || budget === "" || budget.length === 0
  
    if(negotiationcheck){
      setbudgetInvalid(negotiationcheck)
      console.log(negotiationcheck)
      console.log(budget)
      Alert.alert('Invalid Budget', 'Invalid Budget Amount')
    }else{
    try {
      setisloading(true)
      const response = await BidNegotiate(Id, budget, authCtx.token)
      setbudget(null)
      setisloading(false)
      Alert.alert('Successful', "Your negotiationahas been made successfully", [
        {
          text:"Ok",
          onPress: () => navigation.goBack()
        }
      ])
      } catch (error) {
        setisloading(true)
        //  console.log(error.response)
        Alert.alert('Error Occured', error.response.data.message, [
          {
            text: "Ok",
            onPress: () => navigation.goBack()
          }
        ])
        setisloading(false)
      }
    }
  }



  const DeclineHandler = async (id) => {
    // console.log(id)
    try {
      setisloading(true)
      const response = await BidDecline(id, authCtx.token)
      Alert.alert('Declined', 'Bid declined successful', [
        {
            text: 'Ok',
            onPress: () => navigation.goBack() ,
        }
      ])    
    } catch (error) {
      setisloading(true)
      Alert.alert('', 'An error occured', [
        {
          text: 'Ok',
          onPress: () => navigation.goBack() ,
        }
      ]) 
      setisloading(false)
    }
  }

  const AcceptBidHandler = async() => {
    if(!paymentmethod){
        Alert.alert('Payment Method', 'Select payment method to continue')
    }else{
    // console.log(paymentmethod)
    if(paymentmethod === 'C'){
      try {
        setisloading(true)
        const response = await BidAcceptCash(Id, paymentmethod, paymentmethod, authCtx.sessionid, authCtx.token)
        console.log(response)
        schedulePushNotification()
        Alert.alert('Successful', `You've accepted the bid with id ${Id}`, [
          {
            text:"Ok",
            onPress: () => navigation.goBack()
          }
        ])
        setPaymentMethod(null)
        setIsFocus(false)
        setisloading(false)
      } catch (error) {
        setisloading(true)
        console.log(error.response)
        Alert.alert('Error Occured', error.response.data.message)
        setisloading(false)
        setPaymentMethod(null)
        return;
      }
    }else{
      try {
        setisloading(true)
        const response = await BidAccept(Id, paymentmethod, paymentmethod, authCtx.sessionid, authCtx.token)
        console.log(response)
        schedulePushNotification()
        Alert.alert('Successful', `You've accepted the bid with id ${Id}`, [
          {
            text:"Ok",
            onPress: () => navigation.goBack()
          }
        ])
        setPaymentMethod(null)
        setIsFocus(false)
        setisloading(false)
      } catch (error) {
        setisloading(true)
        console.log(error.response)
        Alert.alert('Error Occured', error.response.data.message)
        setisloading(false)
        setPaymentMethod(null)
        return;

      }
    }
    }
  }

  async function schedulePushNotification(response) {
    const askPermision = Notification.requestPermissionsAsync()
    await Notification.scheduleNotificationAsync({
      content: {
      //   title: "You've got mail! 📬",
        title: `Bid Accepted 🔔`,
        body: `You successfully accepted the bid of id: ${Id}\nAmount: NGN${amount}\nDate: ${date} ${time}`,
        data: { data: 'goes here' },
      },
      trigger: { seconds: 2 },
    });
  }



  if(isloading){
    return <LoadingOverlay message={"..."}/>
  }
  return (
    <SafeAreaView style={{marginTop:marginStyle.marginTp, marginHorizontal: 10, flex:1}}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <Text style={styles.bidtxt}>BidScreen</Text>

      {bidRequest.length === 0 ? <NoRequestNote/> :
      <FlatList
        data={bidRequest}
        style={styles.flatlists}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => 
          <TouchableOpacity style={[styles.pressable]} onPress={() => navigation.navigate('HelperDetails', {
            helperId: item.helper_id
            })}>
              {/* <Button title='click' onPress={schedulePushNotification}/> */}
            <View style={{position:'absolute', left:'87%', top:20, justifyContent:'center', alignItems:'center'}}>
              <View style={{flexDirection:'row'}}>
                <Text>4.0</Text>
                <ImageBackground style={{  width: 18, height: 18 }} source={require("../assets/group-723.png")}/>
              </View>
              <Text style={{fontSize:12}}>Tap to view</Text>
            </View>
            <View style={{flexDirection:'row'}}>
                <Image source={require("../assets/person-4.png")} style={styles.image}/>
              <View style={{flexDirection:'row', marginTop:15}}>
                <Text style={{fontSize:16, color: Color.tomato, fontFamily: 'poppinsSemiBold'}}>{item.first_name}</Text>
                <Text style={{fontSize:16, color: Color.tomato, fontFamily: 'poppinsSemiBold'}}> {item.last_name}</Text>
              </View>
            </View>

            <View style={{position: 'absolute', top: '38%', left:'22.5%', backgroundColor:'white', paddingLeft:5, paddingRight:5, paddingTop:2, borderWidth:0.5, borderRadius:4, borderColor: Color.tomato }}>
              <Text style={{fontSize:12, color: Color.tomato, fontFamily: 'poppinsRegular'}}>{item.negotiable === "Y" ? "Negotiable" : "Non-Negotiable"}</Text>
            </View>
            
            <Text style={{fontSize:16, fontFamily:'poppinsSemiBold', alignSelf:'flex-start', marginLeft:60, marginBottom:10, color:Color.darkolivegreen_100}}>
              NGN {item.proposed_price}
            </Text>

            <View style={{flexDirection:'row', justifyContent:'space-evenly', alignItems:'center',  marginBottom:10}}>
            {
              item.negotiable === "Y" ?
              <TouchableOpacity style={styles.negotiatebtn} onPress={() => toggleNegotiateModal(item.id)}>
                <Text style={styles.negotiationtxt}>Negotiate</Text>
              </TouchableOpacity>
              :
              <TouchableOpacity style={styles.viewbtn} onPress={() => Alert.alert("", "Are you sure you want to decline bid", [
              {
                text: "No",
                onPress: () => {}
              },
              {
                text: "Yes",
                onPress: () => DeclineHandler(item.id)
              }
              ])}>
                  <Text style={styles.viewtext}>Cancel</Text>
              </TouchableOpacity>
            }

                
              <TouchableOpacity style={styles.cancelbtn} onPress={() =>  toggleAcceptModal(item.id, item.proposed_price)}>
                  <Text style={styles.canceltext}>Accept</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
            
      }
      />
    }
     <Modal
      isVisible={isNegotiateModalVisible}
      animationInTiming={500}>
        <SafeAreaView style={styles.centeredView}>
        
        <View style={styles.modalView}>
          <View>
          <Text style={styles.modalText}>Cancel Request</Text>

            <Input
              placeholder="Amount"
              onUpdateValue={setbudget}
              keyboardType="numeric"
              value={budget}
              isInvalid={budgetInvalid}
              style={{fontSize:14}}
              onFocus={() => setbudgetInvalid(false)}
            />
          <View style={{marginBottom:'2%'}}/>
          </View>
              
          {/* <View style={styles.buttonView}> */}
          <View style={{flexDirection:'row', justifyContent:'space-between', }}>
            <TouchableOpacity style={styles.viewbtn} onPress={() => [toggleNegotiateModal(), setbudget(null), setbudgetInvalid(false)]} >
                <Text style={styles.viewtext}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelbtn} onPress={() =>  [toggleNegotiateModal(), NegotiationSubmitHandler()]}>
              <Text style={styles.canceltext}>Negotiate</Text>
            </TouchableOpacity>
          </View>             
            {/* </View> */}
            <View style={{marginBottom:10}}/>
            </View>

        </SafeAreaView>
      </Modal>   

      <Modal isVisible={isAcceptModalVisible}>
        <SafeAreaView style={styles.centeredView}>

        <View style={styles.modalView}>
            <Text style={styles.modalText}>Accept Bid</Text>


            <Text style={styles.label}>Description</Text>
            <Dropdown
              style={[styles.dropdown, isFocus && { borderColor: 'blue' }, paymentmethodInvalid && styles.inputInvaliid]}
              placeholderStyle={styles.placeholderStyle}
              data={data}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'Select Payment Method' : '...'}
              searchPlaceholder="Search..."
              value={paymentmethod}
              onFocus={() => [setIsFocus(true), setPaymentMethodInvalid(false)]}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setPaymentMethod(item.value);
                setIsFocus(false);
              }}
            />
            {/* </SafeAreaView> */}
            <View style={{ marginBottom:20}}/>



            <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
              <TouchableOpacity style={styles.cancelbtn} onPress={() => [toggleAcceptModal(), setPaymentMethod(null)]} >
                <Text style={styles.canceltext}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.viewbtn} onPress={() => [!paymentmethod ? setPaymentMethodInvalid(true)   : [toggleAcceptModal(), AcceptBidHandler()]]}>
                <Text style={styles.viewtext}>Accept</Text>
              </TouchableOpacity>
            </View>
            <View style={{marginBottom:'2%'}}/>
        </View>
        
        </SafeAreaView>
      </Modal>
                 
    </SafeAreaView>
  )
}

export default BidScreen

const styles = StyleSheet.create({
  inputInvaliid:{
    backgroundColor: Color.error100
  },
  label: {
    color: 'black',
    marginBottom: 2,
    fontSize: 16,
    fontFamily: 'poppinsMedium'
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
  image:{
    width:60,
    height:60,
    marginTop: 10
  },
  bidtxt:{
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
    padding:15,
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
  negotiatebtn:{
    backgroundColor:Color.white,
    borderColor: Color.blueviolet,
    borderWidth: 1,
    justifyContent:'center',
    borderRadius: 3,
    width: DIMENSION.WIDTH * 0.36,
    padding: 5
  },
  negotiationtxt:{
    textAlign:'center',
    alignSelf:'center',
    fontFamily: 'poppinsMedium',
    fontSize: 12,
    color: Color.blueviolet
  },
  dropdown: {
    maxHeight: 70,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    padding:7,
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
  selectedTextStyle:{
    fontSize:12
  }
})

// <View style={{ flexDirection:'row', justifyContent:'space-between'}}>
// <Text style={styles.TitleName}>{cat_name}</Text>
//   <View>
//     <View style={{flexDirection: 'row' }}>
//       <Image style={{  width: 25, height: 25 }} source={require("../assets/group-723.png")}/>
//       <Text>4.0</Text>
//     </View>
//     <Text style={{fontSize:10}}>Tap to View</Text>

{/* <View style={{ flexDirection: 'row'}}>
                <Image style={{ height: 60, width:60, borderRadius:30 }} source={require("../assets/person-4.png")}/>
                    
              <View style={{ flexDirection: 'column' }}>
                <View style={{ marginLeft:10, flexDirection: 'row' }}>
                  <Text style={styles.bidName}>{item.first_name} </Text>
                  <Text style={styles.bidName}> {item.last_name}</Text>

                </View>
              <View style={{ position:'absolute', top: 30, left: 10}}>
                <Text style={styles.textAmount}>NGN {item.proposed_price} </Text>
                <View style={styles.negotiablePanel}>
                  <Text style={styles.negotiableText}>{item.negotiable === 'N' ? 'Non-Negotiable' : 'Negotiable'}</Text>
                </View>
              </View>
            </View>
          </View>
          
          <View style={{flexDirection:'row', justifyContent:'space-between', width:DIMENSION.WIDTH * 0.85, top:5}}>
                            
          {item.negotiable === 'Y' ?
            <TouchableOpacity onPress={() => [toggleNegotiateModal(item.id)]} style={styles.negotiatebtn}>
                <Text style={styles.negotiationtxt}>Negotiate</Text>
            </TouchableOpacity>

          :
            <TouchableOpacity onPress={() => [DeclineHandler(item.id)]} style={{ margin:10, padding:5, borderRadius: 3, borderWidth: 1, borderColor:Color.firebrick_100, backgroundColor: 'white'   }}>
              <View style={{ paddingLeft: 35, paddingRight: 35 }}>
                <Text style={{ fontFamily: 'poppinsSemiBold', color:Color.firebrick_100 }}>Decline</Text>
              </View>
            </TouchableOpacity>
          }
          <TouchableOpacity onPress={() => toggleAcceptModal(item.id, item.proposed_price)} style={styles.cancelbtn}>
              <Text style={styles.canceltext}>Accept Bid</Text>
          </TouchableOpacity>
          
          </View> */}

//   </View>
// </View>
