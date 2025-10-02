import CircleButton from "@/components/ui/CircleButton";
import { useRun } from "@/providers/RunProvider";
import { formatTime } from "@/util/formatTime";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function RecordModal({
  snapPointIndex,
}: {
  snapPointIndex: number;
}) {
  const { status, seconds, pauseRunning, resumeRunning, stopRunning } =
    useRun();

  console.log(snapPointIndex);
  return (
    <View
      style={[
        styles.container,
        {
          justifyContent: snapPointIndex === 0 ? "flex-start" : "center",
          gap: snapPointIndex === 0 ? 20 : 50,
        },
      ]}>
      <View style={styles.recordContainer}>
        <Text
          style={[
            styles.recordHeader,
            {
              color: snapPointIndex === 0 ? "#085FDE" : "#FAFAFA",
              fontSize: snapPointIndex === 0 ? 42 : 52,
            },
          ]}>
          {formatTime(seconds)}
        </Text>
        <Text
          style={[
            styles.recordUnit,
            { color: snapPointIndex === 0 ? "#085FDE" : "#FAFAFA" },
          ]}>
          분(minutes)
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <CircleButton
          onPress={stopRunning}
          width={60}
          height={60}
          icon={<FontAwesome name="stop" size={22} color="black" />}
          backgroundColor="#F5F5F5"
        />

        {status === "paused" && (
          <CircleButton
            onPress={resumeRunning}
            width={85}
            height={85}
            icon={<FontAwesome name="play" size={30} color="black" />}
            backgroundColor="#DBFF00"
          />
        )}
        {status !== "paused" && (
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
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 50,
  },
  recordContainer: {
    display: "flex",
    alignItems: "center",
  },
  recordHeader: {
    fontWeight: 600,
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
