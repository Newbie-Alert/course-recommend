import * as Location from "expo-location";
import { useEffect, useState } from "react";

export default function useUserLocation() {
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObject | null>(null);
  const [errorMeg, setErrorMeg] = useState<string | null>(null);

  // 사용자의 현재 위치 초기에 가져오기
  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMeg("위치 정보 접근이 거부되었습니다. 권한을 허용해주세요.");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location);
    }

    getCurrentLocation();
  }, []);

  return { currentLocation, errorMeg };
}
