import axios from "axios";
import { Alert } from "react-native";


//sign up/create new user endpoint
async function authenticateSignUp(email, password, gender, phone, firstname, lastname,identification_type,identification_num, referral_code){
  let base = 'customer/store'
  const loginUrl = 'https://igoeppms.com/igoepp/public/api/'+ base
  
  const response = await axios.post(loginUrl, {
    'first_name': firstname,
    'last_name': lastname,
    'email': email,
    'sex': gender,
    'phone': phone,
    'password': password,
    "identification_type":identification_type,
    "identification_num":  identification_num,
    "referral_code": referral_code,
    'application': "mobileapp"
  })
  const data = response.data;
  return data;
}

//Login endPoint
async function authenticateLogin(email, password){
    const loginUrl = 'https://igoeppms.com/igoepp/public/api/igoeppauth/logincustomer'
    
    const response = await axios.post(loginUrl, {
      'username': email,
      'password': password,
      'application': "mobileapp"
    })
    const data = response.data
    return data;
}

async function validateLogin(email, password){
  const loginUrl = 'https://igoeppms.com/igoepp/public/api/igoeppauth/validatelogincustomer'
  
  const response = await axios.post(loginUrl, {
    'username': email,
    'password': password,
  })
  const data = response.data
  return data;
}

