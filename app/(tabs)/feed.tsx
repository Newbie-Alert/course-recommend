import FeedCard from "@/components/feed/FeedCard";
import ScreenTitle from "@/components/ui/ScreenHeader";
import ScreenView from "@/components/ui/ScreenView";
import { useAuthContext } from "@/hooks/useAuthContext";
import { getAddressFromCoords } from "@/lib/getAddress";
import { pickAndUploadImage } from "@/lib/supabase/common/uploadFile";
import { createFeed, getAllFeeds } from "@/lib/supabase/feed/feed";
import { CreateFeedSchema, FeedSchema } from "@/lib/supabase/feed/types";
import { useIsFocused } from "@react-navigation/native";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";

export default function Feed() {
  const [imageUploading, setImageUploading] = useState<boolean>(false);
  const [feed, setFeed] = useState<FeedSchema[] | null>();
  const isFocused = useIsFocused();
  const { session } = useAuthContext();
  const userId = session?.user.id;
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [address, setAddress] =
    useState<Location.LocationGeocodedAddress | null>();
  const [errorMeg, setErrorMeg] = useState<string | null>(null);
  const [post, setPost] = useState<Partial<CreateFeedSchema>>({
    content: "",
    image_url: "",
  });

  const setFeeds = async () => {
    try {
      const feeds = await getAllFeeds();
      setFeed(feeds);
    } catch (error) {
      console.log("피드 불러오기 실패");
      setFeed(null);
    }
  };

  const handlePickImage = async () => {
    setImageUploading(true);
    const storagePath = await pickAndUploadImage();
    if (!storagePath) {
      setImageUploading(false);
    }

    try {
      setPost((prev) => ({ ...prev, image_url: storagePath }));
      setImageUploading(false);
    } catch (error) {
      setImageUploading(false);
      console.error("set Image Url Failed");
    }
  };

  const uploadPost = async () => {
    const { content, image_url } = post;
    if (!content?.trim()) {
      console.error("content가 없음");
      return;
    }
    if (!userId) return;

    const newFeed = {
      content,
      image_url: image_url || "",
      userId,
      location,
    };

    try {
      await createFeed(newFeed);
      setPost({ content: "", image_url: "" });
      await setFeeds();
    } catch (error) {
      throw new Error("create Feed Error");
    }
  };

  useEffect(() => {
    if (!isFocused) return;

    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMeg("위치 정보 접근이 거부되었습니다. 권한을 허용해주세요.");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }

    getCurrentLocation();
  }, [isFocused]);

  useEffect(() => {
    setFeeds();
  }, []);

  useEffect(() => {
    const returnAddress = async () => {
      const address = await getAddressFromCoords(location);
      if (address) {
        setAddress(address);
      }
    };

    if (location) {
      returnAddress();
    }
  }, [location]);

  if (!location) {
    <View>
      <Text>위치 정보를 확인중입니다...</Text>
    </View>;
  }

  if (!feed) {
    <View>
      <Text>피드가 없습니다.</Text>
    </View>;
  }

  return (
    <ScreenView>
      <ScreenTitle
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
