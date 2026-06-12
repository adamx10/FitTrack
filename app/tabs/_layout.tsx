
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <>
   
      

      <Tabs
    
    screenOptions={{
      tabBarActiveBackgroundColor:'#4AE176',
  
    
      headerShown:false,
      
      tabBarActiveTintColor:'#FFFFFF',
      tabBarInactiveTintColor:'#5516BE',
      tabBarStyle:{
        backgroundColor:'#5F5E5E',
        borderTopWidth:0,
        
        
        elevation:0,

      }
    
    }}
    >

      <Tabs.Screen
      name="index"
      options={{
        title:"Dashboard",
        tabBarIcon: ({color , size}) => (
         <MaterialIcons name="dashboard" size={24} color="black" />
        ),
      }}/>

        <Tabs.Screen
      name="session"
      options={{
        title:"Session",
        tabBarIcon: ({color , size}) => (
          <MaterialIcons name="sports-score" size={24} color="black" />

        ),
      }}/>
      
      <Tabs.Screen
      name="profile"
      options={{
        title:"Profile",
        tabBarIcon:({color , size}) =>(
         <MaterialCommunityIcons name="face-man-profile" size={24} color="black" />
        ),
      }}/>

    </Tabs>
    
    
 
    </>
  
    
  
  )
  

}

