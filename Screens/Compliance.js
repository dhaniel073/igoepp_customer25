import { Platform, StyleSheet, Text, TouchableOpacity, View, SafeAreaView, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Color, DIMENSION, marginStyle } from '../Component/Ui/GlobalStyle'
import GoBack from '../Component/Ui/GoBack'
import { CustomerInfoCheck, CustomerUploadAddressproof, CustomerUploadIdCard } from '../utils/AuthRoute'
import { AuthContext } from '../utils/AuthContext'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'
import Modal from 'react-native-modal'
import {FontAwesome, MaterialIcons, Ionicons} from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'

const Compliance = ({navigation}) => {
    const [isIdCardModalVisble, setIdCardModalVisible] = useState(false)
    const [isAddressModalVisble, setIsAddressModalVisible] = useState(false)

    const authCtx = useContext(AuthContext)
    const [fetchedInfo, setfetchedInfo] = useState([])
    const [isloading, setisloading] = useState(false)

    const [addressProof, setAddressProof] = useState()
    const [idCard, setIdCard] = useState()

    const [addressProofBase, setAddressProofBase] = useState()
    const [idCardBase, setIdCardBase] = useState()

    useEffect(() => {
      const unscuscribe = navigation.addListener('focus', async() => {
        try {
          setisloading(true)
          const response = await CustomerInfoCheck(authCtx.Id, authCtx.token)
          // console.log(response)
          setfetchedInfo(response)
          setisloading(false)
        } catch (error) {
          setisloading(true)
          // console.log(error.response)
          setisloading(false)
        }
      })
      return unscuscribe;
    }, [])

    const toggleAddressModal = () => {
        setIsAddressModalVisible(!isAddressModalVisble)
    }

    const toggleIdCardModal = () => {
        setIdCardModalVisible(!isIdCardModalVisble)
    }

    const captureaddressimage = async () => {
        ImagePicker.getCameraPermissionsAsync()
        
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect:[4,3],
          quality: 0.75,
          base64: true
        })
    
        if(result.canceled){
          toggleAddressModal()
          return;
        }
        
        if(!result.canceled){
          setAddressProof(result.assets[0].uri)
          setAddressProofBase(result.assets[0].base64)
          toggleAddressModal()
        }
    }
    const pickaddressImage = async () => {
        ImagePicker.getMediaLibraryPermissionsAsync()
    
    
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect:[4,3],
            quality: 0.75,
            base64: true
        })
    
        if(result.canceled){
          toggleAddressModal()
          return;
        }
        
        if(!result.canceled){
          setAddressProof(result.assets[0].uri)
          setAddressProofBase(result.assets[0].base64)
          toggleAddressModal()
        }
       
    }

    const Customer = async () => {
        try {
            setisloading(true)
            const response = await CustomerInfoCheck(authCtx.Id, authCtx.token)
            setfetchedInfo(response)
            setAddressProofBase(null)
            setIdCardBase(null)
            setAddressProof(null)
            setIdCard(null)
            setisloading(false)
        } catch (error) {
            setisloading(true)
            setisloading(false)
        }
    }

    const deleteaddressImage = () => {
        Alert.alert("Remove Image", "Do you want to delete selected Image", [
          {
            text: "No",
            onPress: () => {}
          },
          {
            text: "Yes",
            onPress: () => [setAddressProof() && setAddressProofBase()]
          },
        ])
          
      }

    const uploadAddressProof = async () => {
        const uploadUrl = `data:image/jpeg;base64,${addressProofBase}`
        try {
          setisloading(true)
          const response = await CustomerUploadAddressproof(uploadUrl, authCtx.Id, authCtx.token) 
        //   console.log(response)
          setisloading(false)
          setAddressProof()
          setAddressProofBase()
          Alert.alert('Success', 'Address proof uploaded successfully', [
            {
              text: 'Ok',
              onPress: () => {Customer()}
            }
          ])
        } catch (error) {
          setisloading(true)
        //   console.log(error.response)
          Alert.alert('Error', "An error occured please try again later")
          setisloading(false)
          setAddressProof()
          setAddressProofBase()
          return;
    
        }
      }

      const uploadIdCard = async () => {
        const uploadUrl = `data:image/jpeg;base64,${idCardBase}`
        try {
          setisloading(true)
          const response = await CustomerUploadIdCard(uploadUrl, authCtx.Id, authCtx.token) 
        //   console.log(response)
          setisloading(false)
          setIdCard()
          setIdCardBase()
          Alert.alert('Success', 'Id card  uploaded successfully', [
            {
              text: 'Ok',
              onPress: () => {Customer()}
            }
          ])
        } catch (error) {
          setisloading(true)
        //   console.log(error.response)
          Alert.alert('Error', "An error occured please try again later")
          setisloading(false)
          setIdCard()
          setIdCardBase()
          return;
        }
      }

      const captureidcardimage = async () => {
        ImagePicker.getCameraPermissionsAsync()
        
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect:[4,3],
          quality: 0.75,
          base64: true
        })
        
        if(result.canceled){
          toggleIdCardModal()
          return;
        }
        
        if(!result.canceled){
          setIdCard(result.assets[0].uri)
          setIdCardBase(result.assets[0].base64)
          toggleIdCardModal()
          }
        }
      
      const pickidcardImage = async () => {
          ImagePicker.getMediaLibraryPermissionsAsync()
      
          let result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect:[4,3],
              quality: 0.75,
              base64: true
          })
      
          if(result.canceled){
            toggleIdCardModal()
            return;
          }
          
          if(!result.canceled){
            setIdCard(result.assets[0].uri)
            setIdCardBase(result.assets[0].base64)
            toggleIdCardModal()
          }
         
      }
      
        const deleteidcardImage = () => {
          Alert.alert("Remove Image", "Do you want to delete selected Image", [
            {
              text: "No",
              onPress: () => {}
            },
            {
              text: "Yes",
              onPress: () => [setIdCard() && setIdCardBase()]
            },
          ])
          
        }
    
    
  
      

    if(isloading){
        return <LoadingOverlay message={"..."}/>
    }

  return (
    <View style={{marginTop: marginStyle.marginTp, marginHorizontal:10}}>
    <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <Text style={styles.compliancetxt}>Compliance</Text>

      <View style={{justifyContent:'center', marginTop:10}}>
           

      <View style={{marginTop: 10, marginHorizontal:5}}>
      <TouchableOpacity style={[styles.shadow, {borderBottomColor: Color.new_color,  padding:20, marginBottom:20, flexDirection:'row', justifyContent:'space-between'}]} onPress={() => [idCard ? null : fetchedInfo.identification_path === null ? toggleIdCardModal() : null]}>
        <Text style={{fontSize:15}}>Id Card</Text>

        {idCard ? 
        <View style={{flexDirection:'row'}}>
          <TouchableOpacity onPress={uploadIdCard}>
          <FontAwesome name="upload" size={24} color="black" style={{marginRight:5}}/> 
          </TouchableOpacity>
          <TouchableOpacity onPress={deleteidcardImage}>
          <MaterialIcons name="delete" size={24} color="black" style={{marginLeft:5}}/>
          </TouchableOpacity>
        </View>

        : fetchedInfo.identification_path !== null && fetchedInfo.verify_identification_date === null  && fetchedInfo.verify_identification === "N" ?
            
            <Text style={{color:Color.new_color, fontSize:11, top:4}}>Pending...</Text>

        : fetchedInfo.identification_path !== null && fetchedInfo.verify_identification_date === null  && fetchedInfo.verify_identification === "I" ?
            
            <Text style={{color: Color.tomato}}>!!! Invalid Document</Text>

        : fetchedInfo.identification_path !== null && fetchedInfo.verify_identification_date !== null  && fetchedInfo.verify_identification === "Y" ?
            
            <Image source={require("../assets/group-729.png")} style={{width:20, height:20}}/> 

        :
            ""
        }
      </TouchableOpacity>

      <TouchableOpacity style={[styles.shadow, {borderBottomColor: Color.new_color,  padding:20, marginBottom:20, flexDirection:'row', justifyContent:'space-between'}]} onPress={() => [addressProof ? null : fetchedInfo.address_verification_path === null ? toggleAddressModal() : null]}>
        <Text style={{fontSize:15}}>Proof of Address</Text>

        <> 
        {addressProof ? 
          <View style={{flexDirection:'row'}}>
          <TouchableOpacity onPress={uploadAddressProof}>
          <FontAwesome name="upload" size={24} color="black" style={{marginRight:5}}/> 
          </TouchableOpacity>
          <TouchableOpacity onPress={deleteaddressImage}>
          <MaterialIcons name="delete" size={24} color="black" style={{marginLeft:5}}/>
          </TouchableOpacity>
        </View>

        : fetchedInfo.address_verification_path !== null && fetchedInfo.verify_address_date === null  && fetchedInfo.verify_address === "N" ?
            
            <Text style={{color:Color.new_color, fontSize:11, top:4}}>Pending...</Text>

        : fetchedInfo.address_verification_path !== null && fetchedInfo.verify_address_date === null  && fetchedInfo.verify_address === "I" ?
            
            <Text style={{color: Color.tomato, fontSize:11}}>!!! Invalid Document</Text>

        : fetchedInfo.address_verification_path !== null && fetchedInfo.verify_address_date !== null  && fetchedInfo.verify_address === "Y" ?

            <Image source={require("../assets/group-729.png")} style={{width:20, height:20}}/> 
        : ""
        }
        </>
      </TouchableOpacity>

      </View>
     </View> 

     <Modal isVisible={isAddressModalVisble}>
        <SafeAreaView style={styles.centeredView}>

        <TouchableOpacity style={{justifyContent:'flex-end', alignSelf:'flex-end', marginBottom:5, }} onPress={() => toggleAddressModal()}>
          <MaterialIcons name="cancel" size={30} color="white" />
        </TouchableOpacity>
        <View style={[styles.modalView,  {width: DIMENSION.WIDTH * 0.7}]} showsVerticalScrollIndicator={false}>
          <Text style={[styles.modalText, {fontSize:15}]}>
            Proof Of Address
          </Text>

            <View style={{ marginBottom:10}}/>  

          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <View style={{alignItems:'center', justifyContent:'center'}}>
              <TouchableOpacity style={[styles.shadow,{borderWidth:1, padding:15, borderRadius:10, marginRight:10, borderColor:Color.darkolivegreen_100}]} onPress={captureaddressimage}>
                <FontAwesome name="camera" size={24} color={Color.darkolivegreen_100} />
              </TouchableOpacity>
              <Text style={[styles.panelBottomTitle, {marginRight:15}]}> Camera</Text>
            </View>

            <View style={{alignItems:'center', justifyContent:'center'}}>
              <TouchableOpacity style={[styles.shadow,{borderWidth:1, padding:15, borderRadius:10, marginLeft:10, borderColor:Color.darkolivegreen_100}]} onPress={pickaddressImage}>
                <Ionicons name="ios-library-sharp" size={24} color={Color.darkolivegreen_100} />
              </TouchableOpacity>
              <Text style={[styles.panelBottomTitle, {marginLeft:15, marginRight:10}]}> Libraries</Text>
            </View>
          </View>

            <View style={{marginBottom:5}}/>
        </View>

        </SafeAreaView>
      </Modal>

      <Modal isVisible={isIdCardModalVisble}>
        <SafeAreaView style={styles.centeredView}>

        <TouchableOpacity style={{justifyContent:'flex-end', alignSelf:'flex-end', marginBottom:5, }} onPress={() => toggleIdCardModal()}>
          <MaterialIcons name="cancel" size={30} color="white" />
        </TouchableOpacity>
        <View style={[styles.modalView,  {width: DIMENSION.WIDTH * 0.7}]} showsVerticalScrollIndicator={false}>
          <Text style={[styles.modalText, {fontSize:15}]}>
            Id Card
          </Text>

            <View style={{ marginBottom:10}}/>  

          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <View style={{alignItems:'center', justifyContent:'center'}}>
              <TouchableOpacity style={[styles.shadow,{borderWidth:1, padding:15, borderRadius:10, marginRight:10, borderColor:Color.darkolivegreen_100}]} onPress={captureidcardimage}>
                <FontAwesome name="camera" size={24} color={Color.darkolivegreen_100} />
              </TouchableOpacity>
              <Text style={[styles.panelBottomTitle, {marginRight:15}]}> Camera</Text>
            </View>

            <View style={{alignItems:'center', justifyContent:'center'}}>
              <TouchableOpacity style={[styles.shadow,{borderWidth:1, padding:15, borderRadius:10, marginLeft:10, borderColor:Color.darkolivegreen_100}]} onPress={pickidcardImage}>
                <Ionicons name="ios-library-sharp" size={24} color={Color.darkolivegreen_100} />
              </TouchableOpacity>
              <Text style={[styles.panelBottomTitle, {marginLeft:15, marginRight:10}]}> Libraries</Text>
            </View>
          </View>

            <View style={{marginBottom:5}}/>
        </View>

        </SafeAreaView>
      </Modal>
   
    </View>
  )
}

export default Compliance

const styles = StyleSheet.create({
    panelBottomTitle: {
        fontSize: 12,
        fontFamily: 'poppinsRegular',
        color: Color.orange_100,
        marginTop:10
    },
    compliancetxt:{
        fontSize: 18,
        color: Color.darkolivegreen_100,
        fontFamily: 'poppinsSemiBold',
        left: 10,
        marginTop:10,
        marginBottom:15,
    }, 
    shadow:{
        borderRadius: 20, 
        elevation: 7,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 4,
        backgroundColor: 'white',
        overflow: Platform.OS === 'andriod' ? 'hidden' : 'visible',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
      modalView: {
        margin: 20,
        backgroundColor: 'white',
        width: DIMENSION.WIDTH  * 0.9,
        borderRadius: 20,
        padding: 20,
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
        textAlign: 'center',
        fontSize:18, 
        fontFamily:'poppinsRegular'
    },
})