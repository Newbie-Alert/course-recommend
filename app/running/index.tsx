import CircleButton from "@/components/ui/CircleButton";
import { formatTime } from "@/util/formatTime";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function RunningStartPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timeRef = useRef<number | null>(null);

  const startRunning = () => {
    if (!isRunning) {
      setIsRunning(true);
      setIsPaused(false);
      startTimer();
    }
  };

  const startTimer = () => {
    if (!timeRef.current) {
      timeRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
  };

  const pauseRunning = () => {
    if (isRunning && !isPaused) {
      setIsPaused(true);
      if (timeRef.current) {
        clearInterval(timeRef.current);
        timeRef.current = null;
      }
    }
  };

  const resumeRunning = () => {
    if (isRunning && isPaused) {
      setIsPaused(false);
      startTimer();
    }
  };
  const stopRunning = () => {};

  return (
    <View style={styles.container}>
      <View style={styles.recordContainer}>
        <Text style={styles.recordHeader}>{formatTime(seconds)}</Text>
        <Text style={styles.recordUnit}>분(minutes)</Text>
      </View>
      <View style={styles.buttonContainer}>
        <CircleButton
          onPress={stopRunning}
          width={60}
          height={60}
          icon={<FontAwesome name="stop" size={22} color="black" />}
          backgroundColor="#F5F5F5"
        />
        {!isRunning && (
          <CircleButton
            onPress={startRunning}
            width={85}
            height={85}
            icon={<FontAwesome name="play" size={30} color="black" />}
            backgroundColor="#DBFF00"
          />
        )}

        {isPaused && (
          <CircleButton
            onPress={resumeRunning}
            width={85}
            height={85}
            icon={<FontAwesome name="play" size={30} color="black" />}
            backgroundColor="#DBFF00"
          />
        )}
        {!isPaused && (
          <CircleButton
            onPress={pauseRunning}
            width={60}
            height={60}
            icon={<FontAwesome name="pause" size={22} color="black" />}
            backgroundColor="#F5F5F5"
          />
        )}
      </View>

      <View style={styles.allRecordContainer}>
        <View style={styles.eachRecordContainer}>
          <Text style={styles.eachRecordHeader}>0.00</Text>
          <Text style={styles.eachRecordUnit}>거리(km)</Text>
        </View>
        <View style={styles.eachRecordContainer}>
          <Text style={styles.eachRecordHeader}>0:00</Text>
          <Text style={styles.eachRecordUnit}>페이스</Text>
        </View>
        <View style={styles.eachRecordContainer}>
          <Text style={styles.eachRecordHeader}>0</Text>
          <Text style={styles.eachRecordUnit}>칼로리(kcal)</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    backgroundColor: "#085FDE",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  recordContainer: {
    display: "flex",
    alignItems: "center",
  },
  recordHeader: {
    fontSize: 52,
    fontWeight: 600,
    color: "#FAFAFA",
  },
  recordUnit: {
    color: "#FAFAFA",
    fontSize: 14,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  allRecordContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 50,
  },
  eachRecordContainer: {
    alignItems: "center",
  },
  eachRecordHeader: {
    fontSize: 24,
    fontWeight: 500,
    color: "#FAFAFA",
  },
  eachRecordUnit: {
    fontSize: 12,
    color: "#FAFAFA",
  },
});
