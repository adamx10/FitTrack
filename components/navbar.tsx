import React from 'react'
import { Image, View } from 'react-native'

function Navbar() {
  return (
 
    <View>
    <Image
     source={require('@/assets/images/logoS.png')}
     style={{width:400,height:120,backgroundColor:'#5F5E5E'}}

    ></Image>
    </View>
 
  )
}

export default Navbar
