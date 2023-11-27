import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, View } from 'react-native';
import SubmitButton from './Component/Ui/SubmitButton';
import { useFonts } from 'expo-font';
import LoadingOverlay from './Component/Ui/LoadingOverlay';
import Welcome from './Screens/Welcome';
import Login from './Screens/Login';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import SignUpScreen from './Screens/SignUpScreen';
import FirstDisplayScreen from './Screens/FirstDisplayScreen';
import ForgotPassword from './Screens/ForgotPassword';
import AuthContextProvider, { AuthContext } from './utils/AuthContext';
import { useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BillPayment from './Screens/BillPayment';
import RequestHelp from './Screens/RequestHelp';
import Requests from './Screens/Requests';
import ServiceHistory from './Screens/ServiceHistory'
import MarketPlace from './Screens/MarketPlace'
import { Color } from './Component/Ui/GlobalStyle';
import {Ionicons, FontAwesome5,  MaterialIcons} from '@expo/vector-icons'
import Setting from './Screens/Setting';
import FeedBack from './Screens/FeedBack';
import Compliance from './Screens/Compliance';
import NotificationSetup from './Screens/NotificationSetup';
import Profile from './Screens/Profile';
import ProfilePicsView from './Screens/ProfilePicsView';
import ProfileEdit from './Screens/ProfileEdit';
import VirtualTopUp from './Screens/VirtualTopUp';
import Television from './Screens/Television';
import Internet from './Screens/Internet';
import Education from './Screens/Education';
import Disco from './Screens/Disco';
import Bet from './Screens/Bet';
import * as Notification from 'expo-notifications'
import AddToWallet from './Screens/AddToWallet';
import FundWithCard from './Screens/FundWithCard';
import SubCategory from './Screens/SubCategory';
import ProceedRequestHelp from './Screens/ProceedRequestHelp';
import RequestSendInfo from './Screens/RequestSendInfo';
import MarketPlaceItem from './Screens/MarketPlaceItem';
import BidScreen from './Screens/BidScreen';
import * as Location from 'expo-location'
import ChatScreen from './Screens/ChatScreen';
import CustomerRating from './Screens/CustomerRating';
import MarketItemPurchase from './Screens/MarketItemPurchase';
import CartView from './Screens/CartView';
import CheckOut from './Screens/CheckOut';
import CartHistory from './Screens/CartHistory';
import Payments from './Screens/Payments';
import TransactionPin from './Screens/TransactionPin';
import HelperDetails from './Screens/HelperDetails';
import Biometric from './Screens/Biometric';

Notification.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Stack = createNativeStackNavigator()
const Tabs = createBottomTabNavigator()

export default function App() {
  const [location, setLocation]= useState(null)
  const [errorMsg, setErrorMsg] = useState(null)   

  const [fontloaded] =  useFonts({
    'poppinsRegular': require("./assets/Fonts/Poppins-Regular.ttf"),
    'poppinsMedium': require("./assets/Fonts/Poppins-Medium.ttf"),
    'poppinsSemiBold': require("./assets/Fonts/Poppins-SemiBold.ttf"),
    'poppinsBold': require("./assets/Fonts/Poppins-Bold.ttf"),
    'poppinsBold': require("./assets/Fonts/Inter-Bold.ttf"),
    'interBold': require("./assets/Fonts/Inter-Bold.ttf"),
    'interMedium': require("./assets/Fonts/Inter-Medium.ttf"),
    'interRegular': require("./assets/Fonts/Inter-Regular.ttf"),
  })

  
  useEffect(() => {
    const permissionget = async () => {
      let {status} = await Notification.requestPermissionsAsync();

      if (Platform.OS === 'android') {
        await Notification.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notification.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    }
    permissionget()
  }, [])

  useEffect(() => {
    (async () => {
      
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      })();
    }, []);

    let text = 'Waiting..';
    if (errorMsg) {
      text = errorMsg;
    } else if (location) {
      text = JSON.stringify(location);
    }



  if(!fontloaded){
    return <LoadingOverlay message={'...'}/>
  }

  function AuthStack (){

    const [isFirstLaunch, setIsFirstLaunch] = useState(null)
      useEffect(() => {
        AsyncStorage.getItem('alreadyLaunched').then(value => {
          if(value === null){
            AsyncStorage.setItem('alreadyLaunched', 'true');
            setIsFirstLaunch(true);
          }else{
            setIsFirstLaunch(false)
          }
        })
      }, [])

      if(isFirstLaunch === null){
        return null
      }else if(isFirstLaunch === true){
        return  (
          <Stack.Navigator
          screenOptions={{
            contentStyle:{backgroundColor: "#fff"}
          }}
          >
            <Stack.Screen
              name='FirstDisplayScreen'
              component={FirstDisplayScreen}
              options={{
                headerShown: false
              }} 
            />
            <Stack.Screen
              name='Login'
              component={Login}
              options={{
                headerShown: false
              }} 
            />
            <Stack.Screen
              name='SignUp'
              component={SignUpScreen}
              options={{
                headerShown: false
              }} 
            />
            <Stack.Screen
              name='ForgotPassword'
              component={ForgotPassword}
              options={{
                headerShown: false
              }} 
            />
          </Stack.Navigator>
        )
      }else{
        return (
        <Stack.Navigator
        screenOptions={{
          contentStyle:{backgroundColor: "#fff"}
        }}
        >
          <Stack.Screen
            name='Login'
            component={Login}
            options={{
              headerShown: false
            }} 
          />
            <Stack.Screen
            name='SignUp'
            component={SignUpScreen}
            options={{
              headerShown: false
            }} 
          />
            <Stack.Screen
            name='ForgotPassword'
            component={ForgotPassword}
            options={{
              headerShown: false
            }} 
          />
        </Stack.Navigator>
        )
      }
  }

  function TabNav(){
    return (
      <Tabs.Navigator
        sceneContainerStyle={{backgroundColor:'white'}}
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle:{backgroundColor: Color.darkolivegreen_100}
        }}
      >

        <Tabs.Screen
          name='Welcome'
          component={Welcome}
          options={{
            tabBarIcon:({focused}) => (
              <View style={{alignItems:'center'}}>
                  <Ionicons name="home" size={24} color={focused ? Color.white : '#d3d3d3'} />
                <Text style={{ fontSize:8, fontFamily: 'poppinsRegular', color: focused ? Color.white : '#d3d3d3'}}>Home</Text>
              </View>
            ),
          }}
        /> 
         <Tabs.Screen options={{
           tabBarIcon:({focused}) => (
            <View style={{alignItems:'center'}}>
              <FontAwesome5 name="money-bill-wave" size={22}  color={focused ? Color.white : '#d3d3d3'}  />
              <Text style={{ fontSize:8, fontFamily: 'poppinsRegular', color: focused ? Color.white : '#d3d3d3'}}>Bills</Text>
            </View>
          )
        }}  name='BillsPayment' component={BillPayment}/>



        <Tabs.Screen options={{
          tabBarIcon: ({focused}) => (
           <View style={{alignItems:'center'}}>
            <FontAwesome5 name="clipboard-list" size={22} color={focused ? Color.white : '#d3d3d3'}/>
            <Text style={{fontFamily: 'poppinsRegular', color: focused ? Color.white : '#d3d3d3', fontSize:8}}>Request</Text>
           </View>

          ),
        }}  
        name='RequestHelp' component={RequestHelp}/>


        <Tabs.Screen options={{
          tabBarIcon: ({focused}) => (
            <View style={{alignItems:'center'}}>
              {/* <FontAwesome5 name="money-bill-wave" size={24}  color={focused ? Color.darkolivegreen_100 : '#748c94'}  /> */}
              <MaterialIcons name="point-of-sale" size={22} color={focused ? Color.white : '#d3d3d3'} />
              <Text style={{ fontSize:8, color: focused ? Color.white : '#d3d3d3'}}>Market</Text>
            </View>
          )
        }} name='MarketPlace' component={MarketPlace}/>

        <Tabs.Screen
          name='Setting'
          component={Setting}
          options={{
            tabBarIcon:({focused}) => (
              <View style={{alignItems:'center'}}>
                  <Ionicons name="settings" size={24} color={focused ? Color.white : '#d3d3d3'} />
                <Text style={{ fontSize:8, fontFamily: 'poppinsRegular', color: focused ? Color.white : '#d3d3d3'}}>Settings</Text>
              </View>
            ),
          }}
        />


      </Tabs.Navigator>
    )
  }

  function AuthenticatedStack(){
    return (
      <Stack.Navigator
        screenOptions={{
          contentStyle:{backgroundColor: "#fff"}
        }}
      >
        <Stack.Screen
          name='Tab'
          component={TabNav}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='BillPayment'
          component={BillPayment}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='RequestHelp'
          component={RequestHelp}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='Requests'
          component={Requests}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='ServiceHistory'
          component={ServiceHistory}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='FeedBack'
          component={FeedBack}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='Compliance'
          component={Compliance}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='NotificationSetup'
          component={NotificationSetup}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='Profile'
          component={Profile}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='ProfilePicsView'
          component={ProfilePicsView}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='ProfileEdit'
          component={ProfileEdit}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='VirtualTopup'
          component={VirtualTopUp}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='Television'
          component={Television}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='Internet'
          component={Internet}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='Education'
          component={Education}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='Disco'
          component={Disco}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='Bet'
          component={Bet}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='AddToWallet'
          component={AddToWallet}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='FundWithCard'
          component={FundWithCard}
          options={{
            headerShown: false
          }}
        />
         <Stack.Screen
          name='SubCategory'
          component={SubCategory}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='ProceedRequestHelp'
          component={ProceedRequestHelp}
          options={{
            headerShown: false
          }}
        />
         <Stack.Screen
          name='RequestSendInfo'
          component={RequestSendInfo}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='MarketPlaceItem'
          component={MarketPlaceItem}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='MarketItemPurchase'
          component={MarketItemPurchase}
          options={{
            headerShown: false
          }}
        />
         <Stack.Screen
          name='BidScreen'
          component={BidScreen}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='HelperDetails'
          component={HelperDetails}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='ChatScreen'
          component={ChatScreen}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='CustomerRating'
          component={CustomerRating}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='CartView'
          component={CartView}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='CheckOut'
          component={CheckOut}
          options={{
            headerShown: false
          }}
        />
         <Stack.Screen
          name='CartHistory'
          component={CartHistory}
          options={{
            headerShown: false
          }} 
        />
        <Stack.Screen
          name='Payments'
          component={Payments}
          options={{
            headerShown: false
          }} 
        />
        <Stack.Screen
          name='TransactionPin'
          component={TransactionPin}
          options={{
            headerShown: false
          }} 
        />
        <Stack.Screen
          name='Biometric'
          component={Biometric}
          options={{
            headerShown: false
          }} 
        />
      </Stack.Navigator>
    )
  }

  const Navigation = () => {
    const authCtx = useContext(AuthContext)
    return(
      <NavigationContainer>
        {!authCtx.isAuthenticated && <AuthStack/>}
        {authCtx.isAuthenticated && <AuthenticatedStack/>}
      </NavigationContainer>
    )
  }


  function Root(){
    const authCtx = useContext(AuthContext)
    const [isTrying, setisTrying] = useState(false)
  
    async function fetchData(){
      setisTrying(true)
      const storedToken = await AsyncStorage.getItem('customertoken')
      const storedId = await AsyncStorage.getItem('customerId')
      const storedemail = await AsyncStorage.getItem('customerEmail')
      const storedfirstname = await AsyncStorage.getItem('customerFirstname')
      const storedlastname = await AsyncStorage.getItem('customerLastname')
      const storedphone = await AsyncStorage.getItem('customerPhone')
      const storedpicture = await AsyncStorage.getItem('customerPicture')
      const storedshowamount = await AsyncStorage.getItem('customerShowAmount')
      const storedbalance = await AsyncStorage.getItem('customerBalance')
      
      
      if(storedToken && storedId && storedemail){
        authCtx.authenticated(storedToken)
        authCtx.customerId(storedId)
        authCtx.customerEmail(storedemail)
        authCtx.customerFirstName(storedfirstname)
        authCtx.customerLastName(storedlastname)
        authCtx.customerBalance(storedbalance)
        authCtx.customerPhone(storedphone)
        authCtx.customerPicture(storedpicture)
        authCtx.customerShowAmount(storedshowamount)
      }
      setisTrying(false)
    }

    useEffect(() => {
      fetchData()
    }, [])

    if(isTrying){
      return <LoadingOverlay message={"..."}/>
    }

    return <Navigation/>

  
  }



  return (
    <>
      {/* <Text>Open up App.js to start working on your app!</Text> */}
      <StatusBar style="auto" />
      <AuthContextProvider>
        <Root/>
      </AuthContextProvider>
    </>
  );
}

const styles = StyleSheet.create({
 
});
