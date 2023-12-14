import { Alert, FlatList, Linking, Pressable, RefreshControl, TextInput, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { Border, Color, DIMENSION, marginStyle } from '../Component/Ui/GlobalStyle'
import GoBack from '../Component/Ui/GoBack'
import { AuthContext } from '../utils/AuthContext'
import { CancelRequests, CustomerNotSatisfied, CustomerSatisfied, DisputeLog, HelpersUrl, ShowFetchedRequests, ShowFetchedRequestsById, WalletBalance } from '../utils/AuthRoute'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'
import { ImageBackground, Image } from 'expo-image'
import {Ionicons, Entypo, Feather, MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons'
import Modal from 'react-native-modal'
import Input from '../Component/Ui/Input'
import { Dropdown } from 'react-native-element-dropdown'

const data = [
  { label: 'Yes', value: 'Y' },
  { label: 'No', value: 'N' },
];


const Requests = ({navigation}) => {
  const authCtx = useContext(AuthContext)
  const [fetchedRequest, setFetchedRequest] = useState([])
  const [request, setrequest] = useState([])
  const [isFetching, setIsFetching] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [ismodalVisible, setismodalVisible] = useState(false)
  const [iscancelmodalVisible, setiscancelmodalVisible] = useState(false)
  const [isdisputemodalvisible, setisdisputemodalvisible] = useState(false)
  const [issatisfiedmodalvisible, setissatisfiedmodalvisible] = useState(false)
  const [dispute, setDispute] = useState()
  const [reason, setReason] = useState()
  const [Id, setId] = useState()
  const [reasonInvalid, setreasonInvalid] = useState(false)
  const [disputInvalid, setdisputInvalid] = useState(false)
  const [notsatifiedreason, setNotSatisfiedReason] = useState()
  const [isSatisfiedFocus, setIsSatisfiedFocus] = useState(false);
  const [satifiedtype, setSatifiedType] = useState()
  const [satid, setSatId] = useState();
  const [disid, setDisId] = useState();









  useLayoutEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        setIsFetching(true)
        const response = await ShowFetchedRequests(authCtx.Id , authCtx.token)
        // console.log(response)
        setFetchedRequest(response)
        setIsFetching(false)
      } catch (error) {
        return;
      }
    })
    return unsubscribe;
  }, []);


  useEffect(() => { 
    const WalletCheck = navigation.addListener('focus', async () => {
      try {
        const response =  await WalletBalance(authCtx.Id, authCtx.token)
        authCtx.customerBalance(response.wallet_balance)
      } catch (error) {
        return;
      }
    })
    return WalletCheck;
  }, [])



  

  
  const pullMe = () => {
      setRefresh(true)
      setTimeout(async() => {
      const response = await ShowFetchedRequests(authCtx.Id, authCtx.token)
      setFetchedRequest(response)
      setRefresh(false)
    }, 4000)
  }

  const pullme1 = async () => {
    try {
      setIsFetching(true)
      const response = await ShowFetchedRequests(authCtx.Id, authCtx.token)
      setFetchedRequest(response)
      setIsFetching(false)
    } catch (error) {
      setIsFetching(true)
      setIsFetching(false)
    }
}

  const FetchViewHistory = async (id) => {
    try {
      setIsLoading(true)
      const response = await ShowFetchedRequestsById(id, authCtx.token)
      setrequest(response)
      setIsLoading(false)
    } catch (error) {
      return;
    }
  }

  
  
  const Phonecall = (phone) => {
    Linking.openURL(`tel:${phone}`)
  }
  
  const HelperDetails = async(id) => {
    try {
      const response = await HelpersUrl(id, authCtx.token)
      Phonecall(response.phone)
    } catch (error) {
      return;
    }
  }
  
  const toggleModal = () => {
    setismodalVisible(!ismodalVisible)
  }

  const toggleCancelModal = (id) => {
    let sendId = id
    setId(sendId)
    setiscancelmodalVisible(!iscancelmodalVisible) 
  }

  const toggleDisputeModal = (value) => {
    let sendId = value
    setDisId(sendId)
    setisdisputemodalvisible(!isdisputemodalvisible)
  }

  const toggleSatisfiedModal = (value) => {
    let sendId = value
    setSatId(value)
    setissatisfiedmodalvisible(!issatisfiedmodalvisible)
  }

  const reasonValidate = () => {
    const reasoncheck = reason === null || reason === undefined || reason === "" || reason.length === 0
    if(reasoncheck){
      setreasonInvalid(true)

    }else{
      CancelHandlerSubmit()
    }
  }

  const CancelHandlerSubmit = async () => {
    toggleCancelModal()
    try {
      setIsFetching(true)
      const response = await CancelRequests(Id, authCtx.token, reason)
      setReason(null)
      Alert.alert("Successful", "Your request has been cancelled successfully", [
        {
          text:'Ok',
          onPress: () => pullme1()
        }
      ])
      setIsFetching(false)
    } catch (error) {
      setIsFetching(true)
      setReason(null)
      Alert.alert("Error", "An Error occured while cancelling request. Please try again later", [
        {
          text:'Ok',
          onPress: () => {}
        }
      ])
      setIsFetching(false)
    }
    
  }

  const Satisfied = async () => {
    if(satifiedtype === "Y"){
      try {
        setIsFetching(true)
        const response = await CustomerSatisfied(satid, authCtx.token)
        setSatifiedType(null)
        Alert.alert('', `Your successfully satisfied the request with id ${satid}`, [
          {
            text: "OK",
            onPress: () => pullme1()
          }
        ])
        setSatifiedType()
        setNotSatisfiedReason()
        setIsFetching(false)
      } catch (error) {
        setIsFetching(true)
        setIsFetching(false)
      }
    }else if (satifiedtype === "N"){
      if(notsatifiedreason === null || notsatifiedreason === "" || notsatifiedreason === undefined){
        setSatifiedType()
          Alert.alert("Empty Field", "Fill all fields to continue", [
            {
              text: "Ok",
              onPress: () => {}
            }
          ])
      }else{
        try {
          setIsFetching(true)
          const response = await CustomerNotSatisfied(satid, notsatifiedreason, authCtx.token)
          setSatifiedType(null)
          setNotSatisfiedReason(null)
          Alert.alert('', `Your successfully dissatisfied the request with id ${satid}`, [
            {
              text: "OK",
              onPress: () => pullme1()
            }
          ])
          setIsFetching(false)
        } catch (error) {
          setIsFetching(true)
          setIsFetching(false)
        }
      }
    }
  }

  const DisputeHandler = async () => {
    try {
      setIsFetching(true)
      const response = await DisputeLog(disid, dispute, authCtx.token)
      Alert.alert('Successful', 'Your dispute has been made successfully', [
        {
          text: "OK",
          onPress: () => pullme1()
        }
      ])
      setDispute()
      setIsFetching(true)
    } catch (error) {
      setIsFetching(true)
      Alert.alert('', error.response.data.message, [
        {
          text: "OK",
          onPress: () => navigation.goBack()
        }
      ])
      setIsFetching(false)
    }
  }
  
  
  const NoSubCategoryNote = () => {
    return (
      <View style={{ justifyContent:'center', alignItems:'center', marginTop: DIMENSION.HEIGHT * 0.33 }}>
        <Text style={{ fontSize: 14, color: 'grey', fontFamily: 'poppinsSemiBold' }}>No Request Made</Text>
        <TouchableOpacity onPress={()=> navigation.navigate('RequestHelp')}>
        <Text style={{  fontSize: 14, color:Color.limegreen, fontFamily: 'poppinsSemiBold'  }}>Make Request</Text>
        </TouchableOpacity>
      </View>
    )
  }
      

  if(isFetching){
    return <LoadingOverlay message={"..."}/>
  }

  return (
    <SafeAreaView style={{marginTop: marginStyle.marginTp, marginHorizontal:10, flex:1}}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <Text style={styles.requeststxt}>Requests</Text>


    {fetchedRequest.length === 0 ? <NoSubCategoryNote/> : 
      <FlatList
          data={fetchedRequest}
          style={{marginBottom:5}}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={() => {pullMe()}}
            />
          }
          keyExtractor={(item) => item.id}
          renderItem={({item}) => 
            <View style={styles.container}>
                {
                    item.help_status === 'N' ? 
                  <>
                  {/* Negotiating buttons */}
                  <Text style={{marginLeft:10, fontFamily:'poppinsRegular', fontSize:14}}>{item.created_at}</Text>
                  <Pressable style={styles.pressable}>
                    <View style={{flexDirection:'row'}}>
                      <Text style={styles.requestName}>{item.cat_name}</Text>
                      <Text style={{fontSize:12, top:3}}> (RID:{item.id}) {item.help_status}</Text>
                    </View>
                    <View style={{flexDirection:'row', justifyContent:'space-between', width:DIMENSION.WIDTH * 0.85, top:5}}>
                      <Text style={{fontFamily:'poppinsMedium', color: Color.saddlebrown_200, fontSize:10}}>
                      <Ionicons name="location" size={14} color="tomato" />
                        {item.help_lga} {item.help_state} { item.help_country} </Text>
                    </View>
                                    
                    <TouchableOpacity style={{position:'absolute', left:'85%', top:'20%'}} onPress={() => navigation.navigate("BidScreen", [
                      {
                        cat_name: item.cat_name,
                        bid_id: item.id
                      }
                    ])}>
                        <Image contentFit='contain' style={{width: 35, height:35, borderRadius:20, borderColor: 'red', borderWidth: 1, marginRight:28}}  source={require("../assets/gavel_5741343.png")}/>
                    </TouchableOpacity>

                    {/* bid count number */}
                    {item.bid_count === 0 ? null :
                    <View style={{ flexDirection:'row', position:'absolute', alignSelf:'flex-end', right:17, top:20 }}>
                      <ImageBackground  source={require("../assets/ellipse-127.png")} contentFit="contain" style={{height:15, width:15, justifyContent:'center', marginRight:5, marginTop:-4}}>
                        <Text style={{ fontSize: 8,  color: Color.white, fontFamily:'poppinsBold', textAlign:'center'}}>{item.bid_count}</Text>
                      </ImageBackground>
                    </View>
                    }

                    <View style={{flexDirection:'row', justifyContent:'space-evenly', alignItems:'center', marginTop: 15, marginBottom:10}}>
                    <TouchableOpacity style={styles.cancelbtn} onPress={() =>  [toggleModal(), FetchViewHistory(item.id)]}>
                        <Text style={styles.canceltext}>View Request</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.viewbtn} onPress={() => [toggleCancelModal(item.id)]}>
                        <Text style={styles.viewtext}>Cancel</Text>
                    </TouchableOpacity>
                    </View>
                  </Pressable>
                  </>
                  : item.help_status === "A" ?
                  <>
                  {/* Approved buttons */}
                  <Text style={{marginLeft:10, fontFamily:'poppinsRegular', fontSize:14}}>{item.created_at}</Text>
                  <Pressable style={styles.pressable}>
                    <View style={{flexDirection:'row'}}>
                      <Text style={styles.requestName}>{item.cat_name}</Text>
                      <Text style={{fontSize:12, top:3}}> (RID:{item.id})</Text>
                    </View>
                    <View style={{flexDirection:'row', justifyContent:'space-between', width:DIMENSION.WIDTH * 0.85, top:5}}>
                      <Text style={{fontFamily:'poppinsMedium', color: Color.saddlebrown_200, fontSize:10}}>
                      <Ionicons name="location" size={14} color="tomato" />
                        {item.help_lga} {item.help_state} { item.help_country} </Text>
                    </View>
                                    
                    <View style={{position:'absolute', padding:5, left:'80%', top:'17%', flexDirection:'row'}}>

                      {/* phone */}
                      <TouchableOpacity style={{top:5}}  onPress={()=> {HelperDetails(item.assigned_helper)}}>
                        <Feather name="phone-call" size={20} color={Color.limegreen} />
                      </TouchableOpacity>

                        {/* //chat */}
                      <TouchableOpacity style={{paddingLeft:5}} onPress={() => navigation.navigate('ChatScreen', {
                          helperId: item.assigned_helper,
                          bid_id: item.id
                        })}>
                        <Ionicons name="chatbubbles" size={24} color={Color.limegreen} />
                          { item.chat_unread_customer === 0  ? null :
                            <ImageBackground  source={require("../assets/ellipse-127.png")} contentFit="contain" style={{height:15, width:15, justifyContent:'center', position: 'absolute', marginLeft:23, marginTop:-4}}>
                              <Text style={{ fontSize: 8,  color: Color.white, fontFamily:'poppinsBold', textAlign:'center'}}>{item.chat_unread_customer}</Text>
                            </ImageBackground>
                          }
                        </TouchableOpacity>

                    </View>
                    

                    <View style={{flexDirection:'row', justifyContent:'space-evenly', alignItems:'center', marginTop: 15, marginBottom:10}}>
                      <TouchableOpacity style={styles.cancelbtn} onPress={() =>  [toggleModal(), FetchViewHistory(item.id)]}>
                        <Text style={styles.canceltext}>View Request</Text>
                      </TouchableOpacity>
                      {
                        item.start_request_time === null ? 
                        <TouchableOpacity style={styles.viewbtn} onPress={() => [toggleDisputeModal(item.id)]}>
                          <Text style={styles.viewtext}>Dispute ({item.dispute_count})</Text>
                        </TouchableOpacity>
                        : 
                        <TouchableOpacity>
                          <Text style={styles.viewtext}>Service in progress </Text>
                        </TouchableOpacity>
                      }
                    </View>
                  </Pressable>
                  </>

                  : item.help_status === "C" ?
                  <>
                  {/* cancelled buttons */}
                  <Text style={{marginLeft:10, fontFamily:'poppinsRegular', fontSize:14}}>{item.created_at}</Text>
                  <Pressable style={styles.pressable}>
                    <View style={{flexDirection:'row'}}>
                      <Text style={styles.requestName}>{item.cat_name}</Text>
                      <Text style={{fontSize:12, top:3}}> (RID:{item.id}) </Text>
                    </View>

                      <View style={{flexDirection:'row', justifyContent:'space-between', width:DIMENSION.WIDTH * 0.85, top:10}}>
                        <Text style={{fontFamily:'poppinsMedium', color: Color.saddlebrown_200, fontSize:10}}>
                        <Ionicons name="location" size={14} color="tomato" />
                          {item.help_lga} {item.help_state} { item.help_country} </Text>
                      </View>
                      <View style={{marginBottom:10}}/>
                      {
                        item.customer_statisfy === null &&
                        <View style={{position:'absolute', padding:5, left:'83%', top:'35%', flexDirection:'row'}}>

                        {/* phone */}
                        <TouchableOpacity style={{top:5}}  onPress={()=> {HelperDetails(item.assigned_helper)}}>
                          <Feather name="phone-call" size={20} color={Color.limegreen} />
                        </TouchableOpacity>
  
                          {/* //chat */}
                        <TouchableOpacity style={{paddingLeft:5}} onPress={() => navigation.navigate('ChatScreen', {
                            helperId: item.assigned_helper,
                            bid_id: item.id
                          })}>
                          <Ionicons name="chatbubbles" size={24} color={Color.limegreen} />
                            { item.chat_unread_customer === 0  ? null :
                              <ImageBackground  source={require("../assets/ellipse-127.png")} contentFit="contain" style={{height:15, width:15, justifyContent:'center', position: 'absolute', marginLeft:20, marginTop:-4}}>
                                <Text style={{ fontSize: 8,  color: Color.white, fontFamily:'poppinsBold', textAlign:'center'}}>{item.chat_unread_customer}</Text>
                              </ImageBackground>
                            }
                          </TouchableOpacity>
  
                      </View>
                      }

                    <View style={{position:'absolute', padding:5, left:'80%', top:'15%', flexDirection:'row'}}>
                      <Text style={{ fontFamily: 'poppinsBold', color: Color.brown, fontSize:11 }}>Completed</Text>
                    </View>

                    <View style={{flexDirection:'row',   marginTop: 15, marginBottom:10, justifyContent:'space-evenly'}}>   

                      <TouchableOpacity style={styles.cancelbtn} onPress={() =>  [toggleModal(), FetchViewHistory(item.id)]}>
                        <Text style={styles.canceltext}>View Request</Text>
                      </TouchableOpacity> 

                      {
                        item.customer_statisfy === null ?
                       
                        <TouchableOpacity style={styles.viewbtn} onPress={() =>  toggleSatisfiedModal(item.id)}>
                          <Text style={styles.viewtext}>Satisfied</Text>
                        </TouchableOpacity> 
                       
                        :
                        <>
                        {item.helper_rating === null && item.helper_rating_detail === null ? 
                            <TouchableOpacity style={styles.viewbtn} onPress={() =>  navigation.navigate('CustomerRating', 
                              {
                                helperid: item.assigned_helper,
                                id: item.id,
                                date: item.help_date
                              }
                            )}>
                              <Text style={styles.viewtext}>Rate Helper</Text>
                            </TouchableOpacity>  
                          :
                          <TouchableOpacity>
                            <Text style={styles.viewtext}>Service completed</Text>
                          </TouchableOpacity>  
                        }
                        </>
                      }

                      
                    </View>
                  </Pressable>
                  </>
                : 
                <>
                {/* cancelled buttons */}
                <Text style={{marginLeft:10, fontFamily:'poppinsRegular', fontSize:14}}>{item.created_at}</Text>
                  <Pressable style={styles.pressable}>
                    <View style={{flexDirection:'row'}}>
                      <Text style={styles.requestName}>{item.cat_name}</Text>
                      <Text style={{fontSize:12, top:3}}> (RID:{item.id}) </Text>
                    </View>
                    <View style={{flexDirection:'row', justifyContent:'space-between', width:DIMENSION.WIDTH * 0.85, top:5}}>
                      <Text style={{fontFamily:'poppinsMedium', color: Color.saddlebrown_200, fontSize:10}}>
                      <Ionicons name="location" size={14} color="tomato" />
                        {item.help_lga} {item.help_state} { item.help_country} </Text>
                    </View>

                    <View style={{position:'absolute', padding:5, left:'80%', top:'17%', flexDirection:'row'}}>
                    <Text style={{ fontFamily: 'poppinsBold', color: Color.brown, fontSize:11 }}>Cancelled</Text>
                    </View>

                    <View style={{flexDirection:'row', marginLeft:20,  marginTop: 15, marginBottom:10}}>                    
                    <TouchableOpacity style={styles.cancelbtn} onPress={() =>  [toggleModal(), FetchViewHistory(item.id)]}>
                        <Text style={styles.canceltext}>View Request</Text>
                    </TouchableOpacity>
                    </View>
                  </Pressable>
                </>

                }
            </View>
          }
        /> 
        }

        <Modal isVisible={ismodalVisible}>
            <SafeAreaView style={styles.centeredView}>

           
            <TouchableOpacity style={{justifyContent:'flex-end', alignSelf:'flex-end', marginBottom:5, }} onPress={() => toggleModal()}>
              <MaterialIcons name="cancel" size={30} color="white" />
            </TouchableOpacity>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Details</Text>

                {isLoading ? <LoadingOverlay/> : 
                <FlatList
                  data={request}
                  keyExtractor={(item) => item.id}
                  renderItem={({item}) => (
                    <View>
                       {
                          Platform.OS === 'android' ?
                            <Image source={require("../assets/igoepp_transparent2.png")} style={{height:130, width:130, position:'absolute', alignContent:'center', alignSelf:'center', top:DIMENSION.HEIGHT * 0.1,justifyContent:'center', opacity:0.3, }} contentFit='contain'/>
                          :
                          <Image source={require("../assets/igoepp_transparent2.png")} style={{height:130, width:130, position:'absolute', alignContent:'center', alignSelf:'center', top:DIMENSION.HEIGHT * 0.05,justifyContent:'center', opacity:0.3, }} contentFit='contain'/>
                        }

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Price : </Text>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.agreed_price === null ? '0.00' : item.agreed_price}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row',  alignItems:'center', }}>
                        <Text style={{marginRight: 20, marginBottom:5, fontSize:11}}>Description :</Text>
                        <Text style={{fontFamily:'poppinsRegular', maxWidth:'70%', textAlign:'right', fontSize:11}}>{item.help_desc}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Help Intervals :</Text>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.help_frequency}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Landmark :</Text>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.help_landmark}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Request Type :</Text>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.preassessment_flg === "N" ? "Normal Request" : "Preassessment Request"}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Address :</Text>
                        <Text style={{fontFamily:'poppinsRegular', maxWidth:'80%', fontSize:11}}>{item.help_location}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Country :</Text>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.help_country}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>State :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.help_state}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>L.G.A :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.help_lga}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Help Size :</Text>
                        <Text  style={{fontFamily:'poppinsRegular',fontSize:11}}>{item.help_size}</Text>
                      </View>
                      
                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular',  fontSize:11}}>Landmark :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.help_landmark}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Status :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.help_status === "A" ? "Active" : item.help_status === "N" ? "Negotiating" : item.help_status === "C" ? "Completed" : "Cancelled"}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Date :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.help_date}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Time :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.help_time}</Text>
                      </View>
                    </View>
                  )}    
                />
              }
              <View style={{ marginBottom:20}}/>  
            </View>
            </SafeAreaView>
          </Modal>

      <Modal
      isVisible={iscancelmodalVisible}
      animationInTiming={500}
      >
        <SafeAreaView style={styles.centeredView}>
          <View style={styles.modalView}>
            <View>
            <Text style={styles.modalText}>Cancel Request</Text>

            <SafeAreaView style={{}}>
              <Input
                placeholder="Reason For Canceling Request"
                autoCapitalize='sentences'
                onUpdateValue={setReason}
                multiline={true}
                value={reason}
                onFocus={() => setreasonInvalid(false)}
                isInvalid={reasonInvalid}
                style={{fontSize:14}}
              />
            </SafeAreaView>
            <View style={{marginBottom:'5%'}}/>
            </View>
            {/* <View style={styles.buttonView}> */}

            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <TouchableOpacity style={styles.viewbtn} onPress={() => [toggleCancelModal(), setReason(null)]} >
                  <Text style={styles.viewtext}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelbtn} onPress={() => reasonValidate()}>
                  <Text style={styles.canceltext}>Submit</Text>
                </TouchableOpacity>
            </View>             
              {/* </View> */}
          </View>
          </SafeAreaView>
      </Modal>

      <Modal
      isVisible={isdisputemodalvisible}
      animationInTiming={500}
      >
        <SafeAreaView style={styles.centeredView}>
          <View style={styles.modalView}>
            <View>
            <Text style={styles.modalText}>Dispute</Text>

            <SafeAreaView style={{}}>
              <Input
                placeholder="Reason For making a Dispute"
                autoCapitalize='sentences'
                onUpdateValue={setDispute}
                multiline={true}
                value={dispute}
                onFocus={() => setdisputInvalid(false)}
                isInvalid={disputInvalid}
                style={{fontSize:14}}
              />
            </SafeAreaView>
            <View style={{marginBottom:'5%'}}/>
            </View>
            {/* <View style={styles.buttonView}> */}

            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <TouchableOpacity style={styles.viewbtn} onPress={() => [toggleDisputeModal(), setDispute(), setdisputInvalid(false)]} >
                  <Text style={styles.viewtext}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelbtn} onPress={() => dispute === null || dispute === undefined || dispute.length === 0 || dispute === "" ? setdisputInvalid(true) : [toggleDisputeModal(), DisputeHandler()]}>
                  <Text style={styles.canceltext}>Submit</Text>
                </TouchableOpacity>
            </View>             
              {/* </View> */}
          </View>
          </SafeAreaView>
      </Modal>
      
      <Modal isVisible={issatisfiedmodalvisible}>
        <SafeAreaView style={styles.centeredView}>

          <View style={styles.modalView}>
            <Text style={styles.modalText}>Satisfied</Text>

            <View style={{marginTop:5}}/>
            <Dropdown
              style={[styles.dropdown, isSatisfiedFocus && { borderColor: 'blue' }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={data}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isSatisfiedFocus ? 'Are you satisfied with the help' : '...'}
              searchPlaceholder="Search..."
              value={satifiedtype}
              onFocus={() => setIsSatisfiedFocus(true)}
              onBlur={() => setIsSatisfiedFocus(false)}
              onChange={item => {
                  setSatifiedType(item.value);
                  setIsSatisfiedFocus(false);
              }}
            />

            {
              satifiedtype === "N" && 

                <Input
                  placeholder="Reason For Not being Satisfied"
                  autoCapitalize='sentences'
                  onUpdateValue={setNotSatisfiedReason}
                  multiline={true}
                  value={notsatifiedreason}
                  // style={{borderBottomWidth: 1, borderBottomColor: Color.darkolivegreen_100, padding:10, borderRadius:10 }}
                />
            }



            <View style={{flexDirection:'row', marginTop:10, justifyContent:'space-between'}}>

              <TouchableOpacity style={styles.cancelbtn} onPress={ () => [toggleSatisfiedModal(), setSatifiedType(), setNotSatisfiedReason(null)]} >
                <Text style={styles.canceltext}>Cancel</Text>
              </TouchableOpacity>
                
              <TouchableOpacity style={styles.viewbtn} onPress={() => satifiedtype === null || satifiedtype === undefined || satifiedtype === "" ? Alert.alert("No Fied Selected", "Select a field to continue") : [toggleSatisfiedModal(), Satisfied(),]}>
                <Text style={styles.viewtext}>Continue</Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginBottom:10}}/>

            
          </View>
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  )
}

export default Requests

const styles = StyleSheet.create({
  completeservicetext:{
    color:'tomato',
    fontFamily: 'poppinsMedium',
    fontSize: 12,
    textAlign: "center",
  },
  requestName:{
    // fontSize: FontSize.size_xl,
    color: Color.darkolivegreen_100,
    fontFamily: 'poppinsBold',
    paddingBottom: 5,
  },
  container: {
    flex: 1,
  },
  inputInvalid:{
    backgroundColor: Color.error100
  },
  requeststxt:{
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
    padding:10,
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
  selectedTextStyle: {
    fontSize: 14,
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
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  }, 
  placeholderStyle: {
    fontSize: 14,
    color: Color.gray
  },
})