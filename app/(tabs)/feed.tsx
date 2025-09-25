import { useAuthContext } from "@/hooks/useAuthContext";
import { createFeed, FeedSchema } from "@/lib/supabase/feed/feed";
import { pickAndUploadImage } from "@/lib/uploadFile";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function Feed() {
  const { session } = useAuthContext();
  const userId = session?.user.id;
  const [post, setPost] = useState<Partial<FeedSchema>>({
    content: "",
    image_url: "",
  });

  const handlePickImage = async () => {
    const storagePath = await pickAndUploadImage();
    if (!storagePath) return;

    try {
      setPost((prev) => ({ ...prev, image_url: storagePath }));
    } catch (error) {
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

    try {
      await createFeed({
        content,
        image_url: image_url || "",
        userId,
      });
      setPost({ content: "", image_url: "" });
    } catch (error) {
      throw new Error("create Feed Error");
    }
  };

  return (
    <View>
      <TextInput
        value={post.content}
        onChangeText={(text: string) => {
          setPost((prev) => ({ ...prev, content: text }));
        }}
      />
      <Pressable onPress={handlePickImage}>
        <Text>이미지 업로드!</Text>
      </Pressable>
      <Pressable onPress={uploadPost}>
        <Text>Post</Text>
      </Pressable>
    </View>
  );
}
