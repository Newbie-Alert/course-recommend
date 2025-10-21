import useTheme from "@/hooks/useTheme";
import { Place } from "@/types/places.type";
import { useBottomSheet } from "@gorhom/bottom-sheet";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  Extrapolation,
  interpolate,
  useAnimatedReaction,
} from "react-native-reanimated";
import { runOnJS } from "react-native-worklets";

type Props = {
  setOpacity?: React.Dispatch<React.SetStateAction<number>>;
  detail: Place | undefined;
};

export default function DetailSheet({ detail, setOpacity }: Props) {
  const { typography, colors } = useTheme();
  const { animatedIndex } = useBottomSheet();

  useAnimatedReaction(
    () => animatedIndex.value,
    (value) => {
      const opacity = interpolate(value, [0, 1], [1, 0], Extrapolation.CLAMP);
      if (setOpacity) runOnJS(setOpacity)(opacity);
    }
  );

  return (
    <View style={styles.container}>
      <Text style={[typography.title1, { textAlign: "center" }]}>
        {detail?.displayName.text}
      </Text>
      <View
        style={{
          width: "100%",
          paddingHorizontal: 12,
          paddingBottom: 180,
        }}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
