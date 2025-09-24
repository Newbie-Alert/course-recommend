import GoogleSignInButton from "@/components/GoogleSignInButton";
import { useAuthContext } from "@/hooks/useAuthContext";
import { Redirect } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function Login() {
  const { isLoggedIn } = useAuthContext();

  if (isLoggedIn) return <Redirect href={"/(tabs)/workout"} />;

  return (
    <View>
      <GoogleSignInButton />
    </View>
  );
}
