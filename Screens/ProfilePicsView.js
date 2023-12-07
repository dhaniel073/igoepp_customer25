import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Color, marginStyle } from '../Component/Ui/GlobalStyle'
import {AntDesign} from '@expo/vector-icons'
import { Image } from 'expo-image'
import { CustomerInfoCheck } from '../utils/AuthRoute'
import { AuthContext } from '../utils/AuthContext'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'

const ProfilePicsView = ({navigation}) => {
  const authCtx = useContext(AuthContext)
  const [photo, setphoto] = useState('')
  const [isloading, setisloading] = useState(false)

  useEffect(() => {
    const customerget = navigation.addListener ('focus', async () => {
      try {
        setisloading(true)
        const response = await CustomerInfoCheck(authCtx.Id, authCtx.token)
        // console.log(response)
        setphoto(response.picture)
        authCtx.customerPicture(response.picture)
        setisloading(false)
      } catch (error) {
        setisloading(true)
        setisloading(false)
        return;
      }
    })
    return customerget;
  }, [])

  if(isloading){
    return <LoadingOverlay message={"..."}/>
  }


  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack() } style={{marginHorizontal:10}}>
          <AntDesign name="arrowleft" size={24} color={Color.orange_100} />  
      </TouchableOpacity>

      <View style={styles.imageContainer}>
        {
            photo === null || photo === undefined || photo === "null" || photo === "" ? 
          <Image style={[styles.image, ]} source={require("../assets/person-4.png")} contentFit='contain'/>
          :
          <Image style={[styles.image, ]} source={{uri: `https://phixotech.com/igoepp/public/customers/${photo}`}}  contentFit='contain'/>

        }
      </View>
    </SafeAreaView>
  )
}

export default ProfilePicsView

const styles = StyleSheet.create({
    imageContainer:{
      flex:1,
      marginBottom:'20%'
    },
    container: {
      flex: 1,
      marginTop:marginStyle.marginTp,
    },
    image:{
      flex:1,
      width: "100%",
    },
})