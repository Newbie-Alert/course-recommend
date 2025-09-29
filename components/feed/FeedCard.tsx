import { getTimeAgo } from "@/lib/getTimeAge";
import { getFeedImageUrl } from "@/lib/supabase/feed/feed";
import { FeedSchema } from "@/lib/supabase/feed/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function FeedCard(props: FeedSchema) {
  const { content, inserted_at, likes, writer, image_url, location } = props;
  const imageSrc = getFeedImageUrl(image_url);
  const [imageLoading, setImageLoading] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userBox}>
          <View
            style={{
              borderRadius: 90,
              backgroundColor: "#e6e6e6",
              width: 45,
              height: 45,
              position: "relative",
            }}>
            <Text
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                fontSize: 28,
                fontWeight: 600,
              }}>
              {"UserName".charAt(0)}
            </Text>
          </View>
          <View>
            <Text>user</Text>
            <Text>{getTimeAgo(inserted_at)}</Text>
          </View>
        </View>

        <View style={styles.likeBox}>
          <Ionicons name="heart-outline" size={15} style={{ paddingTop: 1 }} />
          <Text>{likes}</Text>
        </View>
      </View>
      <Text>{content}</Text>
      {imageSrc ? (
        <Image
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
          resizeMode="cover"
          source={{ uri: imageSrc }}
          style={{ width: "100%", height: 300, borderRadius: 12 }}
        />
      ) : null}
      {imageLoading && (
        <View>
          <Text>이미지 로딩중 .....</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 15,
    marginBottom: 16,
  },
  userBox: {
    flexDirection: "row",
    gap: 14.6,
    alignItems: "center",
  },
  likeBox: {
    flexDirection: "row",
    gap: 4.9,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
