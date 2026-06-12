import Navbar from "@/components/navbar";
import { Stack } from "expo-router";


export default function RootLayout() {
  return <  >
  <Stack screenOptions={{
    contentStyle:{backgroundColor:''},
    
    header:()=><Navbar/>
  }}  /></>
   
  
}