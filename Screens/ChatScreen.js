import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useLayoutEffect, useState,useEffect, useCallback } from 'react'
import { AuthContext } from '../utils/AuthContext'
import { HelperGet } from '../utils/AuthRoute'
import { Color, marginStyle } from '../Component/Ui/GlobalStyle'
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat'
import axios from 'axios'
import GoBack from '../Component/Ui/GoBack'
import {MaterialCommunityIcons} from "@expo/vector-icons"
import { Image } from 'expo-image'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'

const ChatScreen = ({navigation, route}) => {
  const [messages, setMessages] = useState([])
  const authCtx = useContext(AuthContext)
  const [helper, setHelper] = useState('')
  const [premessage, setPreviousMessage] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const bidid = route?.params?.bid_id
  const helperId = route?.params?.helperId

  useEffect(() => {
    const helperInfo = async () => {
    try {
      setIsLoading(true)
      const response = await HelperGet(helperId, authCtx.token)
      setHelper(response.data.data)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(true)
      setIsLoading(false)
      return;
    }}
    helperInfo()
}, [])


useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async() => {
    // do something
    const url = `https://phixotech.com/igoepp/public/api/auth/hrequest/helpchatview/${bidid}`
      try {
      const response = await axios.get(url, {
          headers:{
            Accept:'application/json',
            Authorization: `Bearer ${authCtx.token}`
          }
      })
      // const response = []
      console.log(response)
        var count = Object.keys(response.data).length;
        let stateArray = []
        for (var i = 0; i < count; i++){
          stateArray.push({
            _id: response.data[i].id,
            createdAt: response.data[i].created_at,
            text: response.data[i].message,
            user:{
              _id: response.data[i].from_user_id,
              name: 'React Native',
              avater: `https://phixotech.com/igoepp/public/handyman/${helper.photo}`,
            },
          }, 
          )
          setPreviousMessage(response.data[i].from_user_id)
        }
        const descArr = stateArray.sort().reverse();
        setMessages(descArr)
      } catch (error) {
        console.log(error)
        Alert.alert("Error", "An error occured while fetching messages", [
          {
            text:'Ok',
            onPress: () => navigation.goBack()
          }
        ])
        return;
      }
    });
    return unsubscribe;
}, [4000]);


const SendMessage = (text) => {
  const url = `https://phixotech.com/igoepp/public/api/auth/hrequest/helpchat`
  // console.log(text)
  axios.post(url, {
      help_id: route?.params?.bid_id,
      from_user_id: authCtx.Id,
      to_user_id: route?.params.helperId,
      message: text,
      user_type: 'customer'
  }, {
      headers:{
          Accept: 'application/json',
          Authorization: `Bearer ${authCtx.token}`
      }
  }).then((res) => {
      // console.log(res.data)
  }).catch((error) => {
      // console.log(error.response.data)
      return;
  })
}

const onSend = useCallback((messages = []) => {
  setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  const {
      _id,
      createdAt,
      text,
      user
  } = messages[0]
  SendMessage(text)
}, [])

const renderBubble = (props) => {
  return (
    <Bubble
      {...props}
      wrapperStyle={{ 
          right:{
              backgroundColor:  '#2e64e5'
          }
      }}
      textStyle={{ 
          right: {
              color: '#fff'
          }
      }}
    />
  )
}

const renderSend = (props) => {
  return(
      <Send {...props}>
          <View>
          <MaterialCommunityIcons style={{marginRight:5, marginBottom:5}} name="send-circle" size={32} color='#2e64e5' />
          </View>
      </Send>
  )
}

const scrollToBottomComponent = (props) => {
  return (
      <FontAwesome5 name="angle-double-down" size={22} color="#333" />
  )
}

  const CustomerId = authCtx.Id.toString()
    

  if(isLoading){
    return <LoadingOverlay message={"Loading messages"}/>
  }
  return (
    <>
     <View style={{marginTop:marginStyle.marginTp + 10, marginHorizontal:10,   flexDirection:'row',}}>
      <GoBack onPress={() => navigation.goBack()}></GoBack>
      {
        helper.photo === null ? 
          <Image style={styles.image} source={require("../assets/person-4.png")}/>
        :
        <Image style={styles.image} source={{uri: `https://phixotech.com/igoepp/public/handyman/${helper.photo}`}}/>
      }
      <Text style={{fontSize: 14, fontFamily: 'poppinsSemiBold'}}>{helper.first_name} {helper.last_name}</Text>
      {/* <Text style={styles.chattxt}>Chat</Text> */}
    </View>

    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={true}
      onSend={messages => onSend(messages)}
      user={{ 
          _id: CustomerId,
          name: authCtx.firstname,
          // avatar: authCtx.picture === null || "" ? <Image source={require("../assets/person-4.png")}/> : `https://phixotech.com/igoepp/public/handyman/${authCtx.picture}`
      }}

      renderBubble={renderBubble}
      alwaysShowSend
      renderSend={renderSend}
      scrollToBottom
      scrollToBottomComponent={scrollToBottomComponent}
    />
    </>
  )
}

export default ChatScreen

const styles = StyleSheet.create({
  chattxt:{
    fontSize: 18,
    color: Color.new_color,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
    marginBottom:15,
  }, 
  image:{
    width: 35,
    height: 35,
    alignSelf:'center',
    marginTop: -8,
    borderRadius:50,
    borderWidth:1,
    marginRight: 5
  },
})