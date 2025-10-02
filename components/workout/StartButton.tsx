import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";
import CircleButton from "../ui/CircleButton";

interface StartButtonProps {
  onPress: () => void;
}

export default function StartButton({ onPress }: StartButtonProps) {
  return (
    <View>
      <LinearGradient
        colors={["rgba(236, 236, 236, 0.8)", "transparent"]}
        start={{ x: 0.5, y: 0.2 }}
        end={{ x: 0.5, y: 0 }}
        style={styles.gradient}
      />
      <View style={styles.container}>
        <View style={styles.startButtonContainer}>
          <CircleButton
            onPress={onPress}
            width={100}
            height={100}
            backgroundColor="#085FDE"
            textColor="white"
            text="START"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  startButtonContainer: {
    position: "absolute",
    bottom: 1,
    left: "50%",
    transform: [
      {
        translateX: -50,
      },
    ],
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 250,
  },
});
