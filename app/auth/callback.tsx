// app/auth/callback.tsx
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // ✅ 로그인 성공하면 원하는 곳으로 보내기
    router.replace("/(tabs)/workout");
  }, []);

  return (
    <View>
      <Text>Redirecting...</Text>
    </View>
  );
}
