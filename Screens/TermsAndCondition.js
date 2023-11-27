import { ScrollView, StyleSheet, Text, View,  } from 'react-native'
import React, {useContext} from 'react'
import { AuthContext } from '../utils/AuthContext'

const TermsAndCondition = () => {
  const authCtx = useContext(AuthContext)
  return (
    <View style={styles.mainContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={{alignItems:'center'}}>
         <Text style={{textAlign:'center'}}>CUSTOMER SERVICE LEVEL AGREEMENT</Text> 
        </View>


          <Text> A.	SERVICE LEVEL AGREEMENT(SLA)</Text>

          <Text style={styles.textsty}> 
          1.	Services to be Performed
          I have agreed to work in the capacity of <Text> {authCtx.firstName } { authCtx.lastName}</Text> as an Artisan 
          </Text>

          <Text style={styles.textsty}>
          2.	Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae quo quos laboriosam numquam facilis enim vel iusto similique earum nulla. Aliquid praesentium debitis nihil sed possimus sit corrupti veniam dolores.
          </Text>

          <Text style={styles.textsty}>
          3.  Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae quo quos laboriosam numquam facilis enim vel iusto similique earum nulla. Aliquid praesentium debitis nihil sed possimus sit corrupti veniam dolores.
          </Text>

          <Text style={styles.textsty}>
          4.	Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae quo quos laboriosam numquam facilis enim vel iusto similique earum nulla. Aliquid praesentium debitis nihil sed possimus sit corrupti veniam dolores.
          </Text>

          <Text style={styles.textsty}>
          5.	Terminating the Agreement
          With reasonable cause, either IGOEPP or Artisan may terminate the Agreement, effective immediately upon giving written notice.
          Reasonable cause includes:
          •	A material violation of this Agreement, or
          •	Any act exposing the other party of liability to others for the personal injury or property damage.
          OR
          Either party may terminate this Agreement at any time by giving 30 days written notice to the other party of the intention to terminate. However, Artisan cannot terminate this agreement when there is a pending dispute with one of IGOEPP’s customers involving him.
          </Text>

          <Text style={styles.textsty}>
          6.	Modifying the  Agreement
            This Agreement may be modified on mutual consent of both parties. (Ratification can be done via oral, written, email or other digital agreement).
          </Text>

          <Text style={styles.textsty}>
          7.	Confidentiality
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae quo quos laboriosam numquam facilis enim vel iusto similique earum nulla. Aliquid praesentium debitis nihil sed possimus sit corrupti veniam dolores.
          </Text>

          <Text style={styles.textsty}>
          8.	No Partnership
            We only try to make you our prority nothing much.
          </Text>
      </ScrollView>
    </View>
  )
}

export default TermsAndCondition

const styles = StyleSheet.create({
  mainContainer:{
    flex: 1,
    marginHorizontal: 10,
    marginTop: "10%"
  },
  textsty:{
    fontFamily:'poppinsRegular'
  }
})