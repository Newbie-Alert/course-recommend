import { RunSnapshot } from "@/types/run.type";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";

type Props = {
  snap: RunSnapshot | null;
  onSubmit: (
    title: string,
    memo: string,
    photoUri: string | null,
    snap: any
  ) => void;
  onCancle: () => void;
};

export default function FeedPostSheet({ snap, onSubmit, onCancle }: Props) {
  const [title, setTitle] = useState("");
  const [memo, setMemo] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  return (
    <BottomSheetView style={{ padding: 16 }}>
      <Text style={{ fontWeight: "600", fontSize: 18 }}>피드 공유</Text>
      <TextInput
        placeholder="제목을 입력하세요"
        value={title}
        onChangeText={setTitle}
        style={{ borderBottomWidth: 1, marginVertical: 12 }}
      />
      <TextInput
        placeholder="메모를 입력하세요"
        value={memo}
        onChangeText={setMemo}
        multiline
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          height: 100,
          padding: 8,
          borderRadius: 8,
        }}
      />
      {photoUri && (
        <Image
          source={{ uri: photoUri }}
          style={{ height: 120, marginVertical: 8, borderRadius: 8 }}
        />
      )}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
        <Pressable
          onPress={onCancle}
          style={{
            backgroundColor: "#ff6600",
            padding: 12,
            borderRadius: 8,
            marginTop: 16,
            width: "100%",
            maxWidth: 180,
          }}>
          <Text style={{ color: "#fff", textAlign: "center" }}>취소하기</Text>
        </Pressable>
        <Pressable
          onPress={() => onSubmit(title, memo, photoUri, snap)}
          style={{
            backgroundColor: "#ff6600",
            padding: 12,
            borderRadius: 8,
            marginTop: 16,
            width: "100%",
            maxWidth: 180,
          }}>
          <Text style={{ color: "#fff", textAlign: "center" }}>게시하기</Text>
        </Pressable>
      </View>
    </BottomSheetView>
  );
}
