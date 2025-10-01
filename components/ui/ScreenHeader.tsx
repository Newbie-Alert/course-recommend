import useTheme from "@/hooks/useTheme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  components?: React.ReactNode[];
};

export default function ScreenHeader({ title, components }: Props) {
  const { typography } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={typography.title1}>{title ? title : ""}</Text>
      {components &&
        components.map((comp, idx) => {
          return <View key={idx}>{comp}</View>;
        })}
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