//session endpoint id
async function sessionId(email, token){
    const sessionurl = 'https://igoeppms.com/igoepp/public/api/auth/igoeppauth/sessioncheckcustomer'

    const response = await axios.post(sessionurl, {
        'username': email,
        'application': "mobileapp"
      }, {
        headers:{
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
      })
      const data = response.data
      return data;
}

//view categories endpoint 
async function category(){
    const response = await axios.get("https://igoeppms.com/igoepp/public/api/category")

    const data = response.data.data
    return data;

}

//view subcategory endpoint
async function subcategory(categoryId){
    const response = await axios.get(`https://igoeppms.com/igoepp/public/api/showsubcategorybycatid/${categoryId}`)
    const data = response.data.data
    return data;
}

//all request endpoint
async function fetchedData(customerId, token){
  const url = `https://igoeppms.com/igoepp/public/api/auth/hrequest/showrequestbycustomerid/${customerId}`
      const response = await axios.get(url,
         {
            headers:{
              Accept: 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        )
          const data = response.data
          return data;
     
}

//send request info data 
async function requestinfo(customerId,interest,addressfield,countryName,stateName,cityName,
    landmark,helpsize,vehiclerequest,description,catId,subcatId,helptime,maindate,frequency, preassessment, token){

    const url = 'https://igoeppms.com/igoepp/public/api/auth/hrequest/store'
                
       const response =  await axios.post(url, 
        {
            'customer_id':customerId,
            'help_interest': interest,
            'help_location':addressfield,
            'preassessment_flg': preassessment,
            'help_country': countryName,
            'help_state':stateName,
            'help_lga':cityName,
            'help_landmark':landmark,
            'help_size':helpsize,
            'vehicle_req':vehiclerequest,
            'help_desc':description,
            'category_id':catId,
            'sub_category_id':subcatId,
            "help_time": helptime,
            'help_date':maindate,
            "help_frequency": frequency,
        },
    {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    })
    const data = response.data
    return data
}

//request by request id endpoint
async function fetchrequestbyid(requestid, token){
      const response = await axios.get(
          `https://igoeppms.com/igoepp/public/api/auth/hrequest/showrequestbyrequestid/${requestid}`, 
         {
            headers:{
              Accept: 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        )
          const data = response.data
          return data;
    
}

//cancel request made by customer
async function cancelrequests(id, token, reason){
      const response = await axios.post(
          `https://igoeppms.com/igoepp/public/api/auth/hrequest/cancelrequest`, 
          {
              'book_id': id,
              'cancel_reason': reason
          },
         {
            headers:{
              Accept: 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        )
          const data = response.data
          return response.data;
    
  }


//bid request endpoint
async function bidrequests(bid_id, token){
 const url =  `https://igoeppms.com/igoepp/public/api/auth/hrequest/showbidrequestbyrequestid/${bid_id}`
      const response = await axios.get(url,
         {
            headers:{
              Accept: 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        )
          const data = response.data
          return data;
    
}

//bid accept by cash endpoint
async function bidacceptcash(Id,paymentmethod,paymentmethod1,sessionId, token){
    const url = 'https://igoeppms.com/igoepp/public/api/auth/hrequest/acceptbidcash'

    const response = await axios.post(url, {
        "bidid": Id,
        "payment_type": paymentmethod,
        "payment_mode" : paymentmethod1,
        "charge_payment_type": "W",
        "session_id": sessionId,
        "application": "mobileapp"
     },
     {
        headers:{
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    }
     )
    const data = response.data
    return data 
}

//bid accept endpoint
async function bidaccept(Id,paymentmethod,paymentmethod1,sessionId, token){
  const url = 'https://igoeppms.com/igoepp/public/api/auth/hrequest/acceptbid'

  const response = await axios.post(url, {
      "bidid": Id,
      "payment_type": paymentmethod,
      // "payment_mode" : paymentmethod1,
      "charge_payment_type": "W",
      "session_id": sessionId,
      "application": "mobileapp"
   },
   {
      headers:{
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
      }
  }
   )
  const data = response.data
  return data 
}

//bid negotiate endpoint
async function bidnegotiate(Id, budget, token){
    const url = `https://igoeppms.com/igoepp/public/api/auth/hrequest/negotiate/${Id}`
    const response = await axios.put(url,
        {
            "budget": budget,
        },
        {
            headers:{
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        }
    ) 
    const data = response.data
    return data
}

//bid decline endpoint
async function biddecline(id, token){
    const url = `https://igoeppms.com/igoepp/public/api/auth/hrequest/declinebidrequest/${id}`

    const response = await axios.get(url, {
        headers:{
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    })
    const data = response.data
    return data
}

//helper details endpoint
async function helpersurl(id, token){
    const url = `https://igoeppms.com/igoepp/public/api/auth/helper/${id}`
    const response = await axios.get(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    const data = response.data.data
    return data;
} 

//wallet balance endpoint
async function walletbal(customerId, token){
    const url = `https://igoeppms.com/igoepp/public/api/auth/customer/${customerId}/wallet`
      const response = await axios.get(url, {
        headers:{
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      const data = response.data
      return data;
}

//customer info/details endpoint
async function customerinfocheck(customer_id, token){
  const url = `https://igoeppms.com/igoepp/public/api/auth/customer/${customer_id}`
  const response = await axios.get(url, {
    headers:{
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data.data
  return data
}

//all customer notification endpoint
async function notification(Id, token){
  const url = `https://igoeppms.com/igoepp/public/api/auth/general/viewpushnotification/${Id}`
  const response = await axios.get(url, {
    headers:{
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data.data
  return data

}

async function notificationunread(Id, token){
  const url = `https://igoeppms.com/igoepp/public/api/auth/general/viewpushnotificationcount/${Id}`
  const response = await axios.get(url, {
    headers:{
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data
  return data

}
async function notificationbyid(Id, token){
  const url = `https://igoeppms.com/igoepp/public/api/auth/general/viewpushnotificationbyid/${Id}`
  const response = await axios.get(url, {
    headers:{
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data
  return data

}




//all transaction made by customer endpoint
async function alltransaction(customerId, token){
  const url = `https://igoeppms.com/igoepp/public/api/auth/customer/alltransactions/${customerId}`
  const response = await axios.get(url, {
    headers:{
      Accept:'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data.data
  return data
}

//transaction made in cart purchase endpoint
async function cartpurchase(customerId, token){
  const url = `https://igoeppms.com/igoepp/public/api/auth/purchaseheaderbycustid/${customerId}`
  const response = await axios.get(url, {
    headers:{
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data.data
  return data;
} 

//wallet trasactions made by customer
async function wallettransaction(customerId, token){
  const url = `https://igoeppms.com/igoepp/public/api/auth/customer/wallettransactions/${customerId}`
  const response = await axios.get(url, {
    headers:{
      Accept:'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data.data
  return data
}


async function marketplaceitemsget(token){
  const response = await axios.get("http://igoeppms.com/igoepp/public/api/auth/globalproductcategory", {
    headers:{
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data.data
  return data;
}

//cart check endpoint
async function cart(Id, token){
  const url = `https://igoeppms.com/igoepp/public/api/auth/cart/${Id}`
  const response = await axios.get(url, {
    headers:{
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data.data
  return data;
}

async function cartitem(categoryId, token){
  const response = await axios.get(`https://igoeppms.com/igoepp/public/api/auth/productbycatshow/${categoryId}`, {
    headers:{
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
    }
  })
  const data = response.data
  return data;
}


//cart items store endpoint

async function cartitemstore(productId,quantity,customerId,supplierId,token){
const url = 'https://igoeppms.com/igoepp/public/api/auth/cart/store'
    const response = await  axios.post(url, {

      'product_id':productId,
      'quantity': quantity,
      'customer_id':customerId,
      'supplier_id': supplierId
    },
    {
        headers:{
            Accept: 'application/json',
            Authorization : `Bearer ${token}`
        }
    })
    const data = response.data
    return data;
}

//cart item delete endpoint
async function deletefromcart(id, token){
  const url  = `https://igoeppms.com/igoepp/public/api/auth/cart/${id}/delete`
  // const url = ''
  const response = await axios.delete(url, {
      headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
    }
  })
  const data = response.data
  return data;
}

//cart checkout endpoint
async function cartcheckout(first_name,last_name, address,landmark,phone,email,stateName, cityName, countryName,  customerId,  paymentmethod, token){

  const url = 'https://igoeppms.com/igoepp/public/api/auth/checkout/store'
  
  const response = await axios.post(url, {
    'firstname': first_name,
    'lastname': last_name,
    'delivery_address': address,
    'delivery_landmark': landmark,
    'delivery_phone': phone,
    'delivery_email': email,
    'delivery_state': stateName,
    'delivery_lga':cityName,
    'delivery_country': countryName,
    'customer_id': customerId,
    'payment_mode': paymentmethod
  }, {
    headers:{
      Accept: 'application/json',
      Authorization : `Bearer ${token}`
    }
  })

  const data = response.data
  return data;
}

async function cartcheckoutcash(first_name,last_name, address,landmark,phone,email,stateName, cityName, countryName,  customerId,  paymentmethod, token){

  const url = 'https://igoeppms.com/igoepp/public/api/auth/checkout/storecash'
  
  const response = await axios.post(url, {
    'firstname': first_name,
    'lastname': last_name,
    "delivery_address": address,
    'delivery_landmark': landmark,
    'delivery_phone': phone,
    'delivery_email': email,
    'delivery_state': stateName,
    'delivery_lga':cityName,
    "payment_mode": paymentmethod,
    'delivery_country': countryName,
    'customer_id': customerId,
    "charge_payment_mode": "W"
  }, {
    headers:{
      Accept: 'application/json',
      Authorization : `Bearer ${token}`
    }
  })

  const data = response.data
  return data;
}

//forgot customer password 
async function forgotpass(email){
    const url = "https://igoeppms.com/igoepp/public/api/customer/forgetpassword"
    const response = await axios.post(url, {
      "email": email
    })
    const data = response.data
    return data
  }

//profile update endpoint
async function profileupdate(last_name, first_name, sex, phone, customerId, token, countryName, stateName, cityName){
  const response = await axios.put(
      `https://igoeppms.com/igoepp/public/api/auth/customer/${customerId}/update`, 
      {
          'last_name': last_name,
          'first_name': first_name,
          'phone': phone,
          'sex':sex,
          'Country': countryName,
          'State': stateName,
          'lga': cityName  
      },{
        headers:{
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )
   const data = response.data.data
   return data;
}

//view cart hstory by purchase id endpoint
async function carthistorypreview(purchaseid, token){
  const url = `https://igoeppms.com/igoepp/public/api/auth/purchaseview/${purchaseid}`
  const response = await axios.get(url, {
    headers:{
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data
  return data;
}



//dispute endpoint
async function disputelog(id, description, token){
  const url = `https://igoeppms.com/igoepp/public/api/auth/hrequest/dispute`
  const response = await axios.post(url,{
      book_id: id,
      description: description
  },{
      headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
      }
  }) 
  const data = response.data.message
  return data
}

//wallet update endpoint
async function walletupdate(Id, token, InputAmount){
  const response = await axios.post(
    `https://igoeppms.com/igoepp/public/api/auth/customer/walletupdate`, 
    {
        'wallet_balance': InputAmount,
        'customer_id': Id
    },{
      headers:{
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
  )
  const data = response.data.wallet_balance
  return data;
}


// get bills category endpoint
async function customerbiller(token){
  const url = `https://igoeppms.com/igoepp/public/api/auth/billpayment/getBillCategory`
  const response = await axios.get(url, {
      headers:{
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
      }
  })

  const data = response.data
  return data;
}


async function customerbillercommission(id, token){
  const url = `https://igoeppms.com/igoepp/public/api/auth/billpayment/getMyBillersByBillerID/${id}`
  const response = await axios.get(url, {
    headers:{
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response.data
  return data;
}




async function customerbillerbyid(id, token){
  const url = `https://igoeppms.com/igoepp/public/api/auth/billpayment/getAllBillersByCategory/${id}`
  const response = axios.get(url, {
      headers:{
          Accept:'application/json',
          Authorization: `Bearer ${token}`
      }
  })

  const data = response.data.data.data
  return data
}

//validate helper thirdparty phone number
async function customerthirdparty(id, phone, token){
  const url = `https://igoeppms.com/igoepp/public/api/auth/billpayment/validateCustomerPhoneThirdParty`
  const response = await axios.post(url, {
    "customerID": id,
    "phoneNumber": phone,
    "type": "C"
  }, {
      headers:{
        Accept:'application/json',
        Authorization:`Bearer ${token}`
      }
  })
  
  const data = response.data
  return data
}

//validate helper self phone number
async function helperSelf(id, token){
  const url = `https://igoeppms.com/igoepp/public/api/auth/billpayment/validateCustomerPhone`
  const response = await axios.post(url, {
      "customerID": id,
      "type": "C"
  }, {
      headers:{
          Accept:'application/json',
          Authorization:`Bearer ${token}`
      }
  })
  const data = response.data
  return data
}

// buy airtime endpoint 
async function customervtuairtime( requestid, billerId, amount, token, commission){
  const url = `https://igoeppms.com/igoepp/public/api/auth/billpayment/vtuPaymentAirtime`
  const response = await axios.post(url, {
    "requestID": requestid,
    "billerId": billerId,
    "amount": amount,
    "commission": commission
  }, {
      headers:{
          Accept:'application/json',
          Authorization:`Bearer ${token}`
      }
  })

  const data = response.data
  return data
}

//buy data endpoint, 
async function customervtudata(requestid, billerId, amount, bouquetCode, token, commission){
  const url = `https://igoeppms.com/igoepp/public/api/auth/billpayment/vtuPaymentData`
  const response = await axios.post(url, {
    "requestID":  requestid,
    "billerId": billerId,
    "amount": amount,
    "bouquetCode": bouquetCode,
    "commission": commission
  }, {
      headers:{
          Accept:'application/json',
          Authorization:`Bearer ${token}`
      }
  })
  const data = response.data 
  return data
}

//validate internet endpoint 
async function validateinternet(id, billerId, smartCardID, token){
  const url = `https://igoeppms.com/igoepp/public/api/auth/billpayment/validateCustomerInternet`
  const response = axios.post(url, {
    "customerID": id,
    "billerID": billerId,
    "type": "C",
    "smartCardID": smartCardID.toString()
  }, {
      headers:{
          Accept:'application/json',
          Authorization: `Bearer ${token}`
      }
  })
  const data =  response
  return data
}

//pay for internet endpoint
async function internetPayment(requestID, amount, bouquetCode, token, commission){
  const url = `https://igoeppms.com/igoepp/public/api/auth/billpayment/internetPayment`
  const response = axios.post(url, {
    "requestID": requestID,
    "amount": amount,
    "bouquetCode": bouquetCode,
    "commission": commission
  }, {
      headers:{
          Accept:'application/json',
          Authorization: `Bearer ${token}`
      }
  })
  const data =  response
  return data
}


//vallidate bet account endpoint
async function validatebet(id, billerID, betnijaID, token){
  const url = `https://igoeppms.com/igoepp/public/api/auth/billpayment/validateCustomerBet`
  const response = axios.post(url, {
    "customerID": id,
    "billerID": billerID,
    "type": "C",
    "betnijaID": betnijaID
  }, {
      headers:{
          Accept:'application/json',
          Authorization: `Bearer ${token}`
      }
  })
  const data = response
  return data
}

// make payment for bet account endpoint
async function betpay(requestID,amount,token, commission){
  const url = `https://igoeppms.com/igoepp/public/api/auth/billpayment/betBillPayment`
  const response = axios.post(url, {
    "requestID": requestID,
    "amount": amount,
    "commission": commission
  }, {
      headers:{
          Accept:'application/json',
          Authorization: `Bearer ${token}`
      }
  })
  const data = response
  return data
}

//purchase waec card endpoint
async function waeccard(id,billerID,bouquetCode,amount,token, commission) {
  const url = `https://igoeppms.com/igoepp/public/api/auth/billpayment/purchaseWaecPin`
  const response = axios.post(url, {
    "customerID": id,
    "billerID": billerID,
    "type": "C",
    "bouquetCode": bouquetCode,
    "amount": amount,
    "commission": commission
  }, {
      headers:{
          Accept:'application/json',
          Authorization:`Bearer ${token}`
      }
  })

  const data =  response 
  return data
}

//validate customer electricity number
async function validatedisco(id, billerID, meterID, token){
  const url = `https://igoeppms.com/igoepp/public/api/auth/billpayment/validateCustomerDisco`
  const response = axios.post(url, {
    "customerID": id,
    "billerID": billerID,
    "type": "C",
    "meterID": meterID,
  }, {
      headers:{
          Accept:'application/json',
          Authorization: `Bearer ${token}`
      }
  })

  const data = response
  return data 
}

// customer electricity payment
async function discopayment(requestID, amount, token, commission){
  const url = `https://igoeppms.com/igoepp/public/api/auth/billpayment/discoPayment`
  const response = await axios.post(url, {
    "requestID": requestID,
    "amount": amount,
    "commission": commission        
  }, {
      headers:{
          Accept:'application/json',
          Authorization: `Bearer ${token}`
      }
  })

  const data = response.data
  return data
}

// validate multichoice endpoint
async function validatetv(id, billerID, smartCardID, token){
  const url = `https://igoeppms.com/igoepp/public/api/auth/billpayment/validateCustomerTv`
  const response = axios.post(url, {
      "customerID": id,
      "billerID": billerID,
      "type": "C",
      "smartCardID": smartCardID
  }, {
      headers:{
          Accept:'application/json',
          Authorization:`Bearer ${token}`
      }
  })

  const data = response
  return data 
}

//multichoice payment endpoint

async function tvpay(requestID, amount, bouquetCode, token, commission){
  const url = `https://igoeppms.com/igoepp/public/api/auth/billpayment/tvPayment`
  const response = axios.post(url, {
    "requestID": requestID,
    "amount": amount,
    "bouquetCode": bouquetCode,
    "commission": commission
  }, {
      headers:{
          Accept:'application/json',
          Authorization:`Bearer ${token}`
      }
  })

  const data = response
  return data
}

//multichoice payment for renewal endpoint
async function tvrenewalpay(requestID, amount, token, commission){
  const url = `https://igoeppms.com/igoepp/public/api/auth/billpayment/tvPaymentRenewal`
  const response = axios.post(url, {
      "requestID": requestID,
      "amount": amount,
      "commission": commission
  }, {
      headers:{
          Accept:'application/json',
          Authorization: `Bearer ${token}`
      }
  })

  const data = response 
  return data
}


//get helper by helper id endpoint
async function helperget(id, token){
  const url = `https://igoeppms.com/igoepp/public/api/auth/helper/${id}`
  const response = axios.get(url, {
    headers:{
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response
  return data
}


//get all helper request helper id endpoint
async function helpergetallrequest(id, token){
  const url = `https://igoeppms.com/igoepp/public/api/auth/hrequest/showrequestbyhelperid/${id}`
  const response = axios.get(url, {
    headers:{
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response
  return data
}


//customer satified endpoint
async function customersatisfied(bookId, token){
  const url = `https://igoeppms.com/igoepp/public/api/auth/hrequest/customersatisfy`
  const response = axios.post(url,{
      "book_id": bookId,
      "customer_statisfy": "Y",
  }, {
    headers:{
      Accept:'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = response
  return data
}


//customer not satified endpoint
async function customernotsatisfied(bookId, reason, token){
  const url = `https://igoeppms.com/igoepp/public/api/auth/hrequest/customersatisfy`
  const response = axios.post(url, {
    "book_id":bookId,
    "customer_statisfy": "N",
    "customer_notstatisfy_reason": reason
}, {
    headers:{
      Accept:'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data  = response
  return data
}


//helper rating
async function ratehelper(id, rating, ratecomment, token){
  const url = `https://igoeppms.com/igoepp/public/api/auth/hrequest/customerrating`
  const response = axios.post(url, {
    "book_id": id,
    "rating": rating,
    "rating_comment": ratecomment
  }, {
      headers:{
          Accept:'application/json',
          Authorization: `Bearer ${token}`
      }
  })
  const data = response 
  return data
}

async function trendingservice(token){
  const url = `https://igoeppms.com/igoepp/public/api/auth/hrequest/fromtodayservicemarkettrend`
  const response = axios.get(url, {
      headers:{
          Accept:'application/json',
          Authorization: `Bearer ${token}`
      }
  })
  const data = response
  return data
}


async function viewhelperrating(id, token){
  const url = `https://igoeppms.com/igoepp/public/api/auth/hrequest/showratingofhelper/${id}`
  const response = axios.get(url, {
      headers:{
          Accept:'application/json',
          Authorization: `Bearer ${token}`
      }
  })
  const data = response
  return data
}

async function viewhelperratingonrequest (id, token){
  const url = `https://igoeppms.com/igoepp/public/api/auth/hrequest/showrequestwithratingbyhelperid/${id}`
  const response = axios.get(url, {
    headers:{
      Accept: `application/json`,
      Authorization: `Bearer ${token}`
    }
  })
  const data = response
  return data
}

async function customeruploadAddressproof(picture,id,token){
  const url = `https://igoeppms.com/igoepp/public/api/auth/compliance/uploadcustomeraddressdoc`
  const response = await axios.post(url, {
      picture: picture,
      customerid:id,
  }, {
      headers:{
          Accept:'application/json',
          Authorization:`Bearer ${token}`
      }
  })

  const data = response.data
  return data
}
//guarantors upload ID card image endpoint
async function customeruploadIdcard(picture,id,token){
  const url = `https://igoeppms.com/igoepp/public/api/auth/compliance/uploadcustomeridcard`
  const response = await axios.post(url, {
      picture: picture,
      customerid:id,
  }, {
      headers:{
          Accept:'application/json',
          Authorization:`Bearer ${token}`
      }
  })

  const data = response.data
  return data
}

async function viewalertsetup(id,token){
  const url = `https://igoeppms.com/igoepp/public/api/auth/customer/${id}/custalertsetupview`
  const response = axios.get(url, {
    headers:{
      Accept: `application/json`,
      Authorization: `Bearer ${token}`
    }
  })

  const data = response
  return data
}

async function enablealert(id, event_type, alert_type, token){
  const url = `https://igoeppms.com/igoepp/public/api/auth/customer/custalertsetups`
  const response = axios.post(url,
    {
      "customer_id":id,
      "event_type":event_type,
      "alert_type":alert_type
    }, {
      headers:{
        Accept: `application/json`,
        Authorization: `Bearer ${token}`
      }
  })

  const data = response
  return data
}


async function uploadimage(uploadUrl, id, token){
  const response = await axios.post('https://igoeppms.com/igoepp/public/api/auth/customer/uploadpicture', {
    picture: uploadUrl,
    customerid: id
  },{
    headers:{
      Accept:'application/json',
      Authorization:`Bearer ${token}`
    }
  })
  const data = response 
  return data
}

async function sliderimage(token){
  const url = `https://igoeppms.com/igoepp/public/api/auth/general/getSlidesByApp/customer`
  const response = await axios.get(url, {
    headers:{
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  const data = response.data
  return data
}

async function resetpin(id, pin, token){
  const url = `https://igoeppms.com/igoepp/public/api/auth/customer/resetpin`
  const response = await axios.post(url,{
    "pin": pin,
    "customer_id": id
  }, {
    headers:{
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  const data = response.data
  return data
}

async function sendfeedback(id, subject, message, token){
  const url = `https://igoeppms.com/igoepp/public/api/auth/customer/customerfeedback`
  const response = await axios.post(url,{
    "customer_id": id,
    "subject" : subject,
    "message": message
  }, {
    headers:{
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  const data = response.data
  return data
}

async function biometricsetup(id, fingerprinttoken,  token){
  const url = `https://igoeppms.com/igoepp/public/api/auth/customer/setupbiometric`
  const response = axios.post(url, {
    "finger_print": fingerprinttoken,
    "customer_id": id
  }, {
    headers:{
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  const data = response
  return data;
}

async function disablebiometric(id, token){
  const url = `https://igoeppms.com/igoepp/public/api/auth/customer/${id}/disablebiometric`
  const response = axios.get(url, {
    headers:{
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  const data = response
  return data;
}

async function loginwithbiometric(fingerprinttoken){
  const url = `https://igoeppms.com/igoepp/public/api/igoeppauth/logincustomerbiometric`
  const response = axios.post(url, {
    "biometric": fingerprinttoken,
  }) 

  const data = response
  return data
}

async function setuppin(id, pin, token){
  const url = `https://igoeppms.com/igoepp/public/api/auth/customer/setuppin`
  const response = axios.post(url, {
    "pin": pin,
    "customer_id": id,
  }, {
    headers:{
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }) 
  const data = response
  return data
}

async function validatepin(id, pin, token){
  const url = `https://igoeppms.com/igoepp/public/api/auth/customer/validatepin`
  const response = axios.post(url, {
    "pin": pin,
    "customer_id": id
  }, {
    headers:{
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }) 
  const data = response
  return data
}

async function updatepin(id, pin, token){
  const url = `https://igoeppms.com/igoepp/public/api/auth/customer/resetpin`
  const response = axios.post(url, {
    "pin": pin,
    "customer_id": id
  }, {
    headers:{
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }) 
  const data = response
  return data
}

async function customerresetpassword(email, password, token){
  const url = `https://igoeppms.com/igoepp/public/api/auth/customer/customerpasswordreset`
  const response = axios.post(url, {
    "password": password,
    "email": email
  }, {
    headers:{
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }) 
  const data = response
  return data
}








//SignUp
export  function SignUp(email, password,gender, phone, firstname, lastname,identification_type,identification_num, referral_code) {
  return authenticateSignUp(email, password, gender, phone, firstname, lastname, identification_type,identification_num, referral_code)
}

export function MarketPlaceItemsGet(token){
  return marketplaceitemsget(token)
}

//Login 
export function LoginUrl(email, password){
  return authenticateLogin(email, password)
}


export const ValidateLogin = (email, password) => {
  return validateLogin(email, password)
}
//Forgot Password
export function ForgotCustomerPassword(email){
  return forgotpass(email)
}


// view cart history by purchase Id
export function CartHistoryPreview(purchaseid, token){
  return carthistorypreview(purchaseid, token)
}
//session id
export function SessionIDCheck(email,token){
  return sessionId(email, token)   
}

//

//category
export function Category(){
  return category()
}

//subcategory
export function SubCategories(categoryId){
  return subcategory(categoryId)
}

//help Requests info
export function RequestInfo(customerId,interest,addressfield,countryName,stateName,cityName,
    landmark,helpsize,vehiclerequest,description,catId,subcatId,helptime,maindate,frequency, preassessment, token){

    return requestinfo(customerId,interest,addressfield,countryName,stateName,cityName,
    landmark,helpsize,vehiclerequest,description,catId,subcatId,helptime,maindate,frequency, preassessment, token)
}

//requests
export function ShowFetchedRequests(customerId, token){
  return fetchedData(customerId, token)
}

export const ViewHelperRatingonRequest =  (id, token) => {
  return viewhelperratingonrequest(id, token)
}

//request by id
export function ShowFetchedRequestsById(requestid, token){
  return fetchrequestbyid(requestid, token)
}

//all customer transaction 
export function AllTransaction(customerId, token){
  return alltransaction(customerId, token)
}

//all wallet transaction 
export function WalletTransaction(customerId, token){
  return wallettransaction(customerId, token)
}

//all cart transactions
export function CartPurchase(customerId, token){
  return cartpurchase(customerId, token)
}

//cancel request
export function CancelRequests(id, token, reason){
  return cancelrequests(id, token, reason)
  }

//bid request
export function BidRequests(bid_id, token){
  return bidrequests(bid_id, token)
}

//bid accept
export function BidAcceptCash(Id,paymentmethod,paymentmethod1,sessionId, token){
  return bidacceptcash(Id,paymentmethod,paymentmethod1,sessionId,token)
}

export function BidAccept(Id,paymentmethod,paymentmethod1,sessionId, token){
  return bidaccept(Id,paymentmethod,paymentmethod1,sessionId,token)
}

//bid negotiate
export function BidNegotiate(Id,budget, token){
  return bidnegotiate(Id, budget, token)
}

//bid decline
export function BidDecline(id, token){
  return biddecline(id, token)
}

//all notification 
export function Notification(Id, token){
  return notification(Id, token)
}

//helper url
export function HelpersUrl(id, token){
  return helpersurl(id, token)
}

//wallet preview
export function WalletBalance(customerId,token){
  return walletbal(customerId, token)    
}

//customer info preview
export function CustomerInfoCheck(customer_id, token){
  return customerinfocheck(customer_id, token)
}

// cart 
export function Cart(Id, token){
  return cart(Id, token)
}

//cartitems
export function CartItem(categoryId, token){
  return cartitem(categoryId, token)
}

//store cart items
export function CartItemStore(productId,quantity,customerId,supplierId,token){
  return cartitemstore(productId,quantity,customerId,supplierId,token)
}

//delete item in cart
export function DeleteFromCart(id, token){
  return deletefromcart(id, token)
}

// Cart item Checkout
export function CartCheckout(first_name,last_name, address,landmark,phone,email,stateName, cityName, countryName,  customerId,  paymentmethod, token){
  return cartcheckout(first_name,last_name, address,landmark,phone,email,stateName,cityName,countryName,  customerId,  paymentmethod, token)
}

export function CartCheckoutCash(first_name,last_name, address,landmark,phone,email,stateName, cityName, countryName,  customerId,  paymentmethod, token){
  return cartcheckoutcash(first_name,last_name, address,landmark,phone,email,stateName,cityName,countryName,  customerId,  paymentmethod, token)
}



export function ProfileUpdate(last_name, first_name, sex, phone, customerId, token, countryName, stateName, cityName){
  return profileupdate(last_name, first_name, sex, phone, customerId, token, countryName, stateName, cityName)
}

export function DisputeLog(id, description, token){
  return disputelog(id, description, token)
}

export function WalletUpdate(Id, token, InputAmount){
  return walletupdate(Id, token, InputAmount)
}
// customerId, type, token


//helper billers
export const CustomerBiller = async (token) => {
  return customerbiller(token)
}


export const CustomerBillerCommission = (id, token) => {
  return customerbillercommission(id, token)
}


//get helper biller  by id
export const CustomerBillerById = (id, token) => {
  return customerbillerbyid(id, token)
}


export const CustomerThirdParty = (id, phone, token) => {
  return customerthirdparty(id, phone, token)
}

export const CustomerVtuAirtime = (requestid, billerId, amount, token, commission) => {
  return customervtuairtime(requestid, billerId, amount, token, commission)
}

export const CustomerVtuData = (requestid, billerId, amount, bouquetCode, token, commission) => {
  return customervtudata(requestid, billerId, amount,bouquetCode, token, commission)
}

export const CustomerSelf = (id, token) => {
  return helperSelf(id, token)
}

export const ValidateInternet = (id, billerId, smartCardID, token) => {
  return validateinternet(id, billerId, smartCardID, token)
}

export const InternetPayment = (requestID, amount, bouquetCode, token, commission) => {
  return internetPayment(requestID, amount, bouquetCode, token, commission)
}

export const ValidateBet = (id, billerID, betnijaID, token) => {
  return validatebet(id, billerID, betnijaID, token)
}

export const BetPay = (requestID, amount, token, commission) => {
  return betpay(requestID, amount, token, commission)
}

export const WaecCard = (id,billerID,bouquetCode,amount,token, commission) => {
  return waeccard(id,billerID,bouquetCode,amount,token, commission)
}

export const ValidateDisco = (id, billerID, meterID, token) => {
  return validatedisco(id, billerID, meterID, token)
}

export const DiscoPayment = (requestID, amount, token, commission) => {
  return discopayment(requestID, amount, token, commission)
}

export const ValidateTv = (id, billerID, smartCardID, token) => {
  return validatetv(id, billerID, smartCardID, token)
}

export const TvPayment = (requestID, amount, bouquetCode, token, commission) => {
  return tvpay(requestID, amount, bouquetCode, token, commission)
}

export const TvRenewalPay = (requestID, amount, token, commisson) => {
  return tvrenewalpay(requestID, amount, token, commisson)
}

export const HelperGet = (id, token) => {
  return helperget(id, token)
}

export const HelperGetAllRequest = (id, token) => {
  return helpergetallrequest(id, token)
}

export const CustomerSatisfied = (bookId, token) => {
  return customersatisfied(bookId, token)
}

export const CustomerNotSatisfied = (bookId, reason, token) => {
  return customernotsatisfied(bookId, reason, token)
}

export const RateHelper = (id, rating, ratecomment, token) => {
  return ratehelper(id, rating, ratecomment, token)
}

export const TrendingService = (token) => {
  return trendingservice(token)
}

export const ViewHelperRating = (id, token) => {
  return viewhelperrating(id, token)
}

export const CustomerUploadAddressproof = (picture, id, token) => {
  return customeruploadAddressproof(picture, id, token)
}

export const CustomerUploadIdCard = (picture, id, token) => {
  return customeruploadIdcard(picture, id, token)
}

export const ViewAlertSetup = (id, token) => {
  return viewalertsetup(id, token)
}

export const EnableAlert = (id, event_type, alert_type, token) => {
  return enablealert(id, event_type, alert_type, token)
}

export const UploadImage = (uploadUrl, id, token) => {
  return uploadimage(uploadUrl, id, token)
}

export const SliderImage = (token) => {
  return sliderimage(token)
}

export const ResetPin = (id, pin, token) => {
  return resetpin(id, pin, token)
}

export const SendFeedBack = (id, suject, message, token) => {
  return sendfeedback(id, suject, message, token)
}

export const BiometricSetup = (id, fingerprinttoken, token) => {
  return biometricsetup(id, fingerprinttoken, token)
}

export const DisableBiometric = (id, token) => {
  return disablebiometric(id, token)
}

export const LoginWithBiometric = (fingerprinttoken) => {
  return loginwithbiometric(fingerprinttoken)
}

export const SetupPin = (id, pin, token) => {
  return setuppin(id, pin, token)
}

export const ValidatePin = (id, pin, token) => {
  return validatepin(id, pin, token)
}


export const UpdatePin = (id, pin, token) => {
  return updatepin(id, pin, token)
}

export const CustomerResetPassword = (email, password, token) => {
  return customerresetpassword(email, password, token)
}

export const NotificationUnread = (id, token) => {
  return notificationunread(id, token)
}

export const NotificationById = (id, token) => {
  return notificationbyid(id, token)
}

