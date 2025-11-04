import { getFeedImageUrl } from "@/lib/supabase/feed/feedApi";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";

type Props = {
  imagePaths: string[];
};

export default function Carousel({ imagePaths }: Props) {
  return (
    <View style={styles.container}>
      <PagerView style={styles.container} initialPage={0}>
        {imagePaths.map((path: string, index) => {
          const imageSrc = getFeedImageUrl(path);
          return (
            <View style={styles.page} key={index + 1}>
              <Image
                source={{ uri: imageSrc }}
                style={{ width: "100%", height: 300, borderRadius: 12 }}
              />
            </View>
          );
        })}
      </PagerView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    justifyContent: "center",
    alignItems: "center",
  },
});
