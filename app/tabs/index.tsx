import { useCallback, useEffect, useRef, useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Pedometer } from "expo-sensors";
import { FitnesStor } from "@/store/fitnesStor";

const DAILY_GOAL = 10000;

type PedometerStatus =
  | "checking"
  | "ready"
  | "unavailable"
  | "denied"
  | "blocked"
  | "error";

export default function Index() {
  const { steps, km, kcal, updateState } = FitnesStor();
  const [pedometerStatus, setPedometerStatus] =
    useState<PedometerStatus>("checking");
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const subscriptionRef = useRef<{ remove(): void } | null>(null);

  const stopPedometer = useCallback(() => {
    subscriptionRef.current?.remove();
    subscriptionRef.current = null;
  }, []);

  const startPedometer = useCallback(async () => {
    setIsRequestingPermission(true);
    stopPedometer();

    try {
      const available = await Pedometer.isAvailableAsync();

      if (!available) {
        setPedometerStatus("unavailable");
        return;
      }

      const currentPermission = await Pedometer.getPermissionsAsync();
      const permission = currentPermission.granted
        ? currentPermission
        : await Pedometer.requestPermissionsAsync();

      if (!permission.granted) {
        setPedometerStatus(permission.canAskAgain ? "denied" : "blocked");
        return;
      }

      subscriptionRef.current = Pedometer.watchStepCount((result) => {
        updateState(result.steps);
      });
      setPedometerStatus("ready");
    } catch (error) {
      console.warn("Pedometer permission error", error);
      setPedometerStatus("error");
    } finally {
      setIsRequestingPermission(false);
    }
  }, [stopPedometer, updateState]);

  useEffect(() => {
    startPedometer();

    return stopPedometer;
  }, [startPedometer, stopPedometer]);

  const fillPercent = Math.min((steps / DAILY_GOAL) * 100, 100);
  const canAskPermission =
    pedometerStatus === "denied" ||
    pedometerStatus === "blocked" ||
    pedometerStatus === "error";

  const permissionMessage = {
    checking: "Verification du podometre...",
    ready: "Podometre active",
    unavailable: "Podometre non disponible sur cet appareil",
    denied: "Autorise le podometre pour compter tes pas",
    blocked: "Permission bloquee. Active-la dans les reglages",
    error: "Impossible d'activer le podometre",
  }[pedometerStatus];

  const handlePermissionPress = () => {
    if (pedometerStatus === "blocked") {
      Linking.openSettings();
      return;
    }

    startPedometer();
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.content}>
        <AnimatedCircularProgress
          size={220}
          width={15}
          fill={fillPercent}
          tintColor="#4AE176"
          backgroundColor="#333"
        >
          {() => (
            <View style={styles.centerText}>
              <Text style={styles.stepsText}>{steps}</Text>
              <Text style={styles.goalText}>/ {DAILY_GOAL} pas</Text>
            </View>
          )}
        </AnimatedCircularProgress>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{km.toFixed(2)}</Text>
            <Text style={styles.statLabel}>KM</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{kcal.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Kcal</Text>
          </View>
        </View>

        <Text
          style={[
            styles.permissionText,
            pedometerStatus === "ready" && styles.successText,
          ]}
        >
          {permissionMessage}
        </Text>

        {canAskPermission && (
          <Pressable
            disabled={isRequestingPermission}
            onPress={handlePermissionPress}
            style={({ pressed }) => [
              styles.permissionButton,
              pressed && styles.permissionButtonPressed,
              isRequestingPermission && styles.permissionButtonDisabled,
            ]}
          >
            <Text style={styles.permissionButtonText}>
              {pedometerStatus === "blocked"
                ? "Ouvrir les reglages"
                : "Autoriser le podometre"}
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1C1B1B" },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  centerText: { alignItems: "center" },
  stepsText: { color: "#4AE176", fontSize: 36, fontWeight: "bold" },
  goalText: { color: "#888", fontSize: 14 },
  statsContainer: {
    flexDirection: "row",
    marginTop: 40,
    width: "80%",
    justifyContent: "space-around",
  },
  statBox: {
    alignItems: "center",
    backgroundColor: "#474646",
    width: 140,
    height: 90,
    gap: 20,
    padding: 10,
    borderRadius: 20,
  },
  statValue: { color: "#FFF", fontSize: 22, fontWeight: "bold" },
  statLabel: { color: "#df7717", fontSize: 12, marginTop: 4 },
  permissionText: {
    color: "#F6F6F6",
    textAlign: "center",
    marginTop: 24,
    paddingHorizontal: 24,
  },
  successText: { color: "#4AE176" },
  permissionButton: {
    backgroundColor: "#4AE176",
    borderRadius: 14,
    marginTop: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  permissionButtonPressed: { opacity: 0.8 },
  permissionButtonDisabled: { opacity: 0.5 },
  permissionButtonText: { color: "#1C1B1B", fontSize: 15, fontWeight: "700" },
});
