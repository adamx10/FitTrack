import { Pedometer } from "expo-sensors";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { SafeAreaProvider } from "react-native-safe-area-context";

const DAILY_GOAL = 10000; 

export default function Index() {
  const [steps, setSteps] = useState(0);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    let subscription: any;

    const startPedometer = async () => {
     
      const available = await Pedometer.isAvailableAsync();
      setIsAvailable(available);
      console.log("Available:", available);

      if (!available) return; 

      
      const { status } = await Pedometer.requestPermissionsAsync();
      if (status !== "granted") return;


      subscription = Pedometer.watchStepCount((result) => {
        setSteps(result.steps);
        console.log("Pas :", result.steps); 
      });
    };

    startPedometer();


    return () => {
      subscription?.remove();
    };
  }, []); 


  const fillPercent = Math.min((steps / DAILY_GOAL) * 100, 100);

  return (
    <SafeAreaProvider style={styles.container}>
      <View>
        <AnimatedCircularProgress
          size={220}
          width={15}
          fill={fillPercent}      
          tintColor="#4AE176"
          backgroundColor="#333"
          style={styles.cercle}
        >
          {() => (
            <View style={styles.centerText}>
              <Text style={styles.stepsText}>{steps}</Text>
              <Text style={styles.goalText}>/ {DAILY_GOAL} pas</Text>
            </View>
          )}
        </AnimatedCircularProgress>

        {!isAvailable && (
          <Text style={styles.errorText}>Podomètre non disponible</Text>
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1C1B1B", justifyContent: "center", alignItems: "center" },
  cercle: { flex: 1, margin: 75 },
  centerText: { alignItems: "center" },
  stepsText: { color: "#4AE176", fontSize: 36, fontWeight: "bold" },
  goalText: { color: "#888", fontSize: 14 },
  errorText: { color: "red", textAlign: "center", marginTop: 10 },
});