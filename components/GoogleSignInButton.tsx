import { supabase } from "@/lib/supabase/supabase";
import { makeRedirectUri } from "expo-auth-session";
import { useEffect } from "react";
import { Platform, TouchableOpacity } from "react-native";

import { Text } from "@react-navigation/elements";
import { Image } from "expo-image";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignInButton() {
  // redirectTo: /auth/callback 붙여주기
  const redirectTo =
    Platform.OS === "web"
      ? "http://localhost:8081/auth/callback"
      : makeRedirectUri({ scheme: "runningcourse", path: "auth/callback" });

  console.log("redirectTo:", redirectTo);

  function extractParamsFromUrl(url: string) {
    const parsedUrl = new URL(url);

    // 해시 파라미터 (#...)
    const hash = parsedUrl.hash.substring(1);
    const hashParams = new URLSearchParams(hash);

    // 쿼리 파라미터 (?...)
    const searchParams = parsedUrl.searchParams;

    return {
      // implicit flow
      access_token: hashParams.get("access_token"),
      expires_in: parseInt(hashParams.get("expires_in") || "0"),
      refresh_token: hashParams.get("refresh_token"),
      token_type: hashParams.get("token_type"),
      provider_token: hashParams.get("provider_token"),

      // code flow
      code: searchParams.get("code"),
      error: searchParams.get("error"),
      error_description: searchParams.get("error_description"),
    };
  }

  async function onSignInButtonPress() {
    console.debug("onSignInButtonPress - start");

    const res = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: { prompt: "consent" },
        skipBrowserRedirect: true,
      },
    });

    const googleOAuthUrl = res.data.url;

    if (!googleOAuthUrl) {
      console.error("no oauth url found!");
      return;
    }

    const result = await WebBrowser.openAuthSessionAsync(
      googleOAuthUrl,
      redirectTo,
      { showInRecents: true }
    ).catch((err) => {
      console.error("openAuthSessionAsync - error", err);
    });

    console.debug("openAuthSessionAsync - result", result);

    if (result && result.type === "success") {
      const params = extractParamsFromUrl(result.url);
      console.debug("Auth params:", params);

      if (params.code) {
        // Authorization Code Flow
        console.debug("exchangeCodeForSession - start");
        const { data, error } = await supabase.auth.exchangeCodeForSession(
          params.code
        );
        console.debug("exchangeCodeForSession - result", { data, error });
        if (!error && data.session) {
          router.replace("/(tabs)/workout"); // ✅ Clerk처럼 강제로 화면 이동
        }
        return;
      }

      if (params.access_token && params.refresh_token) {
        // Implicit Flow
        console.debug("setSession - start");
        const { data, error } = await supabase.auth.setSession({
          access_token: params.access_token,
          refresh_token: params.refresh_token,
        });
        console.debug("setSession - result", { data, error });

        return;
      }

      console.error("No code or tokens found in redirect URL", params);
    } else {
      console.error("openAuthSessionAsync - failed");
    }
  }

  // warm up / cool down (네이티브 전용)
  useEffect(() => {
    if (Platform.OS !== "web") {
      WebBrowser.warmUpAsync();
      return () => {
        WebBrowser.coolDownAsync();
      };
    }
  }, []);

  return (
    <TouchableOpacity
      onPress={onSignInButtonPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#dbdbdb",
        borderRadius: 4,
        paddingVertical: 10,
        paddingHorizontal: 15,
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2, // For Android shadow
      }}
      activeOpacity={0.8}>
      <Image
        source={{
          uri: "https://developers.google.com/identity/images/g-logo.png",
        }}
        style={{ width: 24, height: 24, marginRight: 10 }}
      />
      <Text
        style={{
          fontSize: 16,
          color: "#757575",
          fontFamily: "Roboto-Regular",
          fontWeight: "500",
        }}>
        Sign in with Google
      </Text>
    </TouchableOpacity>
  );
}
