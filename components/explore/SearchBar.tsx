import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { TextInput, View } from "react-native";

type Props = {
  input: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
};

export default function SearchBar({ input, onChange }: Props) {
  return (
    <View
      style={{
        width: 300,
        maxWidth: 341,
        height: 45,
        borderRadius: 36,
        backgroundColor: "#fafafa",
        justifyContent: "center",
      }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          paddingHorizontal: 8,
        }}>
        <Ionicons name="search" size={24} />
        <TextInput
          placeholder="Search"
          placeholderTextColor={"#000"}
          value={input}
          onChangeText={(text) => onChange(text)}
          style={{
            width: "100%",
            maxWidth: 250,
            color: "#000",
          }}
        />
      </View>
    </View>
  );
}
