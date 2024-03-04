import { Alert, AppState, Dimensions, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Image, ImageBackground } from 'expo-image'
import { MaterialCommunityIcons, FontAwesome, Entypo, AntDesign, MaterialIcons } from '@expo/vector-icons';
import Swiper from 'react-native-swiper'
// import { AuthContext } from '../utils/AuthContext';
import * as LocalAuthentication from 'expo-local-authentication'
import { Border, Color, DIMENSION, marginStyle } from '../Component/Ui/GlobalStyle';
import LoadingOverlay from '../Component/Ui/LoadingOverlay';
import { CustomerInfoCheck, NotificationUnread, SliderImage, TrendingService, WalletBalance } from '../utils/AuthRoute';
import { AuthContext } from '../utils/AuthContext';
import * as Notifications from 'expo-notifications'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FontAwesome5} from '@expo/vector-icons'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

const data = [
  {
    id:1,
    name: 25,
    description: 'services made'
  },

  {
    id:2,
    name: 'NGN' + 27,
    description: 'OutStanding Payment'

  }

]



const Welcome = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [trend, setTrend] = useState([])
  const [photo, setPhoto] = useState()
  const [sliimage, setsliimage] = useState([])
  const authCtx = useContext(AuthContext)
  const [appState, setAppState] = useState(AppState.currentState)
  const [notificationnumber, setnotificationnumber] = useState('')

  

  useEffect(() => {
    const unsuscribe = async () => {
      const token = (await Notifications.getExpoPushTokenAsync({ projectId: 'e8a1e2a3-7c71-4a4e-9e7b-60ca9cecf323' })).data;
      // console.log(token)
    }
    unsuscribe()
  }, [])

  useEffect(() => {
    navigation.addListener('focus', async () => {
      NotifiationNumber()
    })
  }, [notificationnumber])

  const NotifiationNumber = async () => {
    try {
      const response  = await NotificationUnread(authCtx.userid, authCtx.token)
      // console.log(response)
      setnotificationnumber(response)
    } catch (error) {
      return
    }
  }


  const ShowAmount = () => {
    authCtx.customerShowAmount('show')
  }
  
  const HideAmount = () => {
    authCtx.customerShowAmount('hide')
  }

  // useEffect(() => {
  //   // Function to handle app state changes
  //   const handleAppStateChange = async (nextAppState) => {
  //     // If the app goes into the background or inactive state, log out the user
  //     if (appState.match(/active/) && nextAppState === 'background') {
  //       // Call your logout function here
  //       // checkLastLoginTimestamp()
  //       const storedTimestamp = await AsyncStorage.getItem('checktime')
  //       const lastLoginTimestamp = new Date(storedTimestamp);
  //       const currentTimestamp = new Date();
  //       // console.log(storedTimestamp + " " + new Date())
  //       if(authCtx.lastLoginTimestamp === null || undefined || ""){
  //         return 
  //       }else{
  //         const timeDifferenceInMinutes = Math.floor(
  //           (currentTimestamp - lastLoginTimestamp) / (1000 * 60)
  //         );

  //         const authenticationThresholdInMinutes = 5;

  //         if (timeDifferenceInMinutes > authenticationThresholdInMinutes) {
  //           AsyncStorage.removeItem('customerlastLoginTimestamp')
  //           authCtx.logout()
  //         }

  //       }
  //     }

  //     setAppState(nextAppState);
  //   };

  //   // Subscribe to app state changes
  //   AppState.addEventListener('change', handleAppStateChange);

  //   // Cleanup: Remove the event listener when the component unmounts
  //     return;
  // }, [appState]);

  function onAuthenticate (spec){
    const auth = LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate with Touch ID',
      fallbackLabel: 'Enter Password'
    });
    auth.then(result => {
      setIsAuthenticated(result.success);
      if(result.success === true){
        if(spec === 'hide'){
          HideAmount()
        }else{
          ShowAmount()
        }
      }else if(result.error === "not_enrolled"){
        Alert.alert("", "Device not enrolled, setup up a screen lock to use this feature")
      }
    })
  }


    useEffect(() => {
      TrendsArray()
      slider()
    }, [])


    useEffect(() => { 
      const WalletCheck = navigation.addListener('focus', async () => {
        try {
          const response =  await WalletBalance(authCtx.Id, authCtx.token)
          authCtx.customerBalance(response.wallet_balance)
        } catch (error) {
          // console.log(error.response)
          return;
        }
      })
      return WalletCheck;
    }, [])

    // console.log(authCtx.token, authCtx.Id)

    useEffect(() => { 
    const customerget = navigation.addListener('focus', async () => {
      try {
        const response = await CustomerInfoCheck(authCtx.Id, authCtx.token)
        // console.log(response)
        setPhoto(response.photo)
        authCtx.customerPoints(response.total_points)
        authCtx.customerFirstName(response.first_name)
        authCtx.customerLastName(response.last_name)
        authCtx.customerPicture(response.picture)
        authCtx.customerBalance(response.wallet_balance)
        authCtx.customerPhone(response.phone)
      } catch (error) {
        return;
      }
      })
      return customerget;
    }, [])

    const slider = async () => {
      try {
        setIsLoading(true)
        const response = await SliderImage(authCtx.token)
        setsliimage(response)
        setIsLoading(false)
      } catch (error) {
        setIsLoading(true)
        // console.log(error.response)
        setIsLoading(false)
        return;
      }
    }

    const TrendsArray = async() => {
      try {
      const response = await TrendingService(authCtx.token) 
      setTrend(response.data)
      } catch (error) {
        // console.log(error.response)
      }
    }

    if(isLoading){
      return <LoadingOverlay message={"..."}/>
    }

  return (
    <SafeAreaView style={{marginHorizontal:10, maxHeight: HEIGHT, marginTop: marginStyle.marginTp}}>
      
      <View style={styles.nameContainer}>
        <View style={{flexDirection:'row', justifyContent:'space-between', width:'100%'}}>
          {/* <FontAwesome name="reorder" size={24} color={Color.orange_200} /> */}
          <View style={{flexDirection:'row'}}>
                  {/* <Foundation name="list" size={24} color={Color.orange_200} />   */}
                  
                  {
                    authCtx.picture === null || authCtx.picture === undefined || authCtx.picture === "null" || authCtx.picture === ""  || authCtx.picture === "NoImage"? 
                    <TouchableOpacity onPress={() => navigation.navigate('ProfilePicsView')}>
                      <Image transition={1000} source={require("../assets/person-4.png")} style={{width:35, height:35, borderRadius:30, borderWidth:1, top:-5}}/>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={() => navigation.navigate('ProfilePicsView')}>
                      <Image transition={1000} source={{uri: `https://phixotech.com/igoepp/public/customers/${authCtx.picture}`}} style={{width:35, height:35, borderRadius:30, borderWidth:1, top:-5}}/>
                    </TouchableOpacity>
                  }
                  
            
            <Text style={styles.hiChris}>Hi {authCtx.firstname}
            </Text>
          </View>
          


          <TouchableOpacity style={{flexDirection:'row', marginRight:3, justifyContent:'space-around'}} onPress={() => navigation.navigate('NotificationScreen')}>
            <View style={{}}>
              <FontAwesome name="bell" size={22} color={Color.darkolivegreen_100} />
            </View>
           <View>
           {
              notificationnumber === 0 ? null :
            <ImageBackground transition={1000} style={{padding:5, position:'absolute', marginTop:-10, left:-10}}
                contentFit='contain'
                source={require("../assets/ellipse-127.png")}>
            <Text style={[styles.text2, styles.text2Typo]}>{notificationnumber}</Text>

            </ImageBackground>
            }
           </View>


          </TouchableOpacity>
        </View>
      </View>
      
      <View>
          <ScrollView>
          <Swiper style={styles.wrapper} 
                dotColor= {Color.dimgray_100}
                // autoplay={true}
                // autoplayTimeout={100}
                activeDotColor='white'
                // activeDotStyle={{ width:20, height:9}}
                // dotStyle={{ width:10, height:11}}
                
              >
                           
              {isLoading ? <LoadingOverlay/> :
              <View style={styles.slide1}>
                {/* <Image style={{height:30, width:30}} source={require("../assets/vectors/vector2.png")}/> */}
                <View style={{flexDirection:'row',}}>
                  <View>
                  <Text style={styles.text}>
                    <MaterialCommunityIcons name="currency-ngn" size={20} color={Color.white} />
                   
                    {authCtx.showAmount === 'show' ?  authCtx.balance : <Text>******</Text>} 
                   
                  </Text>
                  </View>

                  

                  {authCtx.showAmount === 'show' ?
                   <TouchableOpacity style={{alignSelf:'center', marginLeft:10}} onPress={() => onAuthenticate('hide')}>
                      <Entypo name="eye-with-line" size={24} color="white" />
                    </TouchableOpacity>
                  :
                    <TouchableOpacity style={{alignSelf:'center', marginLeft:10}} onPress={() => onAuthenticate('show')}>

                      <Entypo name="eye" size={24} color="white" />
                    </TouchableOpacity>
                  }

                </View>

                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                  {
                    Platform.OS === "android" ?
                    <Text style={{fontSize: 15, fontFamily: 'interBold', color: Color.white}}>Wallet Balance</Text>
                    :
                    <Text style={{fontSize: 15, fontFamily: 'interBold', color: Color.white, marginTop:10}}>Wallet Balance</Text>
                  }
                  
                    {
                      Platform.OS === "android" ?
                      <View style={{justifyContent:'center', alignItems: 'center',}}>
                      <TouchableOpacity 
                        onPress={() => navigation.navigate("AddToWallet")}
                        style={{right:10,}}
                        >
                        <AntDesign name="pluscircle" size={36} color="white" />
                      </TouchableOpacity>
                      <Text style={{fontSize: 13, marginTop:3, right:15, fontFamily: 'interRegular', color: Color.white}}>Add Money</Text>  
                      </View>
                      :
                      <View style={{justifyContent:'center', alignItems: 'center',}}>
                      <TouchableOpacity 
                        onPress={() => navigation.navigate("AddToWallet")}
                        style={{right:10, marginTop:15}}
                        >
                        <AntDesign name="pluscircle" size={36} color="white" />
                      </TouchableOpacity>
                      <Text style={{fontSize: 15, right:15, fontFamily: 'interRegular', color: Color.white}}>Add Money</Text>  
                    </View>

                    }
                  
                </View>  
              </View>
              }

              <View style={styles.slide1}>
              <Text style={styles.text}>
                {authCtx.points === null || undefined || "0" ? 0 : authCtx.points}
               </Text> 

                {
                  Platform.OS === "android" ?
                  <Text style={{fontSize: 15, fontFamily: 'interBold', color: Color.white}}>Loyalty {authCtx.points === null || undefined || "0" ? 'Point' : "Points"}</Text>
                  :
                  <Text style={{fontSize: 15, fontFamily: 'interBold', color: Color.white, marginTop:10}}>Loyalty Points</Text>
                }
              </View>
             
              </Swiper>          
            </ScrollView>

          <ScrollView style={{marginTop:15, borderRadius:10}}>
              <Swiper style={styles.wrapper1} 
                dotColor= {Color.dimgray_100}
                autoplay={true}
                autoplayTimeout={3}
                activeDotColor='white'
                activeDotStyle={{ width:0, height:0}}
                dotStyle={{ width:0, height:0}}
                
              >
{/*             
            <ImageBackground style={[styles.slide2,]} contentFit='contain' source={require("../assets/ads1.jpeg")}>
              <Text style={{fontFamily: 'poppinsSemiBold', color: Color.white}}>Services Performed</Text>
              <Text style={styles.text}>25</Text>
            </ImageBackground>
            
            <ImageBackground style={styles.slide2}  contentFit='contain' source={require("../assets/ads2.jpeg")}>
              <Text style={{fontFamily: 'poppinsSemiBold', color: Color.white}}>Get 20% discount after 10 Requests</Text>
              <Text style={styles.text}>25</Text>
            </ImageBackground> */}


              {(sliimage).map((item, index) => (
                <>
                {
                  isLoading ? <LoadingOverlay/> :

                  <ImageBackground key={index} contentFit='contain' source={{uri: `https://phixotech.com/igoepp/public/slider/${item.slide}`}} style={styles.slide2}/>

                }
                </>
              ))}        
              </Swiper>
          </ScrollView>

        </View>

        

      <ScrollView style={{ marginTop:'2%'}} showsVerticalScrollIndicator={false}>
      <View style={{marginHorizontal:10}}>
        <Text style={[styles.quickLinks,{fontFamily:'poppinsRegular', fontSize:15} ] }>Quick Links</Text>
      </View>

     
      <View>

        <View style={{}}>
          <ScrollView 
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={[styles.subContainer]}
          >

            <View style={{marginRight:10, marginTop:5,}}>

              <TouchableOpacity style={styles.makepayment}  onPress={() => navigation.navigate('BillPayment')}>
                <Image contentFit='contain' source={require("../assets/makepay.png")} style={{width:40, height: 40,  }} transition={1000}/>
                <Text style={{ color: Color.steelblue, marginTop:5, fontSize:10}}>Bill Payment</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.viewrequest, {paddingLeft:8}]} onPress={() => navigation.navigate('RequestHelp')}>
                {/* <Image contentFit='contain' source={require('../assets/vectors/service.png')} style={{width:50, height: 50, marginTop:50, alignSelf:'flex-end', marginRight:30}} transition={1000}/> */}
                <Image contentFit='contain' source={require("../assets/group4.png")} style={{width:50, height: 50, left:7 , marginTop: 55, marginBottom: 25 }} transition={1000}/>
                <View style={{ justifyContent:'flex-end', alignItems:'flex-end', marginTop: 50}}>
                  <Text style={{color: Color.blueviolet, alignSelf:'baseline', fontSize:10}}> Make Request</Text>
                </View>
                <View style={{marginBottom:'30%'}}/>
              </TouchableOpacity>
              
            </View>

              <View style={{marginRight:10, marginTop:5,}}>
                <TouchableOpacity style={[styles.searchhistory, {paddingLeft:8}]} onPress={() => navigation.navigate('ServiceHistory')}>
                  {/* <Image contentFit='contain' source={require('../assets/vectors/service.png')} style={{width:50, height: 50, marginTop:50, alignSelf:'flex-end', marginRight:30}} transition={1000}/> */}
                  <Image contentFit='contain' source={require("../assets/service.png")} style={{width:50, height: 50,  marginTop: 55, marginBottom: 25, alignSelf:'flex-end', marginRight:30 }} transition={1000}/>
                  <View style={{ justifyContent:'flex-end', alignItems:'flex-end', marginTop: 50}}>
                    <Text style={{textAlign:'right', paddingRight:10, color:'#fff', fontFamily: 'poppinsRegular', fontSize:10}}>Service History</Text>
                  </View>
                  <View style={{marginBottom:'30%'}}/>
                </TouchableOpacity>

                <TouchableOpacity style={styles.marketplace}  onPress={() => navigation.navigate('MarketPlace')}>
                  {/* <Image contentFit='contain' source={require("../assets/makepay.png")} style={{width:40, height: 40,  }} transition={1000}/> */}
                  <ImageBackground>
                    <Image
                    contentFit='contain'
                    style={styles.marketplaceIcon}
                    source={require("../assets/vector50.png")}
                    transition={500}
                    />

                    <View style={{flexDirection:'row'}}>
                    <Image
                    contentFit='contain'
                    style={styles.marketplaceIcon2}
                    source={require("../assets/vector49.png")}
                    transition={500}
                    />
                    <Image
                    contentFit='contain'
                    style={styles.marketplaceIcon3}
                    source={require("../assets/vector51.png")}
                    transition={500}
                    />
                    </View>
                    </ImageBackground>
                  <Text style={{ fontSize: 10,  marginTop: 10, color: Color.peru}}>Market Place</Text>
                </TouchableOpacity>
              </View>

              <View style={{marginRight:10, marginTop:5}}>
                <TouchableOpacity style={styles.feedback}  onPress={() => navigation.navigate('FeedBack')}>
                  {/* <Image contentFit='contain' source={require("../assets/makepay.png")} style={{width:40, height: 40,  }} transition={100}/> */}
                  <MaterialIcons name="feedback" size={40} color="white" />
                  <Text style={{ color: Color.white, marginTop:5, fontSize:10}}>FeedBack</Text>
                </TouchableOpacity>
              
                <TouchableOpacity style={[styles.availability, {paddingLeft:8}]} onPress={() => navigation.navigate('Requests')}>
                  {/* <Image contentFit='contain' source={require("../assets/group13.png")}  transition={1000}/> */}
                  <View style={{width:50, height: 50,  marginTop: 55, marginBottom: 25, alignSelf:'flex-start', marginLeft:10 }}>
                    <FontAwesome5 name="clipboard-list" size={40} color={Color.steelblue} />
                  </View>
                  <View style={{ justifyContent:'flex-start', alignItems:'flex-start', marginTop: 50}}>
                    <Text style={{textAlign:'left', color:Color.steelblue, fontFamily: 'poppinsRegular', fontSize:10}}>Requests</Text>

                  </View>
                  <View style={{marginBottom:'30%'}}/>
                </TouchableOpacity>

                
              </View>

          </ScrollView>
        </View>


        </View>
      {
        trend.length === 0 ? null :
        <>
        <View style={{marginTop:10, marginBottom:20}}>
          <Text style={{fontSize:15, marginLeft:10, fontFamily:'poppinsSemiBold'}}>Trending Service</Text>
          {
            trend.map((item, key) => {
              return(
                <View key={key} style={[styles.shadowProps, {flexDirection:'row', borderWidth:1, borderColor:Color.darkolivegreen_100, height:HEIGHT*0.1, alignSelf:'center', borderRadius:10,  width:WIDTH*0.8, margin:10, padding:10, marginLeft:20}]}>
                  <View style={{padding:10, borderWidth:1, borderRadius:10, top:10, left:-25, position:'absolute', backgroundColor:'white'}}>
                    <Text><Entypo name="tools" size={30} color={Color.darkolivegreen_100} /></Text>
                  </View>

                  <View style={{marginLeft:30,  flex:1, justifyContent:'center'}}>
                      
                      <View>
                        <Text style={{fontFamily:'poppinsSemiBold', fontSize:13}}>{item.sub_category}</Text>
                      </View>

                      <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Min Price: {item.min_agreed_price.toLocaleString()}</Text>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Max Price: {item.max_agreed_price.toLocaleString()}</Text>
                    </View>
                  </View>
                </View>
              )
            })
          }
         
        <Text style={{fontSize:15, marginLeft:10, fontFamily:'poppinsSemiBold'}}>Top Selling Product</Text>
        </View>
        </>
      }
        <View style={{marginBottom:'20%', marginTop:'7%'}}/>

      </ScrollView>
    </SafeAreaView>
  )
}

