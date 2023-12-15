import { Alert, SafeAreaView, StyleSheet, Text, View, FlatList, TouchableOpacity, Pressable, Platform } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { Border, Color, DIMENSION, marginStyle } from '../Component/Ui/GlobalStyle'
import { AuthContext } from '../utils/AuthContext'
import { Cart, DeleteFromCart } from '../utils/AuthRoute'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'
import GoBack from '../Component/Ui/GoBack'
import {MaterialIcons, Fontisto} from '@expo/vector-icons'

const CartView = ({navigation}) => {
  const [cartitems, setCartItems] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const authCtx = useContext(AuthContext)
    let priceArray = 0
  
    useEffect(() => {
     const unsuscribe = navigation.addListener('focus', async() => {
        try {
          setIsLoading(true)
          const response = await Cart(authCtx.Id, authCtx.token)
          // console.log(response)
          setCartItems(response)
          // console.log(response)
          setIsLoading(false)
        } catch (error) {
          // console.log(error)
          setIsLoading(true)
          Alert.alert('Error', 'Sorry an error occured', [
            {
              text: "Ok",
              onPress: navigation.goBack()
            }
          ])
          setIsLoading(false)
          return;
        }
      })
      return unsuscribe;
    }, [])


  const check = () => {
    for (let i = 0; i < cartitems.length; i++ ) {
      priceArray += cartitems[i].sub_total_amount 
    }
  }
  
  check()

  const DeleteHandler = async(id) => {
    // console.log(id)
    try {
      setIsLoading(true)
      const response = await DeleteFromCart(id, authCtx.token) 
      // console.log(res.data)
      Alert.alert('Success', 'Item removed successfully from cart', [
        {
          text: "Ok",
          onPress: () => navigation.goBack()
        }
      ])
      // navigation.goBack()
      setIsLoading(false)
    } catch (error) {
      // console.log(error.response.data)
      Alert.alert('Error', 'An error occured', [
        {
          text: "Ok",
          onPress: () => navigation.goBack()
        }
      ])
      return;
    } 
  }


const NoCartItemNote = () => {
  return (
    <View style={{ justifyContent:'center', alignItems:'center', marginTop: DIMENSION.HEIGHT * 0.33}}>
      <Text style={{ fontSize:16, color: 'grey', fontFamily: 'poppinsSemiBold' }}>No cart item found</Text>
      <TouchableOpacity onPress={()=> navigation.navigate('MarketPlace')}>
        <Text style={{  fontSize: 14, color:Color.limegreen, fontFamily: 'poppinsSemiBold'  }}>Purchase Item</Text>
      </TouchableOpacity>
    </View>
  )
}


  if(isLoading){
    return <LoadingOverlay message={"..."}/>
  }

  return (
    <SafeAreaView style={{marginTop:marginStyle.marginTp, marginHorizontal:10, flex:1}}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <Text style={styles.carttxt}>Cart</Text>

      {cartitems.length === 0 ? <NoCartItemNote/> :
      <>
      <FlatList
        data={cartitems}
        keyExtractor={(item)=> item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => 
        <View style={[styles.container, {marginTop:3}]}>
          <Text style={styles.requestDate}>{item.created_at}</Text>
          <Pressable style={[styles.pressable, {marginBottom:20}]}>
          <TouchableOpacity style={{alignSelf:'flex-end', position:'absolute', right:15, top:10}} onPress={() => Alert.alert('Remove Item', 'Are you sure you want to remove this item from cart', [
          {
            text: "No",
            onPress: () => {}
          }, {
            text: "Yes",
            onPress: () => DeleteHandler(item.id)
          }
          ])}>
              <MaterialIcons style={{bottom:5}} name="cancel" size={22} color={Color.tomato} />
            </TouchableOpacity>
            <View>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <Text style={styles.requestName}>NGN {item.price.toLocaleString()}</Text>
            </View>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <Text style={{ fontFamily: 'poppinsSemiBold',color:Color.tomato }}>Total: NGN {item.sub_total_amount.toLocaleString()}</Text>
              <Text style={{ color:Color.tomato, fontFamily: 'poppinsSemiBold'}}>Quantity: {item.quantity}</Text>
            </View>
            </View>
            {/* <TouchableOpacity style={{alignSelf:'flex-end', position:'absolute', top:10, right:13}} onPress={() => {DeletItemFromCart(item.id)}}>
              <MaterialIcons style={{bottom:5}} name="cancel" size={22} color={Color.tomato} />
            </TouchableOpacity> */}
          </Pressable>
            </View>
            }
            />

            
            <TouchableOpacity onPress={() => navigation.navigate('CheckOut', {price: priceArray})} style={{marginTop:DIMENSION.HEIGHT * 0.5,alignItems:'center', justifyContent:'center', position:'absolute', right:5,  shadowColor: 'black', shadowOpacity: 0.25,shadowOffset: {width: 0, height: 2}, shadowRadius: 20, padding:10, borderRadius:30 }}>
              {/* <Image source={require("../assets/payment1.jpeg")} style={{height:50, width:50, borderRadius: 50, alignItems:'baseline', justifyContent:'center'}}/> */}
              <Fontisto name="wallet" size={28} color={Color.darkolivegreen_100} />
              <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>CheckOut</Text>
            </TouchableOpacity>
          </>
        }
    </SafeAreaView>
  )
}

export default CartView

const styles = StyleSheet.create({
  requestDate:{
    marginHorizontal: 10,
    fontSize: 14,
    fontFamily: 'poppinsRegular'
  },
  carttxt:{
    fontSize: 18,
    color: Color.darkolivegreen_100,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
    marginBottom:10,
  }, 
  pressable:{
    backgroundColor: Color.mintcream,
    borderColor: "rgba(151, 173, 182, 0.2)",
    borderWidth: 1,
    borderStyle: "solid",
    margin:2,
    borderRadius: Border.br_3xs,
    padding:20,
  },
  
})