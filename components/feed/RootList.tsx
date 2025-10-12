import useTheme from "@/hooks/useTheme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function RootList() {
  const { typography } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={typography.title1}>검색 결과</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
