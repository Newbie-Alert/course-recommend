import { useAuthContext } from "@/hooks/useAuthContext";
import { router } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

export default function Index() {
  const { isLoggedIn, isLoading } = useAuthContext();

  useEffect(() => {
    if (isLoading) return;
    if (isLoggedIn) router.replace("/(tabs)/workout");
    if (!isLoggedIn) router.replace("/(auth)/login");
  }, [isLoggedIn, isLoading]);

  return <View></View>;
}
