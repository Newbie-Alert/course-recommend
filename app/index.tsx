import { useAuthContext } from "@/hooks/useAuthContext";
import { Redirect } from "expo-router";

export default function Index() {
  const { isLoggedIn } = useAuthContext();

  if (!isLoggedIn) return <Redirect href={"/(auth)/login"} />;

  return <Redirect href={"/(tabs)/workout"} />;
}
