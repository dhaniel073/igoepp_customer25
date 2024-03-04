import { Alert, FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Border, Color, DIMENSION, marginStyle } from '../Component/Ui/GlobalStyle'
import GoBack from '../Component/Ui/GoBack'
import { AllTransaction } from '../utils/AuthRoute'
import { AuthContext } from '../utils/AuthContext'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'

const Payments = ({navigation}) => {
  const authCtx = useContext(AuthContext)
  const [PaymentHis, setPaymentHis] = useState([])
  const [refresh, setRefresh] = useState(false)
  const [isloading, setisloading] = useState(false)


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async() => {
      // do something
      try {
        setisloading(true)
        const response = await AllTransaction(authCtx.Id, authCtx.token)
        // console.log(response)
        setPaymentHis(response)
        setisloading(false)
      } catch (error) {
        setisloading(true)
        // console.log(error)
        Alert.alert("Error", "Error fetching Payment History", [
          {
            text: "Ok",
            onPress: () => navigation.goBack()
          }
        ])
        setisloading(false)
      }
    });
    return unsubscribe;
  }, []);

  const pullMe = () => {
    setRefresh(true)
    setTimeout(async() => {
      const response = await AllTransaction(authCtx.Id, authCtx.token)
      setPaymentHis(response)
      setRefresh(false)
    }, 4000)
  }

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
    <SafeAreaView style={{marginTop: marginStyle.marginTp, marginHorizontal:10, flex:1}}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <Text style={styles.paymenttxt}>Payments</Text>

      {
        PaymentHis.length === 0 ? <NoSubCategoryNote/>
        
        :
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={() => {pullMe()}}
            />
          }
          data={PaymentHis}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <View style={styles.pressable}>
              <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                <Text style={styles.textAmount}>NGN {item.amount}</Text>
                <Text>{item.tran_date}</Text>
              </View>
            </View>
          )}  
        />
      }

    </SafeAreaView>
  )
}

export default Payments

const styles = StyleSheet.create({
  paymenttxt:{
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
    margin:2.5,
    borderRadius: Border.br_3xs,
    padding:16,
  },
  textAmount:{
    fontFamily: 'poppinsSemiBold',
    color:Color.tomato
  }
})