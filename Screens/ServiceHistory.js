import { Alert, StyleSheet, Text, TouchableOpacity, View, SafeAreaView, FlatList, ScrollView, TextInput, Platform } from 'react-native'
import React, { useEffect, useContext, useState } from 'react'
import { Border, Color, DIMENSION, marginStyle } from '../Component/Ui/GlobalStyle'
import GoBack from '../Component/Ui/GoBack'
import { ShowFetchedRequests, ShowFetchedRequestsById } from '../utils/AuthRoute'
import {MaterialIcons, FontAwesome5} from '@expo/vector-icons'
import  Modal from 'react-native-modal'
import Input from '../Component/Ui/Input'
import { AuthContext } from '../utils/AuthContext'
import filter from "lodash.filter";
import LoadingOverlay from '../Component/Ui/LoadingOverlay'
import { Image } from 'expo-image'


const ServiceHistory = ({navigation}) => {
  const authCtx = useContext(AuthContext)
  const [isFetching, setIsFetching] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [fetchedRequest, setFetchedRequest] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [status, setStatus] = useState('')
  const [view, setView] = useState('')
  const [isViewModalVisible, setViewModalVisible] = useState(false);
  const [fullData, setFullData] = useState([])
  const customerId = authCtx.Id
  const token = authCtx.token

    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', async() => {
        // do something
        try{
          setIsFetching(true)
          const response = await ShowFetchedRequests(customerId, token)
          // console.log(response)
          setFetchedRequest(response)
          setFullData(response)
          setIsFetching(false)
      }catch(error){
          setIsFetching(true)
          Alert.alert("Error", "Error Fetching Service History", [
              {
                text: "Ok",
                onPress: () => navigation.goBack()
              }
            ])
          setIsFetching(false)
      }
      });
      return unsubscribe;
    }, [navigation]);

    console.log(fetchedRequest.length)

    // console.log(fullData)
    const handleSearch = (query) => {
      setSearchQuery(query)
      const formattedQuery = query
      const filteredData = filter(fullData, (cat_name) => {
          return contains(cat_name, formattedQuery)
      })
      // console.log(filteredData)
      setFetchedRequest(filteredData)
    }

    const toggleViewModal = (id, stats) => {
      // console.log(id, stats)
      setStatus(stats)
      setViewModalVisible(!isViewModalVisible)
    }

    const ViewRequests = async (id) => {
      try {
        setIsLoading(true)
        const response = await ShowFetchedRequestsById(id, authCtx.token)
        // console.log(response)
        setView(response)
        setIsLoading(false)
      } catch (error) {
        setIsLoading(true)
        // console.log(error)
        setIsLoading(false)
        return;
      }
    }
    const contains = ({cat_name, help_country, help_state, help_lga,}, query) => {
      // const name = cat_name.includes('L')
      if(cat_name.includes(query) || help_country.includes(query) || help_state.includes(query) || help_lga.includes(query)){
          return true
      }
      return false
  }

  const NoHistoryNote = () => {
    return (
      <View style={{ justifyContent:'center', alignItems:'center', marginTop: DIMENSION.HEIGHT * 0.33}}>
        <Text style={{ fontSize: 14, color: 'grey', fontFamily: 'poppinsSemiBold' }}>No Service History </Text>
        <TouchableOpacity onPress={() => navigation.navigate('RequestHelp')}>
          <Text style={{ fontFamily: 'poppinsRegular', marginTop: 10, color: Color.limegreen }}>Make Request</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if(isFetching){
    return <LoadingOverlay message={"..."}/>
  }



  return (
    <SafeAreaView style={{marginTop: marginStyle.marginTp, marginHorizontal:10}}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <Text style={styles.servicehistorytxt}>Service History</Text>
      <View>
        <TextInput
          placeholder="Search"
          style={styles.searchInput}
          clearButtonMode="always"
          // autoCapitalize=""
          autoCorrect={false}
          value={searchQuery}
          onChangeText={(query) => handleSearch(query)}
        />
      </View>
      {fetchedRequest.length === 0 ? <NoHistoryNote/> :
        <>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={fetchedRequest}
        style={{ marginBottom: 15 }}
        key={(item) => item.id}
        renderItem={({item}) => 
        <View style={{ flex:1 }}>
        {item.help_status === 'C' && item.start_request_time !== null && item.end_request_time !== null  ?
          <>
        {/* <Text style={styles.serviceDate}>{item.created_at}</Text> */}
            <TouchableOpacity style={[styles.pressable]} onPress={() => [ViewRequests(item.id), toggleViewModal(item.id, item.help_status
              )]}>
              <View>
                <Text style={styles.serviceName}>{item.cat_name}</Text>
              </View>
              <Text  style={{fontSize:10, position:'absolute', alignSelf:'flex-end', top:13, right:10, fontFamily: 'poppinsBold', color: Color.tomato, marginRight:20 }}>{item.help_status === 'X' ? 'Cancelled': item.help_status === 'C' ? 'Completed' : "Active" }</Text>
              <Text  style={{fontSize:10, position:'absolute', alignSelf:'flex-end', top:13, right:'40%', fontFamily: 'poppinsBold',  marginRight:20 }}>{item.help_date}</Text>
                  
              <View style={{flexDirection:'row', justifyContent:'space-between', marginLeft:10, marginRight:18}}>
                <Text style={{ fontFamily: 'poppinsRegular', fontSize:11}}> <FontAwesome5 name="city" size={14} color={Color.tomato} /> {item.help_lga}</Text>
                <Text style={{fontSize:11}}>Tap to View</Text>
              </View>
            </TouchableOpacity>
            </>

          : item.help_status === "X"  &&
          <TouchableOpacity style={[styles.pressable]} onPress={() => [ViewRequests(item.id), toggleViewModal(item.id, item.help_status
            )]}>
            <View>
              <Text style={styles.serviceName}>{item.cat_name}</Text>
            </View>
            <Text  style={{fontSize:10, position:'absolute', alignSelf:'flex-end', top:13, right:10, fontFamily: 'poppinsBold', color: Color.tomato, marginRight:20 }}>{item.help_status === 'X' ? 'Cancelled': item.help_status === 'C' ? 'Completed' : "Active" }</Text>
            <Text  style={{fontSize:10, position:'absolute', alignSelf:'flex-end', top:13, right:'40%', fontFamily: 'poppinsBold',  marginRight:20 }}>{item.help_date}</Text>
                
            <View style={{flexDirection:'row', justifyContent:'space-between', marginLeft:10, marginRight:18}}>
              <Text style={{ fontFamily: 'poppinsRegular', fontSize:11}}> <FontAwesome5 name="city" size={14} color={Color.tomato} /> {item.help_lga}</Text>
              <Text style={{fontSize:11}}>Tap to View</Text>
            </View>
          </TouchableOpacity>
        }

      </View>
        }
      />
      </>
      }
      <Modal isVisible={isViewModalVisible}>
            <SafeAreaView style={styles.centeredView}>

            <TouchableOpacity style={{justifyContent:'flex-end', alignSelf:'flex-end', marginBottom:5, }} onPress={() => toggleViewModal()}>
              <MaterialIcons name="cancel" size={30} color="white" />
            </TouchableOpacity>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Details</Text>

                {isLoading ? <LoadingOverlay/> : 
                <FlatList
                  data={view}
                  keyExtractor={(item) => item.id}
                  renderItem={({item}) => (
                    <View>
                        {
                          Platform.OS === 'android' ?
                            <Image source={require("../assets/igoepp_transparent2.png")} style={{height:130, width:130, position:'absolute', alignContent:'center', alignSelf:'center', top:DIMENSION.HEIGHT * 0.1,justifyContent:'center', opacity:0.3, }} contentFit='contain'/>
                          :
                          <Image source={require("../assets/igoepp_transparent2.png")} style={{height:130, width:130, position:'absolute', alignContent:'center', alignSelf:'center', top:DIMENSION.HEIGHT * 0.05,justifyContent:'center', opacity:0.3, }} contentFit='contain'/>
                        }

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Price : </Text>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.agreed_price === null ? '0.00' : item.agreed_price}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row',  alignItems:'center', }}>
                        <Text style={{marginRight: 20, marginBottom:5, fontSize:11}}>Description :</Text>
                        <Text style={{fontFamily:'poppinsRegular', maxWidth:'70%', textAlign:'right', fontSize:11}}>{item.help_desc}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Help Intervals :</Text>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.help_frequency}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Landmark :</Text>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.help_landmark}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Request Type :</Text>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.preassessment_flg === "N" ? "Normal Request" : "Preassessment Request"}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Address :</Text>
                        <Text style={{fontFamily:'poppinsRegular', maxWidth:'80%', fontSize:11}}>{item.help_location}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Country :</Text>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.help_country}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>State :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.help_state}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>L.G.A :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.help_lga}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Help Size :</Text>
                        <Text  style={{fontFamily:'poppinsRegular',fontSize:11}}>{item.help_size}</Text>
                      </View>
                      
                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular',  fontSize:11}}>Landmark :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.help_landmark}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Status :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.help_status === "A" ? "Active" : item.help_status === "N" ? "Negotiating" : item.help_status === "C" ? "Completed" : "Cancelled"}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Date :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.help_date}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Time :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.help_time}</Text>
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

export default ServiceHistory

const styles = StyleSheet.create({
  servicehistorytxt:{
    fontSize: 18,
    color: Color.darkolivegreen_100,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
    marginBottom:5,
  }, 
  searchInput:{ 
    paddingHorizontal:20, 
    paddingVertical:10, 
    borderColor:"#ccc", 
    borderWidth:1, 
    borderRadius:8, 
    marginBottom: '5%'
  },
  pressable:{
    backgroundColor: Color.mintcream,
    borderColor: "rgba(151, 173, 182, 0.2)",
    borderWidth: 1,
    borderStyle: "solid",
    margin:5,
    borderRadius: Border.br_3xs,
    padding:15,
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