export default Welcome

const styles = StyleSheet.create({
  marketplaceIcon2:{
    width: 9,
    height: 9,
    marginLeft: 11,
    marginTop: 5,
    // position:'absolute'
  },
  marketplaceIcon3:{
    width: 9,
    height: 9,
    marginLeft: 5,
    marginTop: 5,
    // position:'absolute'
  },
  marketplaceIcon:{
    width: 40,
    height: 24
  },
  marketplace:{
    backgroundColor:Color.sandybrown,
    height: DIMENSION.HEIGHT * 0.12,
    borderRadius: Border.br_3xs,
    width: DIMENSION.WIDTH * 0.4,
    marginBottom: 10,
    padding:10
  },
  feedback:{
    backgroundColor:Color.darkolivegreen_100,
    height: DIMENSION.HEIGHT * 0.12,
    borderRadius: Border.br_3xs,
    width: DIMENSION.WIDTH * 0.4,
    marginBottom: 10,
    padding:10
  },
  shadowProps:{
    marginBottom: 20,
    borderRadius: 20, 
    elevation: 7,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 7,
    backgroundColor: 'white',
    overflow: Platform.OS === 'andriod' ? 'hidden' : 'visible',
  },
  quickLinks: {
    color: Color.dimgray_100,
    fontSize: 15,
    fontWeight: "500",
    // borderWidth:1

  },
  text2Typo: {
    fontFamily: 'poppinsSemiBold',
    textAlign: "center",
  },
  text1Typo: {
    fontFamily: 'poppinsSemiBold',
    fontWeight: "500",
  },
  text2: {
    top:1,
    fontSize: 10,
    color: Color.white,
  },
  googlePixel2Xl116Inner: {
    width: 18,
    height: 18,
    position: "absolute",  
  },
  subContainer:{
    // height:HEIGHT * 0.6,
    paddingLeft:5,
    paddingRight:5,
  },
  makepayment:{
    height: DIMENSION.HEIGHT * 0.12,
    backgroundColor: Color.skyblue,
    borderRadius: Border.br_3xs,
    width: DIMENSION.WIDTH * 0.4,
    marginBottom: 10,
    padding:10
  },
  
  acceptedrequest:{
    height: DIMENSION.HEIGHT * 0.12,
    backgroundColor: Color.limegreen_100,
    borderRadius: Border.br_3xs,
    width: DIMENSION.WIDTH * 0.4
  },
  availability:{
    backgroundColor: Color.skyblue,
    maxHeight: DIMENSION.HEIGHT * 0.3,
    borderRadius: Border.br_3xs,
    width: DIMENSION.WIDTH * 0.4,
    // padding:10,
    // marginBottom:10
  },
  nameContainer:{
    marginBottom:10,
    marginHorizontal:10
  },
  viewrequest:{
    backgroundColor: Color.mediumpurple,
    maxHeight: DIMENSION.HEIGHT * 0.3,
    borderRadius: Border.br_3xs,
    width: DIMENSION.WIDTH * 0.4,
    marginBottom:10
  },
  searchhistory:{
    backgroundColor: Color.lightcoral,
    maxHeight: DIMENSION.HEIGHT * 0.3,
    borderRadius: Border.br_3xs,
    width: DIMENSION.WIDTH * 0.4,
    marginBottom:10,

  },
  wrapper: {
    height: DIMENSION.HEIGHT * 0.18,
    elevation: 4,
  },
  wrapper1: {
    height: HEIGHT * 0.14,
    alignItems:'center',
    justifyContent:'center'
  },
  servicestypo:{
    fontWeight: "500",
    left: "0%",
    top: "0%",
    color: Color.gray6,
  },
  hiChris:{
    left: 5,
    fontSize: 14,
    fontFamily:'poppinsRegular',
    color: Color.darkolivegreen_100,
    textAlign: "left",
  },
  slide2: {
    flex: 1,
    paddingLeft:20,
    paddingTop:20,
    marginHorizontal:5,
    backgroundColor: Color.darkolivegreen_100,
    borderRadius: 10,
  },
  slide1: {
    flex: 1,
    paddingLeft:20,
    paddingTop:20,
    marginHorizontal:5,
    backgroundColor: Color.darkolivegreen_100,
    borderRadius: 10,
  },
  text: {
    color: '#fff',
    fontSize: 20,
    fontFamily:'poppinsSemiBold'
  }
})