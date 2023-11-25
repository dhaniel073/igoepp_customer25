import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { Color, DIMENSION, marginStyle } from '../Component/Ui/GlobalStyle'
import GoBack from '../Component/Ui/GoBack'
import { AuthContext } from '../utils/AuthContext'
import { CartItemStore } from '../utils/AuthRoute'
import { Image } from 'expo-image'
import {Entypo, MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons'
import Modal from 'react-native-modal'
import Input from '../Component/Ui/Input'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'

const MarketItemPurchase = ({navigation, route}) => {
  const productId = route.params.productId
  const productName = route.params.productItemName
  const productDesc = route.params.productItemDesc
  const catId = route.params.catId
  const image = route.params.productItemimage
  const available = route.params.available
  const shippingCost = route.params.shippingCost
  const supplierId = route.params.supplierId
  const price = route.params.price
  const authCtx = useContext(AuthContext)
  const [quantity, setQuantity] = useState()
  const [quantityInvalid, setquantityInvalid] = useState(false)
  const [isQuantityModalVisible, setQuantityModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleQuantityModal = () => {
    setQuantityModalVisible(!isQuantityModalVisible)
  }

  const HandleSubmitCartItem = async () => {
    if(available !== 'Y'){
      Alert.alert('Item is out of stock', 'Please Try again Later', [
        {
          text: 'Ok',
          onPress: () => navigation.goBack(),
        }
      ])
      setQuantity(null)
    }else if(!quantity){
      Alert.alert('Empty Field', 'Quantity cannot be empty,Enter quantity needed for supply')
      setQuantity(null)
  }else{
    try {
      setIsLoading(true) 
      const response = await CartItemStore(productId,quantity,authCtx.Id,supplierId,authCtx.token)  
      // console.log(response)
      setQuantity(null)

      Alert.alert("Success", "Product added to cart successfully!",[
        {
          text: 'Ok',
          onPress: () => navigation.navigate('MarketPlace')
        }
      ])              
      setIsLoading(false)
    } catch (error) {
      // console.log(error)
      setIsLoading(true)
      Alert.alert("Error", "Error Purchasing Item, Please Try Again Later", [
        {
          text: "Ok",
          onPress: () => navigation.goBack()
        }
      ])
      setQuantity(null)
      setIsLoading(false)
    } 
  }
}


  if(isLoading){
    return <LoadingOverlay message={"..."}/>
  }
  
  return (
    <SafeAreaView style={{marginTop: marginStyle.marginTp, marginHorizontal:10, flex:1}}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <Text style={styles.markplctext}>Item Purchase</Text>

      <View style={styles.innerconatainer}>
          <View style={styles.image2container}>
            <Image
            style={styles.image2}
            // contentFit='contain'
            source={{ uri: `https://phixotech.com/igoepp/public/products/${image}` }}
            />
          </View>
        <Text style={styles.catNameText}>{productName}</Text>
        <Text style={styles.catDescText}>{productDesc}</Text>
        <Text style={styles.catDescText}>Price: N {price},  Shipping Cost: N {shippingCost}</Text>
        <Text style={styles.catDescText}>In Stock: {available === 'N' ? 'No': 'Yes'}</Text>

        <TouchableOpacity style={styles.commandButton} onPress={() => {toggleQuantityModal()}}>
          <View style={{ flexDirection:'row' }}>
            <Entypo name="shopping-cart" size={24} color="white" />
            <Text style={styles.panelBottomTitle}>Add To Cart</Text>
          </View>
        </TouchableOpacity>
      </View>
      <Modal isVisible={isQuantityModalVisible}>
        <SafeAreaView style={styles.centeredView}>
        <TouchableOpacity style={{justifyContent:'flex-end', alignSelf:'flex-end', marginBottom:5, }} onPress={() => toggleQuantityModal()}>
          <MaterialIcons name="cancel" size={30} color="white" />
        </TouchableOpacity>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Quantity</Text>
          <View style={{ marginBottom:10}}/>  

          <Input placeholder={"Enter Quantity needed"} isInvalid={quantityInvalid} value={quantity} keyboardType={"numeric"}  onUpdateValue={setQuantity} autoCapitalize='words'/>

          <View style={{marginBottom:10}}/>
          {/* <TextInput autoCapitalize=''/> */}

          <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
            <TouchableOpacity style={styles.viewbtn} onPress={toggleQuantityModal}>
              <Text style={styles.viewtext}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelbtn} onPress={ ()  => quantity === null || quantity === undefined || quantity === "" ? setquantityInvalid(true) : [toggleQuantityModal(), HandleSubmitCartItem(),]}>
              <Text style={styles.canceltext}>Submit</Text>
            </TouchableOpacity>
          </View>

          <View style={{marginBottom:10}}/>
        </View>

        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  )
}

export default MarketItemPurchase

const styles = StyleSheet.create({
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
  panelBottomTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    marginLeft:5
  },
  markplctext:{
    fontSize: 18,
    color: Color.darkolivegreen_100,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
    marginBottom:15,
  }, 
  innerconatainer:{
    marginTop: "5%"
  },
  image2container:{
    justifyContent: 'center',
    alignItems: 'center', 
  },
  image2:{
    width:  350,
    height: 350
  },
  catNameText:{
    fontSize: 18,
    // fontWeight: "700",
    fontFamily: 'poppinsBold',
    textAlign: "center",
    marginTop: 10,
    color: Color.darkolivegreen_100,
  },
  catDescText:{
    color: Color.darkolivegreen_100,
    fontFamily: 'poppinsRegular',
    fontSize: 14,
    textAlign: "center",
    marginHorizontal: 30
  },
  commandButton:{
    padding: 15,
    borderRadius: 10,
    backgroundColor: Color.limegreen,
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 25,
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
})
