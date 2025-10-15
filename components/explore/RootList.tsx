import useTheme from "@/hooks/useTheme";
import { Place, PlaceResponse } from "@/types/places.type";
import { BottomSheetFlatList, useBottomSheet } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  Extrapolation,
  interpolate,
  useAnimatedReaction,
} from "react-native-reanimated";
import { runOnJS } from "react-native-worklets";

type Props = {
  searchResult: PlaceResponse["places"];
  setOpacity?: React.Dispatch<React.SetStateAction<number>>;
};

export default function RootList({ searchResult, setOpacity }: Props) {
  const { typography, colors } = useTheme();
  const { animatedIndex } = useBottomSheet();

  useAnimatedReaction(
    () => animatedIndex.value,
    (value) => {
      const opacity = interpolate(value, [0, 1], [1, 0], Extrapolation.CLAMP);
      if (setOpacity) runOnJS(setOpacity)(opacity);
    }
  );

  if (searchResult.length === 0) {
    return (
      <View>
        <Text>검색 결과가 없습니다</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={[typography.title1, { textAlign: "center" }]}>
        검색 결과
      </Text>
      <View
        style={{
          width: "100%",
          paddingHorizontal: 12,
          paddingBottom: 170,
        }}>
        <BottomSheetFlatList
          enableFooterMarginAdjustment={true}
          data={searchResult}
          key={searchResult.length}
          renderItem={({ item }: { item: Place }) => {
            const photoUrl = item.photos
              ? `https://places.googleapis.com/v1/${item.photos[0].name}/media?maxWidthPx=800&key=${process.env.EXPO_PUBLIC_ANDROID_GOOGLE_PLACES_API_KEY}`
              : "";
            const address = item.formattedAddress.split(" ");
            return (
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "flex-start",
                  marginBottom: 12,
                  gap: 9,
                }}>
                {item.photos && (
                  <Image
                    source={{ uri: photoUrl }}
                    style={{ width: 180, height: 100, borderRadius: 6 }}
                  />
                )}
                <View style={{ flexDirection: "column" }}>
                  <View
                    style={{
                      flexDirection: "column",
                      flex: 1,
                    }}>
                    <Text style={{ fontSize: 18, fontWeight: 700 }}>
                      {item.displayName.text}
                    </Text>
                    <Text
                      style={[
                        { color: "#8C8C8C", fontSize: 12 },
                      ]}>{`${address[0]} ${address[1]}`}</Text>
                    <View style={{ flexDirection: "row", gap: 3 }}>
                      <Text style={[{ fontSize: 14 }]}>
                        {`리뷰: ${item.reviews?.length}`}
                      </Text>
                      <Text>|</Text>
                      <Text
                        style={[
                          { fontSize: 14 },
                        ]}>{`평점: ${item.rating}`}</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: "row", gap: 3 }}>
                    <Text>{`거리 /`}</Text>
                    <Text>{`난이도 /`}</Text>
                    <Text>{`예상 소요시간`}</Text>
                  </View>
                </View>
              </View>
            );
          }}
        />
      </View>
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
