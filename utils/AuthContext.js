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
    phone: "",
    picture: "",
    balance: "",
    sessionid: "",
    showAmount: "",
    lastLoginTimestamp: "",
    points: "",
    userid: "",

    authenticated: (token) => {},
    customerId: (Id) => {},
    customerEmail: (email) => {},
    customerFirstName: (firstname) => {},
    customerLastName: (lastname) => {},
    customerBalance: (balance) => {},
    customerPhone: (phone) => {},
    customerPicture: (picture) => {},
    customerSessionId: (sessionid) => {},
    customerShowAmount: (showAmount) => {},
    customerlastLoginTimestamp : (lastLoginTimestamp) => {},
    customerPoints: (points) => {},
    customeruserid: (userid) => {},
    logout: () => {}

})

function AuthContextProvider({children}){
    const [IsLogout, setIsLogout] = useState(false)
    const [authToken, setauthToken] = useState()
    const [authEmail, setauthEmail] = useState()
    const [authId, setauthId] = useState()
    const [authFirstName, setauthFirstName] = useState()
    const [authLastName, setauthLastName] = useState()
    const [authShowAmount, setauthShowAmount] = useState()
    const [authBalance, setauthBalance] = useState()
    const [authphone, setauthphone] = useState()
    const [authSessionId, setauthSessionId] = useState()
    const [authpicture, setauthpicture] = useState()
    const [authlogintime, setauthlogintime] = useState()
    const [authpoint, setauthpoint] = useState()
    const [authuserid, setauthuserid] = useState()


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

    function customeruserid(userid){
        setauthuserid(userid)
        AsyncStorage.setItem('customeruserid', userid)
    }

    function customerFirstName (firstname){
        setauthFirstName(firstname)
        AsyncStorage.setItem('customerFirstname', firstname)
    }

    function customerLastName (lastname){
        setauthLastName(lastname)
        AsyncStorage.setItem('customerLastname', lastname)
    }

    function customerlastLoginTimestamp(time){
        setauthlogintime(time)
        AsyncStorage.setItem('customerlastLoginTimestamp', time)
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

    function customerPoints(point) {
        if(point === null || point ===  '' || point === undefined){
            const set = "0"
            setauthpoint(set)
            AsyncStorage.setItem('customerPoints', set)
        }else{
            const pointcheck = point.toLocaleString()
            setauthpoint(pointcheck)
            AsyncStorage.setItem('customerPoints', pointcheck)
        }
    }

    function customerShowAmount (status) {
        if(status === 'show'){
            setauthShowAmount('show')
            AsyncStorage.setItem('customerShowAmount', "show")
        }else{
            setauthShowAmount(status)
            AsyncStorage.setItem('customerShowAmount', 'hide')
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
        setauthBalance(null)
        setauthphone(null)
        setauthpicture(null) 
        setauthSessionId(null)
        setauthShowAmount(null)
        setauthlogintime(null)
        setauthpoint(null)
        setauthuserid(null)
        AsyncStorage.removeItem('customertoken')
        AsyncStorage.removeItem('customerId')
        AsyncStorage.removeItem('customerPhone')
        AsyncStorage.removeItem('customerEmail')
        AsyncStorage.removeItem('customerFirstname')
        AsyncStorage.removeItem('customerLastname')
        AsyncStorage.removeItem('customerBalance')
        AsyncStorage.removeItem('customerPicture')
        AsyncStorage.removeItem('customerSessionId')
        AsyncStorage.removeItem('customerShowAmount')
        AsyncStorage.removeItem('customerlastLoginTimestamp')
        AsyncStorage.removeItem('customerPoints')
        AsyncStorage.removeItem('customeruserid')
        setIsLogout(false)
    }

    const value = {
        token: authToken,
        Id: authId,
        email: authEmail,
        firstname: authFirstName,
        lastname: authLastName,
        isAuthenticated: !!authToken,
        balance: authBalance,
        phone: authphone,
        picture: authpicture, 
        sessionid: authSessionId,
        showAmount: authShowAmount,
        lastLoginTimestamp: authlogintime,
        points: authpoint,
        userid: authuserid,
    

        authenticated:authenticated,
        customerId:customerId,
        customerEmail: customerEmail,
        customerFirstName: customerFirstName,
        customerLastName: customerLastName, 
        customerBalance: customerBalance,
        customerPhone: customerPhone,
        customerPicture: customerPicture,
        customerSessionId: customerSessionId,
        customerShowAmount: customerShowAmount,
        customerlastLoginTimestamp: customerlastLoginTimestamp,
        customerPoints: customerPoints,
        customeruserid:customeruserid,
        logout: logout
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>


}

export default AuthContextProvider
