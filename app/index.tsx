import { useAuthContext } from "@/hooks/useAuthContext";
import { router } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const { isLoggedIn } = useAuthContext();

  useEffect(() => {
    if (isLoggedIn) router.replace("/(tabs)/workout");
  }, [isLoggedIn]);
}
