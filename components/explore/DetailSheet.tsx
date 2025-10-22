import useTheme from "@/hooks/useTheme";
import { Place } from "@/types/places.type";
import { BottomSheetScrollView, useBottomSheet } from "@gorhom/bottom-sheet";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
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

  const photoUrl = detail?.photos
    ? `https://places.googleapis.com/v1/${detail?.photos[0].name}/media?maxWidthPx=800&key=${process.env.EXPO_PUBLIC_ANDROID_GOOGLE_PLACES_API_KEY}`
    : "";

  const address = detail?.formattedAddress.split(" ");

  return (
    <BottomSheetScrollView style={styles.container}>
      <View
        style={{
          width: "100%",
          marginBottom: 8,
        }}>
        {detail && detail.photos ? (
          <Image
            source={{ uri: photoUrl }}
            style={{ width: "auto", height: 200, borderRadius: 6 }}
          />
        ) : (
          <View
            style={{
              width: "auto",
              height: 200,
              borderRadius: 6,
              backgroundColor: "black",
            }}></View>
        )}
      </View>

      <View>
        <Text
          ellipsizeMode="middle"
          numberOfLines={1}
          style={{
            fontSize: 24,
            fontWeight: 700,
          }}>
          {detail?.displayName.text}
        </Text>
        <Text style={[{ color: "#8C8C8C", fontSize: 16, marginBottom: 9 }]}>
          {address && `${address[0]} ${address[1]}`}
        </Text>

        <Text style={[{ marginBottom: 3, fontWeight: 600, fontSize: 24 }]}>
          Reviews
        </Text>
        <View>
          {detail?.reviews?.map((review) => {
            return (
              <View
                style={{
                  marginBottom: 6,
                  borderWidth: 1,
                  borderColor: "#dbdbdb",
                  borderRadius: 8,
                  padding: 9,
                }}>
                <Text
                  style={{ fontSize: 15, fontWeight: 600, marginBottom: 3 }}>
                  {review.authorAttribution?.displayName}
                </Text>
                <Text>{review.text.text}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </BottomSheetScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    paddingHorizontal: 12,
  },
});
