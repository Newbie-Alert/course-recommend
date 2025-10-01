import React from "react";
import { StyleSheet, View } from "react-native";

export default function ScreenView({
  children,
}: {
  children: React.ReactNode;
}) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 51,
  },
});
