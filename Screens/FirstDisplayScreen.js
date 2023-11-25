import { StyleSheet, View, Text, SafeAreaView, Button, Pressable,TouchableOpacity} from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import {Image} from "expo-image"
import { Color, FontSize } from "../Component/Ui/GlobalStyle";



function FirstDisplayScreen({navigation}){

  const Down = ({...props}) => (
     <TouchableOpacity {...props} style={[styles.press]}>
       <Text style={styles.presstext}>Done</Text>
      </TouchableOpacity>
    )

    const Next = ({...props}) => (
      <TouchableOpacity {...props} style={[styles.press]}>
        <Text style={styles.presstext}>Next</Text>
       </TouchableOpacity>
     )

     const Skip = ({...props}) => (
      <TouchableOpacity {...props} style={[styles.skip]}>
        <Text style={styles.presstext}>Skip</Text>
       </TouchableOpacity>
     )

    return (
      <Onboarding
      onSkip={() => navigation.replace("Login")}
      onDone={() => navigation.navigate("Login")}
      // bottomBarColor= {Color.peru}
      bottomBarHeight={90}
      NextButtonComponent={Next}
      DoneButtonComponent={Down}
      SkipButtonComponent={Skip}
      titleStyles={styles.title}
      subTitleStyles={styles.subtitle}
      imageContainerStyles={styles.imageStyles}
      pages={
      
        [
        {
          backgroundColor: Color.dimgray_100,
          image: <Image contentFit="contain"  style={styles.image1} source={require('../assets/g10.png')}/>,
          title: 'Welcome To Igoepp',
          subtitle: 'We make sure all customers are well satisfied with all services.',
        },
        {
          // backgroundColor: '#a6e4d0',
          backgroundColor: Color.darkgray,
          image: <Image contentFit="contain"  style={styles.image2} source={require('../assets/onboarding2.png')} />,
          title: 'HandyMen',
          subtitle: 'We make sure your requests are carried out effectively.',
        },
        
        {
          // backgroundColor: '#e9bcbe',
          backgroundColor: Color.darkolivegreen_100,
          image: <Image contentFit="contain" style={styles.image3} source={require("../assets/group-783.png")} />,
          title: 'Transactions',
          subtitle: 'Our Transactions Are Smooth And Steady. ',
        },
        
        
      ]}
    />
    )
}

export default FirstDisplayScreen;
const styles = StyleSheet.create({
  container:{
    padding: 0,
    margin: 0
  },
  imageStyles:{
    height: "52%",
    width: "100%",
  },
  image1:{
    marginTop: "10%",
    height: "93%",
    width: "85%",
  },
  image2:{
    marginTop: "10%",
    height: "100%",
    width: "90%",
  },
  image3:{
    marginTop: "10%",
    marginBottom: 0,
    height: "93%",
    width: "85%",
  },
  logo:{
    width: 100,
    height: 100
  },
  title:{
    fontFamily: 'poppinsBold',
    fontSize: FontSize.size_7xl,
    color: Color.white
  },
  subtitle:{
    fontSize: FontSize.size_base,
    fontFamily: 'poppinsSemiBold'
  },
  pressed:{
    opacity: 0.4
  },
  press:{
    paddingRight: 20,
  },
  presstext:{
    fontFamily: 'poppinsSemiBold',
    color: Color.white
  },
  skip:{
    paddingLeft: 20,
  },
  
});