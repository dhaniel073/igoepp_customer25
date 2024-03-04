import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import GoBack from '../Component/Ui/GoBack'
import { Border, Color, DIMENSION, marginStyle } from '../Component/Ui/GlobalStyle'
import { AuthContext } from '../utils/AuthContext'
import { CartHistoryPreview, CartPurchase } from '../utils/AuthRoute'
import Modal from 'react-native-modal'
import {MaterialIcons} from '@expo/vector-icons'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'
import { Image } from 'expo-image'

const CartHistory = ({navigation}) => {
    const [isloading, setisloading] = useState(false)
    const [ischecking, setischecking] = useState(false)
    const [carthistory, setcarthistory] = useState([])
    const authCtx = useContext(AuthContext)
    const [isviewbyid, setisviewbyid] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [purchaseid, setpurchaseid] = useState()


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
        try {
        setisloading(true)
        const response = await CartPurchase(authCtx.Id, authCtx.token)
        // console.log(response)
        setcarthistory(response)
        setisloading(false)
        } catch (error) {
          setisloading(true)
          setisloading(false)
          return
        // console.log(error.response.data)
        }
        })
    },[])

    const viewdetails = async (purchase_id) => {
      // do something
      try {
        setischecking(true)
        const response = await CartHistoryPreview(purchase_id, authCtx.token)
        console.log(response)
        setisviewbyid(response)
        setischecking(false)
      } catch (error) {
        setischecking(true)
        // console.log(error)
        setischecking(false)
        return;
      }
    };

    const toggleViewbyIdModal = (id) => {
        setIsModalVisible(!isModalVisible)
        setpurchaseid(id)
    }

    // console.log(purchaseid)

    const NoSubCategoryNote = () => {
      return (
        <View style={{ justifyContent:'center', alignItems:'center', marginTop: DIMENSION.HEIGHT * 0.33}}>
          <Text style={{ fontSize: 14, color: 'grey', fontFamily: 'poppinsSemiBold' }}>No Record Found</Text>
        </View>
      )
    }
    
    if(isloading){
      return <LoadingOverlay message={"..."}/>
    }

  return (
    <SafeAreaView style={{marginTop:marginStyle.marginTp, marginHorizontal:10, flex:1}}>
        <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <Text style={styles.carthistorytxt}>Cart History</Text>

    {
        carthistory.length === 0 ? <NoSubCategoryNote/>
        :
    <FlatList
        showsVerticalScrollIndicator={false}
        style={{marginTop:15,marginBottom:'10%'}}
        data={carthistory}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <TouchableOpacity style={styles.pressable} onPress={() => [toggleViewbyIdModal(), viewdetails(item.purchase_id)]}>

            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <Text style={styles.textAmount}>NGN {item.total_amount.toLocaleString()}</Text>
            <Text style={[{color: Color.limegreen, fontSize:12, fontFamily:'poppinsRegular'}]}>{item.status === 'P' ? 'Paid' : 'Not Paid'}</Text>
            </View>

            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <Text style={[styles.requestDate, {fontSize:14}]}>Quantity : {item.total_quantity}</Text>
            <Text style={[styles.requestDate, {}]}>{item.created_at}</Text>
            </View>

            <Text style={{position:'absolute', fontSize:11, left:'46%', top:5}}>Tap to view</Text>
          </TouchableOpacity>
        )}
      />
      }

      <Modal isVisible={isModalVisible}>
        <SafeAreaView style={styles.centeredView}>

            <TouchableOpacity style={{justifyContent:'flex-end', alignSelf:'flex-end', marginBottom:5, }} onPress={() => toggleViewbyIdModal()}>
              <MaterialIcons name="cancel" size={30} color="white" />
            </TouchableOpacity>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Details</Text>

                {ischecking ? <LoadingOverlay/> : 
                <FlatList
                  data={isviewbyid}
                  keyExtractor={(item) => item.id}
                  renderItem={({item}) => (
                   
                   <View style={{marginTop:15}}>
                    <Image source={require("../assets/igoepp_transparent2.png")} style={{height:110, width:110, position:'absolute', alignContent:'center', alignSelf:'center', top:DIMENSION.HEIGHT * 0.02,justifyContent:'center', opacity:0.3, }} contentFit='contain'/>
                      
                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Price :</Text>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.price}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row',  alignItems:'center', }}>
                        <Text style={{marginRight: 20, marginBottom:5, fontSize:11}}>Description :</Text>
                        <Text style={{fontFamily:'poppinsRegular', maxWidth:'70%', textAlign:'right', fontSize:11}}>{item.description}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Item Name :</Text>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.name}</Text>
                      </View>


                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Quantity Purchased :</Text>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.quantity}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Shipping Cost :</Text>
                        <Text style={{fontFamily:'poppinsRegular', maxWidth:'80%', fontSize:11}}>{item.shipping_cost}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Serial Number :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.id}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Subtotal :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.sub_total_amount}</Text>
                      </View>
                    </View>
                  )}    
                />
              }
              <View style={{ marginBottom:20}}/>  
            </View>
            </SafeAreaView>
        </Modal>
    </SafeAreaView>
  )
}

export default CartHistory

const styles = StyleSheet.create({
    carthistorytxt:{
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
        margin:3,
        borderRadius: Border.br_3xs,
        padding:13,
    },
    textAmount:{
        fontFamily:'poppinsSemiBold',
        color: Color.tomato
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