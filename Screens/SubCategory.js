import { Alert, FlatList, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Color, DIMENSION, marginStyle } from '../Component/Ui/GlobalStyle'
import GoBack from '../Component/Ui/GoBack'
import { SubCategories } from '../utils/AuthRoute';
import Modal from 'react-native-modal'
import { AuthContext } from '../utils/AuthContext';
import { Image } from 'expo-image';
import LoadingOverlay from '../Component/Ui/LoadingOverlay';
import { Dropdown } from 'react-native-element-dropdown';


const data = [
  { label: 'New Request ', value: 'N' },
  { label: 'Preassessment Request ', value: 'Y' },
];


const SubCategory = ({route, navigation}) => {
  const categoryId = route.params.categoryId
  const [fetchedcategory, setFetchedCategory] = useState([])
  const [isFetching, setIsFetching] = useState(false)
  const [ismodalvisible, setIsModalVisible] = useState(false)
  const [isFocus, setIsFocus] = useState(false)
  const authCtx = useContext(AuthContext)

  const [preassessment, setPreassessment] = useState('')
  const [subcatId, setSubcatId] = useState()
  const [subcatName, setSubcatName] = useState()
  const [subcatDesc, setSubcatDesc] = useState()
  const [image, setImage] = useState()
  const [catId, setCatId] = useState()

  const toggleModal = (subcategoryId,subcategoryName,subcategoryDesc,image,catId,preassessment,) => {
    setIsModalVisible(!ismodalvisible)
    setPreassessment(preassessment)
    setSubcatId(subcategoryId)
    setSubcatName(subcategoryName)
    setSubcatDesc(subcategoryDesc)
    setImage(image)
    setCatId(catId)
  }


  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData(){
    try{
        setIsFetching(true)
        const response = await SubCategories(categoryId)
        // console.log(response)
        setFetchedCategory(response)
        setIsFetching(false)
    }catch(error){
      Alert.alert("Error", "Error fetching Subcategories", [
        {
          text: "Ok",
          onPress: () => navigation.goBack()
        }
      ])
      return;
    }
  }

  const NoSubCategoryNote = () => {
    return (
      <View style={{ justifyContent:'center', alignItems:'center', marginTop: '70%' }}>
        <Text style={{ fontSize: 14, color: 'grey', fontFamily: 'poppinsSemiBold' }}>No Sub-Category Found</Text>
      </View>
    )
  }

  const assesmentcheck = () => {
    if(preassessment === "Y"){
      navigation.navigate('ProceedRequestHelp', {
        subcategoryId: subcatId,subcategoryName: subcatName,subcategoryDesc: subcatDesc,
        image: image,catId: catId,preassessment: preassessment,
      })
      setPreassessment(),setSubcatId(),setSubcatName(),setSubcatDesc()
      setImage(),setCatId()
    }else{
      navigation.navigate('ProceedRequestHelp', {
        subcategoryId: subcatId,subcategoryName: subcatName,subcategoryDesc: subcatDesc,
        image: image,catId: catId,preassessment: preassessment, 
      })
      setPreassessment(),setSubcatId(),setSubcatName()
      setSubcatDesc(),setImage(),setCatId()
    }
  }

  if(isFetching){
    return <LoadingOverlay message={"..."}/>
  }



  return (
    <SafeAreaView style={{marginTop: marginStyle.marginTp, marginHorizontal:10, flex:1}}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <View style={{flexDirection:'row', justifyContent:'space-between'}}>
        <Text style={styles.subcategorytxt}>SubCategory</Text>
        <Text style={styles.name}>Hi {authCtx.firstname}</Text>
      </View>

      {fetchedcategory.length === 0 ? <NoSubCategoryNote/> :
      <FlatList
        showsVerticalScrollIndicator={false}
        data={fetchedcategory}
        style={{marginBottom:'1%'}}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => 
            <View style={styles.container}  >
              <TouchableOpacity style={[styles.pressables]} onPress={() => item.preassessment_flg === "N" ? 
                navigation.navigate('ProceedRequestHelp', {
                  subcategoryId: item.id,
                  subcategoryName: item.sub_cat_name,
                  subcategoryDesc: item.sub_cat_desc,
                  image: item.image,
                  catId: item.cat_id,
                  preassessment: item.preassessment_flg, 
                })
              : toggleModal(item.id, item.sub_cat_name, item.sub_cat_desc, item.image, item.cat_id, item.preassessment_flg)}>
              <Image
              style={styles.image2} contentFit='contain'
              source={{ uri:`https://phixotech.com/igoepp/public/subcategory/${item.image}`  }}
              />
                <Text style={styles.item}>
                  {item.sub_cat_name}
                </Text>
              </TouchableOpacity>
            </View>
            }
        numColumns={2}
        /> 
        }

    <Modal isVisible={ismodalvisible}>
      <SafeAreaView style={styles.centeredView}>
      <View style={styles.modalView}>
          <Text style={styles.modalText}>Request Type</Text>
          <View style={{ marginTop:10}}/>
            <Text style={styles.label}>Description</Text>
            {/* <SafeAreaView style={{ paddingLeft:10, paddingRight:10, paddingTop:10 }}> */}
            <Dropdown
              style={[styles.dropdown, isFocus && { borderColor: 'blue' },]}
              placeholderStyle={[styles.placeholderStyle,{fontFamily: 'poppinsRegular'}]}
              selectedTextStyle={[styles.selectedTextStyle, {fontFamily: 'poppinsRegular'}]}
              inputSearchStyle={[styles.inputSearchStyle, {fontFamily: 'poppinsRegular'}]}
              iconStyle={styles.iconStyle}
              data={data}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'Select Period' : '...'}
              searchPlaceholder="Search..."
              value={preassessment}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setPreassessment(item.value);
                setIsFocus(false);
            }}
          />
            {/* </SafeAreaView> */}
            <View style={{ marginBottom:20}}/>
            <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
              <TouchableOpacity style={styles.viewbtn} onPress={() => toggleModal()} >
                <Text style={styles.viewtext}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelbtn} onPress={() => [!preassessment ? Alert.alert('No Payment Method', 'Select a payment method to continue')  : [toggleModal(), assesmentcheck()]]}>
                <Text style={styles.canceltext}>Accept</Text>
              </TouchableOpacity>
            </View>
          <View style={{marginBottom:'3%'}}/>
          
        </View>
      </SafeAreaView>
    </Modal>


    </SafeAreaView>
  )
}

