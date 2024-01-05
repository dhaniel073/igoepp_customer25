import { Alert, FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Color, DIMENSION, marginStyle } from '../Component/Ui/GlobalStyle'
import GoBack from '../Component/Ui/GoBack'
import { AuthContext } from '../utils/AuthContext'
import axios from 'axios'
import { Image } from 'expo-image'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'
import { WalletBalance } from '../utils/AuthRoute'

const BillPayment = ({navigation}) => {
  const [category, setcategory] = useState()
  const [isloading, setisloading] = useState(false)
  const authCtx = useContext(AuthContext)
 
  useEffect(() => {
      navigation.addListener('focus', async () => {
      Billers()
      WalletCheck()
    })
  }, [])

  const Billers = async() => {
    setisloading(true)
    try {
      const url = `https://igoeppms.com/igoepp/public/api/auth/billpayment/getBillCategory`
      const response = await axios.get(url, {
        headers:{
          Accept: 'application/json',
          Authorization: `Bearer ${authCtx.token}`
        }
      })
      // console.log(response)
    setcategory(response.data)
    setisloading(false)
    } catch (error) {

      // console.log(error.response)
      Alert.alert("Error", "An error occured try plaese again later", [
        {
          text: "Ok",
          onPress: () => navigation.goBack()
        }
      ])
      return;
    }
  }

  const WalletCheck = async () => {
    try {
      const response =  await WalletBalance(authCtx.Id, authCtx.token)
      authCtx.customerBalance(response.wallet_balance)
    } catch (error) {
      // console.log(error.response)
      return;
    }
  }

  if(isloading){
    return <LoadingOverlay message={"..."}/>
  }

  return (
    <View style={{marginTop: marginStyle.marginTp, marginHorizontal:10}}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <Text style={styles.billpaymenttxt}>BillPayment</Text>

      <View style={{marginTop:10}}>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={category}
        style={{marginBottom: '10%'}}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <View style={styles.billscontainer}>
            <TouchableOpacity style={styles.pressables} onPress={() => {
              item.id === "vtu" && navigation.navigate('VirtualTopup', {name:item.name,id:item.id  })
              item.id === "disco" && navigation.navigate('Disco', {name:item.name,id:item.id})
              item.id === "bet" && navigation.navigate('Bet', {name:item.name,id:item.id  })
              item.id === "internet" && navigation.navigate('Internet', {name:item.name,id:item.id  })
              item.id === "education" && navigation.navigate('Education', {name:item.name,id:item.id  })
              item.id === "tv" && navigation.navigate('Television', {name:item.name,id:item.id  })
            }
            }>

              <Image style={styles.image} source={{uri: item.imagePath}}/>

                  <Text style={styles.item}>
                    {item.id === 'vtu' ? "Airtime" 
                    :  item.id === 'bet' ? "Bet" 
                    :  item.id === 'disco' ? "Electricity" 
                    :  item.id === 'tv' ? "MultiChoice" 
                    :  item.id === 'education' ? "WAEC Card" 
                    :  item.id === 'internet' ? "Internet" 
                    :""
                    }
                  </Text>
            </TouchableOpacity>
          </View>
        )}
      />
      </View>
    </View>
  )
}

export default BillPayment

const styles = StyleSheet.create({
  item:{
    fontSize:12
  },
  pressables:{
    padding:20,
    width: DIMENSION.WIDTH *0.43,
    margin:5,
    height:DIMENSION.HEIGHT *0.17,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    elevation: 4,
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    // backgroundColor: Color.mintcream,
    backgroundColor:'white',
    overflow: Platform.OS === 'andriod' ? 'hidden' : 'visible',
  },
  billpaymenttxt:{
    fontSize: 18,
    color: Color.darkolivegreen_100,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
    marginBottom:15,
  },
  billscontainer:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  }, 
  image:{
    width: 60,
    height: 60,
    marginHorizontal: 10,
    marginTop: 10,
    alignSelf:'center'
  },
})