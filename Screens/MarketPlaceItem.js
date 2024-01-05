import { Alert, FlatList, SafeAreaView, StyleSheet, Text, View , TouchableOpacity} from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Color, DIMENSION, marginStyle } from '../Component/Ui/GlobalStyle'
import GoBack from '../Component/Ui/GoBack'
import { Image } from 'expo-image'
import { AuthContext } from '../utils/AuthContext'
import { CartItem } from '../utils/AuthRoute'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'

const MarketPlaceItem = ({navigation, route}) => {
  const authCtx = useContext(AuthContext)
  const categoryId = route.params.categoryId
  const [isFetching, setIsFetching] = useState(false)
  const [fetchedcategory, setFetchedCategory] = useState([])


  useEffect(() => {
    async function fetchData(){
      try{
        setIsFetching(true)
        const response = await CartItem(categoryId, authCtx.token)
        console.log(response)
        setFetchedCategory(response)
        setIsFetching(false)
      }catch(error){
        // console.log(error)
        setIsFetching(true)
        Alert.alert("Error", "Error fetching Market Items", [
          {
            text: "Ok",
            onPress: () => navigation.goBack()
          }
        ])
        setIsFetching(false)
      }
    }
    fetchData()
  }, [])

  const NoItemNote = () => {
    return (
      <View style={{ justifyContent:'center', alignItems:'center',marginTop: DIMENSION.HEIGHT * 0.33}}>
        <Text style={{ fontSize: 14, color: 'grey', fontFamily: 'poppinsSemiBold' }}>No Items Available</Text>
      </View>
    )
  }

  if(isFetching){
    return <LoadingOverlay message={"..."}/>
  }

  return (
    <SafeAreaView style={{marginTop: marginStyle.marginTp, marginHorizontal:10, flex:1}}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <View style={{flexDirection:'row', justifyContent:'space-between'}}>
        <Text style={styles.mrktplaceitem}>MarketPlace Item</Text>
        <Text style={styles.name}>Hi {authCtx.firstname}</Text>
      </View>


      {fetchedcategory.length === 0  ? <NoItemNote/> :
        <FlatList
        showsVerticalScrollIndicator={false}
        data={fetchedcategory}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => 
          <View style={styles.container}  >
          <TouchableOpacity style={[styles.pressables]} onPress={() => navigation.navigate("MarketItemPurchase", {
            productId: item.id,
            productItemName: item.name,
            productItemDesc: item.description,
            productItemimage: item.picture,
            catId: item.product_category_id,
            price: item.price,
            shippingCost: item.shipping_cost,
            supplierId: item.supplier_id,
            available: item.available

          })}>
          <Image
          style={styles.image2}
          source={{ uri:`https://igoeppms.com/igoepp/public/products/${item.picture}`}}/>
            <Text style={styles.item}>{item.name}</Text>
            
          </TouchableOpacity>
          </View>
          }
        numColumns={2}
        /> 
      }
    </SafeAreaView>
  )
}

export default MarketPlaceItem

const styles = StyleSheet.create({
  mrktplaceitem:{
    fontSize: 18,
    color: Color.darkolivegreen_100,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
    marginBottom:15,
  }, 
  name:{
    fontFamily: 'poppinsRegular',
    fontSize: 11,
    color: Color.limegreen,
    marginRight: 10,
    marginTop: 16
  },
  pressables:{
    padding:20,
    width: DIMENSION.WIDTH *0.43,
    margin:10,
    height:DIMENSION.HEIGHT *0.17,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    elevation: 4,
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    backgroundColor: Color.mintcream,
    overflow: Platform.OS === 'andriod' ? 'hidden' : 'visible',
  },
  image2:{
    width: 50,
    height: 50,
    marginBottom: 15
  },
  item: {
    fontSize: 10,
    fontFamily: 'poppinsSemiBold',
    textAlign: 'center',
    color: Color.darkolivegreen_100
  },
})