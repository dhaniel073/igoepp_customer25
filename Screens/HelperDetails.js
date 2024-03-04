import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import GoBack from '../Component/Ui/GoBack'
import { Color, DIMENSION, marginStyle } from '../Component/Ui/GlobalStyle'
import { AuthContext } from '../utils/AuthContext'
import {Ionicons, MaterialIcons, Octicons} from '@expo/vector-icons'
import { Image } from 'expo-image'
import { HelperGet, HelperGetAllRequest, ViewHelperRating } from '../utils/AuthRoute'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'


const HelperDetails = ({navigation, route}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [category, setCategory] =  useState([])
    const helperid = route?.params?.helperId
    const authCtx = useContext(AuthContext)
    const [requestlength, setRequestLength] =  useState([])
    const [helperrating, setHelperRating] = useState([])

    

  useEffect(() => {
    const unsuscribe = navigation.addListener('focus', async () => {
      try 
      {
        setIsLoading(true)
        const response = await HelperGet(helperid, authCtx.token)
        // console.log(response.data.data)
        setCategory(response.data.data)
        setIsLoading(false)
      } catch (error) {
        setIsLoading(true)
        // console.log(error)
        setIsLoading(false)
        return;
      }
    })
    return unsuscribe
  }, [])

  useEffect(() => { 
    const RequestLength = navigation.addListener('focus', async () => {
    try {
      setIsLoading(true)
      const response = await HelperGetAllRequest(helperid, authCtx.token)
      // console.log(response.data)
      setRequestLength(response.data)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(true)
      // console.log(error)
      setIsLoading(false)
      return;
    }
    })
    return RequestLength;
  }, [])

  useEffect(() => {
  const rating = navigation.addListener('focus', async () => {
    try {
      setIsLoading(true)
      const response = await ViewHelperRating(helperid, authCtx.token)
      // console.log(response.data.length)
      const myObj = response.data[0];
      // console.log(myObj.helper_rating)
      if(response.data.length === 0){
        return setHelperRating(0)
      }else{
        setHelperRating(response.data[0])
      }
      setIsLoading(false)
    } catch (error) {
      setIsLoading(true)
      // console.log(error)
      setIsLoading(false)
      return;
    }  
  })
  return rating;
}, [])


  if(isLoading){
    return <LoadingOverlay message={"..."}/>
  }


  return (
   
      <ScrollView style={{marginTop: marginStyle.marginTp, marginHorizontal:10, flex:1}}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <Text style={styles.helperdetailsscreentxt}>Helper Details</Text>

      <View style={{marginTop:20}}/>
        {category.photo === null ?
          <Image style={[styles.image, ]} source={require("../assets/person-4.png")}/>
          :
          <Image style={[styles.image, ]} source={{ uri: `https://phixotech.com/igoepp/public/handyman/${category.photo}` }} 
          placeholder={'blurhash'}
          // contentFit="contain"
          transition={1000}/>
        } 
      <View style={styles.userInfoSection}></View>

      <View style={styles.userInfoSection}>
        <View style={{ marginLeft: 10, alignSelf:'center', alignItems:'center'  }}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={[styles.title , {marginTop: 15, marginBottom: 5}]}>{category.first_name}</Text>
            <Text style={[styles.title , {marginTop: 15, margin: 5}]}> {category.last_name}</Text>
          </View>
          <Text style={styles.caption}>{category.email}</Text>
        </View>
      </View> 

      <View style={styles.userInfoSection1}>
          <View style={styles.row}>
            <View style={{flexDirection:'row'}}>
              <Ionicons name="location" color="#777777" size={20}/>
              <Text style={{ color: '#777777', marginLeft: 10, fontFamily:'poppinsRegular' }}>Location</Text>
            </View>
              <Text style={{ color: '#777777', marginLeft: 20, fontFamily:'poppinsRegular' }}>{category.Country} {category.State} {category.lga}</Text>
          </View>
          <View style={styles.row}>
          <View style={{flexDirection:'row'}}>
              <MaterialIcons name="email" size={24} color="#777777" />
              <Text style={{ color: '#777777', marginLeft: 10, fontFamily:'poppinsRegular' }}>email</Text>
            </View>
              <Text style={{ color: '#777777', marginLeft: 20, fontFamily:'poppinsRegular' }}>{category.email}</Text>
          </View>

          <View style={styles.row}>
          <View style={{flexDirection:'row'}}>
              <Ionicons name="star" color="#777777" size={20}/>
              <Text style={{ color: '#777777', marginLeft: 10, fontFamily:'poppinsRegular' }}>Rating</Text>
            </View>
            
            <View style={{flexDirection:'row'}}>
                  <Text>{helperrating === 0 ? "No Rating" : helperrating.helper_rating}</Text>                 
              <Image contentFit='contain' style={{  width: 15, height: 15, marginTop:2 }} source={require("../assets/group-723.png")}/>
            </View>
          </View>

          <View style={styles.row}>
          <View style={{flexDirection:'row'}}>
              <Ionicons name="location" color="#777777" size={20}/>
              <Text style={{ color: '#777777', marginLeft: 10, fontFamily:'poppinsRegular' }}>Status</Text>
            </View>

            <View style={{flexDirection:'row'}}>
              <Text style={{ color: '#777777', marginLeft: 20, fontFamily:'poppinsRegular', marginRight:5 }}>{category.available === "Y" ? "Available" : "Unavailable"}</Text>
              <View style={{marginTop:-2}}>
              <Octicons name="dot-fill" size={22} color={category.available === "Y" ? Color.lightgreen : "red"}/>
              </View>
            </View>
          </View>
              

          <View style={styles.row}>
          <View style={{flexDirection:'row'}}>
          <Ionicons name="checkmark-done-sharp" size={24} color="#777777" />
              <Text style={{ color: '#777777', marginLeft: 10, fontFamily:'poppinsRegular' }}>Request Done</Text>
            </View>
              <Text style={{ color: '#777777', marginLeft: 20, fontFamily:'poppinsRegular' }}>
                {requestlength.length}
              </Text>
          </View>
        </View>

    </ScrollView>
  )
}

export default HelperDetails

const styles = StyleSheet.create({
    helperdetailsscreentxt:{
        fontSize: 18,
        color: Color.darkolivegreen_100,
        fontFamily: 'poppinsSemiBold',
        left: 10,
        marginTop:10,
        marginBottom:15,
      },
    image:{
        height:120,
        width:120,
        alignSelf:'center',
        borderRadius:100
    },
    row:{
        flexDirection: 'row',
        marginBottom: 10,
        fontFamily:'poppinsRegular',
        justifyContent:'space-between'
      },
      userInfoSection1: {
        paddingHorizontal: 20,
        marginBottom: 15,
        alignSelf:'center',
        // borderWidth:1,
        padding:10,
        width: DIMENSION.WIDTH * 0.9
    },
    userInfoSection: {
        alignSelf:'center',
    },
      title:{
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'poppinsRegular'
    },
})