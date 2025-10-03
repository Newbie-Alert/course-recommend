import { BottomSheetBackgroundProps } from "@gorhom/bottom-sheet";
import React, { useMemo } from "react";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
} from "react-native-reanimated";

export default function ModalBackground({
  style,
  animatedIndex,
}: BottomSheetBackgroundProps) {
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    // @ts-ignore
    backgroundColor: interpolateColor(
      animatedIndex.value,
      [0, 1],
      ["#FAFAFA", "#085FDE"]
    ),
  }));

  const containerStyle = useMemo(
    () => [style, containerAnimatedStyle],
    [style, containerAnimatedStyle]
  );

  return <Animated.View pointerEvents="none" style={containerStyle} />;
}
