import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, {useState, useContext, useEffect} from 'react'
import { Color, marginStyle } from '../Component/Ui/GlobalStyle'
import GoBack from '../Component/Ui/GoBack'
import SubmitButton from '../Component/Ui/SubmitButton'
import { Image } from 'expo-image'
import { HelperGet, RateHelper, ViewHelperRatingonRequest } from '../utils/AuthRoute'
import {Ionicons, MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons'
import { AuthContext } from '../utils/AuthContext'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'


const CustomerRating = ({navigation, route}) => {

  const [defaultRating, setdefaultRating] = useState(2)
  const [maxRating, setMaxRating] = useState([1,2,3,4,5])
  const helperID = route?.params?.helperid
  const date1 = (new Date(route?.params?.date)).toDateString()
  const id = route?.params?.id
  const authCtx = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(false)
  const [customerdetails, setCustomerdetails] = useState([])
  const [ratecomment, setRateComment] = useState()
  const [helpershowrating, setHelperShowRating] = useState()

  // console.log(date1)

  useEffect(() => {
    // const unsubscribe = navigation.addListener('focus', async () => {
      helperrating()
      customerGetProfile()
    // })
    // return unsubscribe;
  }, [])
  
  const helperrating =async  () => {
    try {
      const response = await ViewHelperRatingonRequest(id, authCtx.token)
      // console.log(response.data)
      setHelperShowRating(response.data)
    } catch (error) {
      // console.log(error)
    }
  }


  const customerGetProfile = async () => {
    try {
      setIsLoading(true)
      const response = await HelperGet(helperID, authCtx.token) 
      // console.log(response.data.data)
      setCustomerdetails(response.data.data)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(true)
      // console.log(error.response.data.message)
      setIsLoading(false)
    }
  }

  const rateCustomer = async () => {
    // console.log(defaultRating, helperID, ratecomment)
    try {
      setIsLoading(true)
      const response = await RateHelper(id, defaultRating, ratecomment, authCtx.token)
      Alert.alert("", `You've successfully rated the handyman with id: ${helperID}`, [
        {
          text: "Ok",
          onPress: () => navigation.goBack()
        }
      ])
      // console.log(response.data)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(true)
      // console.log(error.response.data)
      setIsLoading(false)
    }
  }

  // const startImgFilled = require("../assets/star_filled.png")
  // const startImgCorner = require("../assets/star_corner.png")
  const startImgFilled = `https://raw.githubusercontent.com/tranhonghan/images/main/star_filled.png`
  const startImgCorner = `https://raw.githubusercontent.com/tranhonghan/images/main/star_corner.png`


  const CustomerRatingBar = () => {
    return (
      <View style={styles.customerRatingBarStyle}>
        {
          maxRating.map((item, key) => {
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                key={item}
                onPress={() => setdefaultRating(item)}
              >

              <Image
                contentFit='cover'
                style={styles.startImgStyle}
                source={
                  item <= defaultRating
                  ? {uri: startImgFilled}
                  : {uri: startImgCorner}
                }
              />
              </TouchableOpacity>
            )
          })
        }
      </View>
    )
  }

  if(isLoading){
    return <LoadingOverlay message={"..."}/>
  }
  
  return (
    <ScrollView style={{marginTop:marginStyle.marginTp, marginHorizontal:10, flex:1}}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      {/* <Text style={styles.cusratingtxt}>CustomerRating</Text> */}

      <SafeAreaView style={styles.container}>
        <Image style={styles.profile} source={customerdetails.picture === null ? require("../assets/person-4.png")  : {uri: `https://igoeppms.com/igoepp/public/handyman/${customerdetails.photo}`}}/>
          <View style={{flexDirection:'row', alignContent:'center', alignSelf:'center'}}>
            <Text style={[styles.title , {marginTop: 15, marginBottom: 5, textAlign:'center'}]}>{customerdetails.first_name}</Text>
            <Text style={[styles.title , {marginTop: 15, marginBottom: 5, textAlign:'center'}]}> {customerdetails.last_name}</Text>
          </View>
          <View style={styles.customerbox}>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <MaterialIcons name="email" size={24} color="#777777" />
              <Text style=    {{ color: '#777777', marginLeft: 20, fontFamily:'poppinsRegular' }}>{customerdetails.email}</Text>
            </View>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <Ionicons name="location" color="#777777" size={20}/>
              <Text style=    {{ color: '#777777', marginLeft: 20, fontFamily:'poppinsRegular' }}>{customerdetails.Country} {customerdetails.State} {customerdetails.lga}</Text>
            </View>
        </View>
        <View style={{padding: 10, marginTop:10}}>
            <View style={{flexDirection:'row', justifyContent:'center'}}>
              <Text style=    {{ color: '#777777', fontFamily:'poppinsRegular' }}> {helpershowrating === null || [] ? "No Rating" : helpershowrating} </Text>
              <Image contentFit='contain' style={{  width: 20, height: 20, marginTop:2 }} source={require("../assets/group-723.png")}/>
            </View>
            <Text style={styles.textStyle}>Rate the Handyman service performed on {date1} </Text>
            <CustomerRatingBar />
            <Text style={styles.textStyle}>
              {
                defaultRating === 1 ?
                    <Text style={{fontSize:30}}>😡</Text>
                :
                defaultRating === 2?
                    <Text style={{fontSize:30}}>😥</Text>
                :
                defaultRating === 3 ?
                <Text style={{fontSize:30}}>🤨</Text>
                : 
                defaultRating === 4 ?
                    <Text style={{fontSize:30}}>😃</Text>
                :
                defaultRating === 5 &&
                    <Text style={{fontSize:30}}>😎</Text>
              }
            </Text>
            <TextInput multiline style={{backgroundColor: Color.gray6, padding:10, height:70, borderRadius:10}} placeholder='Add comment' value={ratecomment} onChangeText={setRateComment}/>
            <SubmitButton message={"Submit"} onPress={() => !ratecomment ? Alert.alert("Empty Field", "Write a comment on the handyman to continue") : rateCustomer()} style={{marginTop:20}}/>
        </View> 
      </SafeAreaView>
    </ScrollView>
  )
}

export default CustomerRating

const styles = StyleSheet.create({
  cusratingtxt:{
    fontSize: 18,
    color: Color.darkolivegreen_100,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
    marginBottom:15,
  }, 
  startImgStyle:{
    width:30,
    height:30,
    margin:8
  },
  customerRatingBarStyle:{
    justifyContent:'center',
    flexDirection:'row',
    // marginTop:30
  },
  title:{
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'poppinsRegular'
  },
customerbox:{
    // flexDirection:'row'
    marginTop:20,
    alignItems:'center'
},
profile:{
    height:150,
    width:150,
    borderRadius: 100,
    alignSelf:'center'
},
container:{
    flex:1,
    padding:20,
    // justifyContent: 'center'
},
textStyle:{
    textAlign:'center',
    // fontSize: 18,
    fontFamily:'poppinsRegular',
    marginTop:20
},
})