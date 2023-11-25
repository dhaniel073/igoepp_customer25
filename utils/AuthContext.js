import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useState } from "react";
import LoadingOverlay from "../Component/Ui/LoadingOverlay";

export const AuthContext = createContext({
    token: "",
    email: "",
    Id: "",
    firstname: "",
    lastname:"",
    isAuthenticated: false,
    amtVisible: "",
    phone: "",
    picture: "",
    balance: "",
    sessionid: "",

    authenticated: (token) => {},
    customerId: (Id) => {},
    customerEmail: (email) => {},
    customerFirstName: (firstname) => {},
    customerLastName: (lastname) => {},
    customerAmtVisible: (amtVisible) => {},
    customerBalance: (balance) => {},
    customerPhone: (phone) => {},
    customerPicture: (picture) => {},
    customerSessionId: (sessionid) => {},
    logout: () => {}

})

function AuthContextProvider({children}){
    const [IsLogout, setIsLogout] = useState(false)
    const [authToken, setauthToken] = useState()
    const [authEmail, setauthEmail] = useState()
    const [authId, setauthId] = useState()
    const [authFirstName, setauthFirstName] = useState()
    const [authLastName, setauthLastName] = useState()
    const [authAmountVisible, setauthAmountVisible] = useState()
    const [authBalance, setauthBalance] = useState()
    const [authphone, setauthphone] = useState()
    const [authSessionId, setauthSessionId] = useState()
    const [authpicture, setauthpicture] = useState()


    if(IsLogout){
        return <LoadingOverlay/>
    }


    function authenticated(token){
        setauthToken(token)
        AsyncStorage.setItem('customertoken', token)
    } 

    function customerId(id){
        const idtostring = id.toString()
        setauthId(idtostring)
        AsyncStorage.setItem('customerId', idtostring)
    }

    function customerPhone(number){
        const phonecheck = number.toString()
        setauthphone(phonecheck)
        AsyncStorage.setItem('customerPhone', phonecheck)
    }

    function customerEmail (email){
        setauthEmail(email)
        AsyncStorage.setItem('customerEmail', email)
    }

    function customerFirstName (firstname){
        setauthFirstName(firstname)
        AsyncStorage.setItem('customerFirstname', firstname)
    }

    function customerLastName (lastname){
        setauthLastName(lastname)
        AsyncStorage.setItem('customerLastname', lastname)
    }

    function customerAmtVisible(status){
        if(status === 'true'){
            setauthAmountVisible(status)
            AsyncStorage.setItem('customerAmtVisible', 'true')
        }else if(status === 'false'){
            setauthAmountVisible(status)
            AsyncStorage.setItem('customerAmtVisible', 'false')
        }else{
            status === ''
            setauthAmountVisible('')
            AsyncStorage.setItem('customerAmtVisible', '')
        }
    }

    function customerBalance(amount){
        if(amount === null || '' || undefined){
            setauthBalance('0.00')
            AsyncStorage.setItem('customerBalance', '0.00')
        }else{
            const amountcheck = amount.toLocaleString()
            setauthBalance(amountcheck)
            AsyncStorage.setItem('customerBalance', amountcheck)
        }
    }

    function customerPicture (picture){
        if(picture === null || picture === undefined || picture === ""){
            setauthpicture("NoImage")
            AsyncStorage.setItem('customerPicture', 'NoImage')
        }else{
            setauthpicture(picture)
            AsyncStorage.setItem('customerPicture', picture)
        }
    }

    function customerSessionId(value){
        if(value === null || '' || undefined){
            setauthSessionId('nosessionid')
            AsyncStorage.setItem('customerSessionId', '0.00')
        }else{
            // const amountcheck = amount.toLocaleString()
            setauthSessionId(value)
            AsyncStorage.setItem('customerSessionId', value)
        }
    }



    function logout(){
        setIsLogout(true)
        setauthToken(null)
        setauthId(null)
        setauthFirstName(null)
        setauthLastName(null)
        setauthEmail(null)
        setauthAmountVisible(null)
        setauthBalance(null)
        setauthphone(null)
        setauthpicture(null) 
        setauthSessionId(null)
        AsyncStorage.removeItem('customertoken')
        AsyncStorage.removeItem('customerId')
        AsyncStorage.removeItem('customerPhone')
        AsyncStorage.removeItem('customerEmail')
        AsyncStorage.removeItem('customerFirstname')
        AsyncStorage.removeItem('customerLastname')
        AsyncStorage.removeItem('customerAmtVisible')
        AsyncStorage.removeItem('customerBalance')
        AsyncStorage.removeItem('customerPicture')
        AsyncStorage.removeItem('customerSessionId')
        setIsLogout(false)
    }

    const value = {
        token: authToken,
        Id: authId,
        email: authEmail,
        firstname: authFirstName,
        lastname: authLastName,
        isAuthenticated: !!authToken,
        amtvisible: authAmountVisible,
        balance: authBalance,
        phone: authphone,
        picture: authpicture, 
        sessionid: authSessionId,
        authenticated:authenticated,
        customerId:customerId,
        customerEmail: customerEmail,
        customerFirstName: customerFirstName,
        customerLastName: customerLastName, 
        customerAmtVisible: customerAmtVisible,
        customerBalance: customerBalance,
        customerPhone: customerPhone,
        customerPicture: customerPicture,
        customerSessionId: customerSessionId,
        logout: logout
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>


}

export default AuthContextProvider
