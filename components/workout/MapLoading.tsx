import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function MapLoading() {
  return (
    <View style={styles.container}>
      <Text>지도를 가져오는 중입니다!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
