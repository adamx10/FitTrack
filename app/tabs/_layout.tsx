import NavBar from '@/components/navbar';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <>
   
      

      <Tabs
    
    screenOptions={{
      tabBarActiveBackgroundColor:'#4AE176',
      tabBarItemStyle:{
        borderRadius:20,
      } ,
    
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
      name="historique"
      options={{
        title:"Historique",
        tabBarIcon:({color , size}) =>(
          <AntDesign name="history" size={24} color="black" />
        ),
      }}/>

    </Tabs>
    
    
 
    </>
  
    
  
  )
  

}

