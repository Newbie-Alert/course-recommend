import LogoutButton from "@/components/LogoutButton";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { View } from "react-native";

export default function Workout() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMeg, setErrorMeg] = useState<string | null>(null);

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMeg("위치 정보 접근이 거부되었습니다. 권한을 허용해주세요.");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }

    getCurrentLocation();
  }, []);

  return (
    <View>
      <LogoutButton />
      <Text>a</Text>
    </View>
  );
}
