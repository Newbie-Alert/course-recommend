import { useAuthContext } from "@/hooks/useAuthContext";
import { getTimeAgo } from "@/lib/getTimeAge";
import { getFeedImageUrl, sendLike } from "@/lib/supabase/feed/feed";
import { FeedSchema } from "@/lib/supabase/feed/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ImageBackground } from "expo-image";
import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function FeedCard(props: FeedSchema) {
  const { session } = useAuthContext();
  const user = session?.user.user_metadata || undefined;
  const userId = session?.user.id;

  const [likes, setLikes] = useState<number>(props.likes ?? 0);
  const [canLikes, setCanLikes] = useState<boolean>(true);

  const { content, inserted_at, writer, image_url, location, id, likers } =
    props;

  const imageSrc = getFeedImageUrl(image_url);
  const [imageLoading, setImageLoading] = useState<boolean>(false);

  const handleLike = async () => {
    if (!canLikes) throw new Error("잠시 후 다시 시도해주세요");
    if (!userId) throw new Error("유저 ID가 없습니다");

    setCanLikes(false);
    console.log("id", id);
    try {
      const res = await sendLike({
        feedId: id,
        senderId: userId,
      });
      setLikes(res[0].likes);
      setCanLikes(true);
      console.log("first");
    } catch (error) {
      console.log(error);
      setLikes(props.likes);
      setCanLikes(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userBox}>
          {user ? (
            <>
              <ImageBackground
                source={{ uri: user.picture }}
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: 150,
                  overflow: "hidden",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              />
            </>
          ) : (
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
                ('User')
              </Text>
            </View>
          )}

          <View>
            <Text>{user ? user.full_name : "유저"}</Text>
            <Text>{getTimeAgo(inserted_at)}</Text>
          </View>
        </View>

        <View style={styles.likeBox}>
          <Ionicons
            name={likes > 0 ? "heart" : "heart-outline"}
            size={15}
            style={{ paddingTop: 1 }}
            onPress={handleLike}
          />
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
