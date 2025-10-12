import GoogleSignInButton from "@/components/ui/GoogleSignInButton";
import { useAuthContext } from "@/hooks/useAuthContext";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";

export default function Login() {
  const { isLoggedIn } = useAuthContext();

  useEffect(() => {
    if (isLoggedIn) router.replace("/(tabs)/workout");
  }, [isLoggedIn]);

  return (
    <View>
      <GoogleSignInButton />
    </View>
  );
}
