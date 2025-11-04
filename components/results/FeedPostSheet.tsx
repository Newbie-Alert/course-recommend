import { RunSnapshot } from "@/types/run.type";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";

type Props = {
  snap: RunSnapshot | null;
  photoUri: string | undefined;
  onSubmit: (title: string, memo: string) => void;
  onCancle: () => void;
};

export default function FeedPostSheet({
  snap,
  photoUri,
  onSubmit,
  onCancle,
}: Props) {
  const [title, setTitle] = useState("");
  const [memo, setMemo] = useState("");

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
          borderRadius: 8,
        }}
      />
      {photoUri && (
        <Image
          source={{ uri: photoUri }}
          style={{ height: 360, marginVertical: 8, borderRadius: 8 }}
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
          onPress={() => onSubmit(title, memo)}
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
