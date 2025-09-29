import useFeedScreen from "@/hooks/useFeedScreen";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from "react-native";
import ScreenHeader from "../ui/ScreenHeader";
import ScreenView from "../ui/ScreenView";
import FeedCard from "./FeedCard";

export default function FeedScreen() {
  const {
    feed,
    loadFeeds,
    location,
    address,
    post,
    setPost,
    imageUploading,
    handlePickImage,
    uploadPost,
  } = useFeedScreen();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFeeds();
    setRefreshing(false);
  }, [loadFeeds]);

  useFocusEffect(
    useCallback(() => {
      loadFeeds();
    }, [])
  );

  if (refreshing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>피드 새로고침 중...</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View>
        <Text>위치 정보를 확인중입니다...</Text>
      </View>
    );
  }

  if (!feed) {
    return (
      <View>
        <Text>피드가 없습니다.</Text>
      </View>
    );
  }

  return (
    <ScreenView>
      <ScreenHeader
        title="Feed"
        components={[
          <View>
            <Text>{address?.street || ""}</Text>
          </View>,
        ]}
      />
      <FlatList
        data={feed}
        keyExtractor={(feed) => feed.id}
        renderItem={({ item }) => <FeedCard {...item} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <TextInput
        value={post.content}
        onChangeText={(text: string) => {
          setPost((prev) => ({ ...prev, content: text }));
        }}
      />
      <Pressable onPress={handlePickImage}>
        <Text>이미지 업로드!</Text>
      </Pressable>
      {imageUploading ? (
        <View>
          <Text>이미지 업로드 중...</Text>
        </View>
      ) : (
        <Pressable onPress={uploadPost}>
          <Text>Post</Text>
        </Pressable>
      )}
    </ScreenView>
  );
}
