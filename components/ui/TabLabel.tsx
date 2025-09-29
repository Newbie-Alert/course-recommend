import React from "react";
import { Text, View } from "react-native";

type Props = {
  labelName: string;
  focused: boolean;
};

export default function TabLabel({ labelName, focused }: Props) {
  return (
    <View
      style={{
        width: 85,
        paddingVertical: 13.5,
        paddingHorizontal: 17.5,
        borderRadius: focused ? 50 : 0,
        backgroundColor: focused ? "#DBFF00" : "transparent",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}>
      <Text
        style={{
          color: "black",
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: 0,
        }}>
        {labelName}
      </Text>
    </View>
  );
}