export default SubCategory

const styles = StyleSheet.create({
  label: {
    color: 'black',
    marginBottom: 5,
    fontSize: 16,
    fontFamily: 'poppinsMedium'
  },

  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
  },
  selectedTextStyle:{
    fontSize:13
  },
  iconStyle: {
    width: 20,
    height: 20,
  }, 
  placeholderStyle: {
    fontSize: 14,
    color: Color.gray
  },
  label: {
    marginTop:5,
    fontFamily: 'poppinsRegular'
  },
  viewbtn:{
    backgroundColor:Color.white,
    borderColor: Color.brown,
    borderWidth: 1,
    justifyContent:'center',
    borderRadius: 3,
    width: DIMENSION.WIDTH * 0.36,
    padding: 5
  },
  viewtext:{
    textAlign:'center',
    alignSelf:'center',
    fontFamily: 'poppinsMedium',
    fontSize: 12,
    color: Color.brown
  },
  cancelbtn: {
    backgroundColor: Color.darkolivegreen_100,
    borderRadius: 3,
    justifyContent:'center',
    width: DIMENSION.WIDTH * 0.36,
    padding: 5
  },
  canceltext:{
    fontFamily: 'poppinsMedium',
    fontSize: 12,
    color: Color.white,
    textAlign: "center",
  },
  subcategorytxt:{
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
    width: 70,
    height: 70,
    marginBottom: 15
  },
  item: {
    fontSize: 10,
    fontFamily: 'poppinsSemiBold',
    textAlign: 'center',
    color: Color.darkolivegreen_100
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
    fontSize:16, 
    fontFamily:'poppinsRegular'
  },
})