import { FlatList, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Color, DIMENSION, marginStyle } from '../Component/Ui/GlobalStyle'
import GoBack from "../Component/Ui/GoBack"
import { Image, ImageBackground } from 'expo-image'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'
import { Cart, Category, WalletBalance } from '../utils/AuthRoute'
import { AuthContext } from '../utils/AuthContext'
import {AntDesign, MaterialIcons} from '@expo/vector-icons'

const MarketPlace = ({navigation}) => {
  const [fetchedcategory, setFetchedCategory] = useState([])
  const [isFetching, setIsFetching] = useState(false)
  const authCtx = useContext(AuthContext) 
  const [cartlength, setcartlength] = useState()

  useEffect(() => {
    const unsuscribe = navigation.addListener('focus', async() => {
      try {
        setIsFetching(true)
        const response = await Category()
        setFetchedCategory(response)
        setIsFetching(false)
        setIsFetching(false)
      } catch (error) {
        setIsFetching(true)
        setIsFetching(false)
        // console.log(error)
        return;
      }
    })
    return unsuscribe;
  },[])  

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

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async() => {
      try {
        const response = await Cart(authCtx.Id, authCtx.token)
        const length = response.length
        setcartlength(length)
        // const length = res.data.data.length.toString()
      } catch (error) {
        // console.log(error)\
        return;
      }
    })
    return unsubscribe;
  },[])

  if(isFetching){
    return <LoadingOverlay message={"..."}/>
  }


  return (
    <SafeAreaView style={{marginTop: marginStyle.marginTp, marginHorizontal:10, flex:1}}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <View style={{flexDirection:'row', justifyContent:'space-between'}}>
        <Text style={styles.mrkplacetxt}>MarketPlace</Text>
        <Text style={styles.name}>Hi {authCtx.firstname}</Text>
      </View>
      <TouchableOpacity style={{ justifyContent:'center', position:'absolute', alignSelf:'flex-end', alignItems:'center', right:50 }} onPress={() => navigation.navigate('CartHistory')}>
        <MaterialIcons name="history-toggle-off" size={24} color="black" />
        {/* <Text style={{fontSize:10}}>History</Text> */}
      </TouchableOpacity>
      <TouchableOpacity style={{ justifyContent:'center', position:'absolute', alignSelf:'flex-end', right:13 }} onPress={() => navigation.navigate('CartView')}>
        <View style={{ flexDirection:'row' }}>
          <AntDesign name="shoppingcart" size={24} color={Color.darkolivegreen_100} />

          {
            cartlength === 0 ? null :
            <ImageBackground  source={require("../assets/ellipse-127.png")} style={{height:18, width:18, justifyContent:'center', marginLeft:-6, marginTop:-4}}>
              <Text style={{ fontSize: 8,  color: Color.white, fontFamily:'poppinsBold', textAlign:'center'}}>{cartlength}</Text>
            </ImageBackground>
          }
        </View>
      </TouchableOpacity>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={fetchedcategory}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => 
          <View style={styles.container}  >
            <TouchableOpacity style={[styles.pressables]} onPress={() => navigation.navigate("MarketPlaceItem", {
              categoryId: item.id,
              categoryName: item.cat_name,
              categoryDesc: item.cat_desc,
              first_name: authCtx.firstname
            })}>
              <Image style={styles.image2} source={{ uri:`https://phixotech.com/igoepp/public/category/${item.image}`  }}/>
              <Text style={styles.item}>{item.cat_name}</Text>
            </TouchableOpacity>
          </View>
            }
        numColumns={2}
        /> 
    </SafeAreaView>
  )
}

export default MarketPlace

const styles = StyleSheet.create({
  name:{
    fontFamily: 'poppinsRegular',
    fontSize: 11,
    color: Color.limegreen,
    marginRight: 10,
    marginTop: 16
  },
  mrkplacetxt:{
    fontSize: 18,
    color: Color.darkolivegreen_100,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
    marginBottom:15,
  },
  name:{
    fontFamily: 'poppinsRegular',
    fontSize: 11,
    color: Color.limegreen,
    marginRight: 10,
    marginTop: 16
  },
  pressables:{
    padding:20,
    width: DIMENSION.WIDTH *0.43,
    margin:10,
    height:DIMENSION.HEIGHT *0.17,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    elevation: 4,
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    backgroundColor: Color.mintcream,
    overflow: Platform.OS === 'andriod' ? 'hidden' : 'visible',
  },
  image2:{
    width: 50,
    height: 50,
    marginBottom: 15
  },
  item: {
    fontSize: 10,
    fontFamily: 'poppinsSemiBold',
    textAlign: 'center',
    color: Color.darkolivegreen_100
  }, 
})