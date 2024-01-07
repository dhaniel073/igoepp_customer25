import { FlatList, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { Color, DIMENSION, marginStyle } from '../Component/Ui/GlobalStyle'
import GoBack from '../Component/Ui/GoBack'
import { AuthContext } from '../utils/AuthContext'
import { Category } from '../utils/AuthRoute'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'
import { Image } from 'expo-image'

const RequestHelp = ({navigation}) => {
  const authCtx = useContext(AuthContext)
  const [fetchedcategory, setFetchedCategory] = useState('')
  const [fetchedName, setFetchedName] = useState('')
  const [isFetching, setIsFetching] = useState(true)


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
    fetchCategorydata();
    })
    return unsubscribe;
  },[])

  const fetchCategorydata = async () => {
    try {
      setIsFetching(true)
      const response = await Category()
      // console.log(response)
      setFetchedCategory(response)
      setIsFetching(false)
    } catch (error) {
      // console.log(error.response)
      Alert.alert("Error", "Error fetching Subcategories", [
        {
          text: "Ok",
          onPress: () => navigation.goBack()
        }
      ])
      return;

    }
  }

  if(isFetching){
    return <LoadingOverlay message={"..."}/>
  }


  return (
    <SafeAreaView style={{marginTop: marginStyle.marginTp, marginHorizontal:10, flex:1}}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <View style={{flexDirection:'row', justifyContent:'space-between'}}>
      <Text style={styles.makerequesttxt}>RequestHelp</Text>
      <Text style={styles.name}>Hi {authCtx.firstname}</Text>
      </View>
      <FlatList        
        showsVerticalScrollIndicator={false}
        data={fetchedcategory}
        estimatedItemSize={200}
        style={{marginBottom:'1%'}}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => 
          <View style={styles.container}  >

            <TouchableOpacity style={[styles.pressables]} onPress={() => navigation.navigate("SubCategory", {
              categoryId: item.id,
              first_name: fetchedName.first_name
            })}>
            <Image
            style={styles.image2}
            source={{ uri:`https://igoeppms.com/igoepp/public/category/${item.image}`  }}
            />

              <Text style={styles.item}>
                {item.cat_name}
              </Text>
            </TouchableOpacity>
          </View>
          }
        numColumns={2}
        /> 

      
    </SafeAreaView>
  )
}



export default RequestHelp

const styles = StyleSheet.create({

  container: {
    // padding: 5,
    flex: 1,
    justifyContent:'space-between',
    // marginBottom: 20

  },
  makerequesttxt:{
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