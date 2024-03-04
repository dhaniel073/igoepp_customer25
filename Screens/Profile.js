import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Share } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Color, marginStyle } from '../Component/Ui/GlobalStyle'
import GoBack from '../Component/Ui/GoBack'
import {MaterialCommunityIcons, Ionicons, Octicons, Entypo} from '@expo/vector-icons'
import { Image } from 'expo-image'
import { CustomerInfoCheck, ShowFetchedRequests } from '../utils/AuthRoute'
import { AuthContext } from '../utils/AuthContext'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'

const Profile = ({navigation}) => {
  const [isloading, setIsLoading] = useState(false)
  const [reqlength, setreqlength] = useState([])
  const authCtx = useContext(AuthContext)    

  const [fetchedMessage, setFetchedMesssage] = useState([])

  useEffect(() => {
    navigation.addListener('focus', async () => {
      unsubscribe()
      requests()
    })
  }, [])
  
  
  const unsubscribe =  async () => {
    // do something
    try {
      setIsLoading(true)
      const response = await CustomerInfoCheck(authCtx.Id, authCtx.token)
      console.log(response)
      setFetchedMesssage(response)
      authCtx.customerFirstName(response.first_name)
      authCtx.customerLastName(response.last_name)
      authCtx.customerPicture(response.picture)
      authCtx.customerBalance(response.wallet_balance)
      authCtx.customerPhone(response.phone)
      authCtx.customerPoints(response.total_points)
      setIsLoading(false)
    } catch (error) {
      return;
    }
  }

  const requests = async () => {
    try {
      const response = await ShowFetchedRequests(authCtx.Id, authCtx.token)
      setreqlength(response.length)
    } catch (error) {
      return;
    }
  }

  const myCustomerShare = async () => {
    const shareOptions = {
      message: 'This is a test message',
    }

    try{
        // const share = await Sharing.isAvailableAsync(shareOptions)
        const share = await Share.share({
            message: ('Igoepp Official mobile app ' + `https://igoepp.com`),
        })
        if(share.action === Share.sharedAction){
            if(share.activityType){
            }else{
            }
        }else if(share.action === Share.dismissedAction){
        }
    }catch(error){
    }
  }

  if(isloading){
    return <LoadingOverlay message={"..."}/>
  }

  return (
    <SafeAreaView style={[styles.container, {marginTop:marginStyle.marginTp, marginHorizontal:10}]}>
    <View style={{flexDirection:'row',  justifyContent:'space-between'}}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <MaterialCommunityIcons style={{paddingRight:3,}} name="note-edit" size={24} color={Color.limegreen} onPress={() => navigation.navigate('ProfileEdit',{
        firstName: fetchedMessage.first_name,
        lastName: fetchedMessage.last_name,
        Country: fetchedMessage.Country,
        State: fetchedMessage.State,
        lga: fetchedMessage.lga,
        Phone: fetchedMessage.phone,
        Sex: fetchedMessage.sex,
        Dob: fetchedMessage.dob,
        Address: fetchedMessage.address
      })}/>
    </View>
    
      <View style={styles.userInfoSection}>
        <View style={{ flexDirection:'row', marginTop: 15 }}>
          {
          fetchedMessage.picture === null || '' ? 
          <TouchableOpacity onPress={() => navigation.navigate('ProfilePicsView')}>
            <Image style={{ width: 80, height: 80, borderWidth:1, borderColor: Color.darkolivegreen_100, borderRadius: 50 }} source={require("../assets/person-4.png")}/>
          </TouchableOpacity>
          : 
          <TouchableOpacity  onPress={() => navigation.navigate('ProfilePicsView')}>
            <Image style={{ width: 80, height: 80, borderWidth:1, borderColor: Color.darkolivegreen_100, borderRadius: 50 }} size={80} source={{ uri: `https://phixotech.com/igoepp/public/customers/${fetchedMessage.picture}`}}/>
          </TouchableOpacity>
          }
          <View style={{ marginLeft: 10  }}>
            <View style={{ flexDirection:'row'}}>
              <Text style={[styles.title , {marginTop: 15}]}>{fetchedMessage.first_name}</Text>
              <Text style={[styles.title,  {marginTop: 15}]}> {fetchedMessage.last_name}</Text>
            </View>
            <Text style={styles.caption}>{fetchedMessage.email}</Text>
          </View>
        </View>
      </View>
        
        <View style={styles.userInfoSection}>
          <View style={styles.row}>
            <Ionicons name="location" color="#777777" size={20}/>
            <Text style= {{ color: '#777777', marginLeft: 20, fontFamily:'poppinsRegular' }}>{fetchedMessage.Country === null ? "Nill" : fetchedMessage.Country} {fetchedMessage.State === null ? "Nill" : fetchedMessage.State} {fetchedMessage.lga === null ? "Nill" : fetchedMessage.lga}</Text>
          </View>

          <View style={styles.row}>
            <Entypo name="address" size={24} color="#777777"/>
            <Text style= {{ color: '#777777', marginLeft: 20, fontFamily:'poppinsRegular'}}>{fetchedMessage.address === null ? "Nill" : fetchedMessage.address}</Text>
          </View>


          <View style={styles.row}>
            <Ionicons name="call" color="#777777" size={20}/>
            <Text style= {{ color: '#777777', marginLeft: 20, fontFamily:'poppinsRegular' }}>{fetchedMessage.phone}</Text>
          </View>

            <View style={styles.row}>
                <Ionicons name="mail" color="#777777" size={20}/>
                <Text style=    {{ color: '#777777', marginLeft: 20, fontFamily:'poppinsRegular' }}>{fetchedMessage.email}</Text>
            </View>
        </View>

        <View style={styles.inforBoxWrapper}>
            <View style={[styles.infoBox, {borderRightColor: "#dddddd", borderRightWidth: 1}]}>
                <View style={{ flexDirection:'row' }}>
                    
                    <Text  style={{fontSize: 18}}>{authCtx.balance.toLocaleString()}</Text>

                </View>
                <Text>Wallet balance</Text>
            </View>

            <View style={styles.infoBox}>

                {/* <Title>{authCtx.request}</Title> */}
                <Text style={{fontSize: 18}}>{reqlength}</Text>
                <Text>Requests Made</Text>
            </View>
        </View>

        <View style={styles.menuWrapper}>
            <TouchableOpacity onPress={() => navigation.navigate('CartHistory')}>
                <View style={styles.menuItem}>
                  <Octicons name="history" size={25} color={Color.limegreen} />
                    <Text style={styles.menuItemText}>Cart History</Text>
                </View>
            </TouchableOpacity>

            {/* <TouchableOpacity onPress={() => {}}>
                <View style={styles.menuItem}>
                    <Ionicons name="heart-outline" size={25} color={Color.limegreen}/>
                    <Text style={styles.menuItemText}>Wallet History</Text>
                </View>
            </TouchableOpacity> */}

            <TouchableOpacity onPress={() => navigation.navigate('Payments')}>
                <View style={styles.menuItem}>
                    <Ionicons name="card-outline" size={25} color={Color.limegreen}/>
                    <Text style={styles.menuItemText}>Payments</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={myCustomerShare }>
                <View style={styles.menuItem}>
                    <Ionicons name="share-outline" size={25} color={Color.limegreen}/>
                    <Text style={styles.menuItemText}>Tell Your Friends</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {}}>
                <View style={styles.menuItem}>
                    <Ionicons name="man" size={25} color={Color.limegreen}/>
                    <Text style={styles.menuItemText}>Support</Text>
                </View>
            </TouchableOpacity>

            
        </View>
    </SafeAreaView>
  )
}

export default Profile

const styles = StyleSheet.create({
  addtowalletpaymentxt:{
    fontSize: 18,
    color: Color.darkolivegreen_100,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
    marginBottom:15,
  },
  userInfoSection: {
    paddingHorizontal: 20,
    marginBottom: 20
  },
  title:{
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'poppinsRegular'
  },
  caption:{
    fontSize: 12,
    // lineHeight: 14,
    fontFamily: 'poppinsRegular',

  },
  row:{
    flexDirection: 'row',
    marginBottom: 10,
    fontFamily:'poppinsRegular'
  },
  inforBoxWrapper:{
    borderBottom: '#dddddd',
    borderBottomWidth: 1,
    borderTopColor: "#dddddd",
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 100
  },
  infoBox: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  menuWrapper:{
    marginTop: 20
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 30
  },
  menuItemText: {
    color: '#777777',
    marginLeft: 20,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26
  }
 
})