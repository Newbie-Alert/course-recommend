import { pickAndUploadImage } from "@/lib/uploadFile";
import React from "react";
import { Pressable, Text, View } from "react-native";

export default function Feed() {
  return (
    <View>
      <Pressable onPress={pickAndUploadImage}>
        <Text>이미지 업로드!</Text>
      </Pressable>
    </View>
  );
}
