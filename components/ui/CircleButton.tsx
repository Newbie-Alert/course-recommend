import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

interface CircleButtonProps {
  onPress: () => void;
  text?: string;
  icon?: React.ReactNode;
  width: number;
  height: number;
  backgroundColor?: string;
  textColor?: string;
}

export default function CircleButton({
  onPress,
  text,
  icon,
  width,
  height,
  backgroundColor,
  textColor,
}: CircleButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, { width, height, backgroundColor }]}>
      <Text style={[styles.buttonText, { color: textColor }]}>
        {text ? text : icon}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    fontWeight: 500,
    fontSize: 18,
  },
});
