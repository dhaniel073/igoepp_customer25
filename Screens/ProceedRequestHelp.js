import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Color, marginStyle } from '../Component/Ui/GlobalStyle'
import GoBack from '../Component/Ui/GoBack'
import { Image } from 'expo-image'
import SubmitButton from '../Component/Ui/SubmitButton'

const ProceedRequestHelp = ({route, navigation}) => {
  const subcatId = route?.params?.subcategoryId
    const subcatName = route?.params?.subcategoryName
    const subcatDesc = route?.params?.subcategoryDesc
    const preassessment = route?.params?.preassessment
    const catId = route?.params?.catId
    const image = route?.params?.image
  return (
    <SafeAreaView style={{marginTop: marginStyle.marginTp, marginHorizontal:10, flex:1}}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <Text style={styles.proceedrequesttxt}>ProceedRequestHelp</Text>

      <View style={styles.image2container}>
        <Image
        style={styles.image2}
        contentFit='contain'
        source={{ uri: `https://igoepms.com/igoepp/public/subcategory/${image}` }}
        />
      </View>

      <Text style={styles.catNameText}>{subcatName}</Text>
      <Text style={styles.catDescText}>{subcatDesc}</Text>

      <View style={{marginHorizontal:20}}>
        <SubmitButton onPress={() => navigation.navigate("RequestSendInfo", {
          subcatId: subcatId,
          subcatDesc: subcatDesc,
          subcatName: subcatName,
          catId: catId,
          preassessment:preassessment
          
        })} message={'Proceed'}/>
      </View>
    </SafeAreaView>
  )
}

export default ProceedRequestHelp

const styles = StyleSheet.create({
  proceedrequesttxt:{
    fontSize: 18,
    color: Color.darkolivegreen_100,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
    marginBottom:15,
  }, 
  image2:{
    width:  350,
    height: 350,
  },
  image2container:{
    alignItems:'center',
    marginTop: 25,
    // borderWidth:1
  },
  catNameText:{
    fontFamily: 'poppinsBold',
    textAlign: "center",
    marginTop: 30,
    color: Color.darkolivegreen_100,
  },
  catDescText:{
    color: Color.darkolivegreen_100,
    fontFamily: 'poppinsRegular',
    fontSize: 14,
    textAlign: "center",
    // marginHorizontal: 30
  }
})