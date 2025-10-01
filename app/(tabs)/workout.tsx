import CircleButton from "@/components/ui/CircleButton";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

// * Workout Page: 사용자의 현재위치. 러닝 시작 버튼. 내 근처 공유된 러닝 루트.

export default function Workout() {
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObject | null>(null);

  const [errorMeg, setErrorMeg] = useState<string | null>(null);

  const router = useRouter();

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

  return (
    <View style={styles.container}>
      {currentLocation && (
        <MapView
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: currentLocation?.coords.latitude,
            longitude: currentLocation?.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          showsUserLocation
          followsUserLocation={true}
          style={styles.map}></MapView>
      )}
      <LinearGradient
        colors={["rgba(233, 233, 233, 0.8)", "transparent"]}
        start={{ x: 0.5, y: 0.2 }}
        end={{ x: 0.5, y: 0 }}
        style={styles.gradient}
      />
      <View style={styles.startBtn}>
        <CircleButton
          onPress={() => router.push("/running")}
          width={100}
          height={100}
          backgroundColor="#085FDE"
          textColor="white"
          text="START"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 250, // 그라데이션 높이
  },
  startBtn: {
    position: "absolute",
    bottom: 50,
    left: "50%",
    transform: [
      {
        translateX: -50,
      },
    ],
  },
});

// 1. 지도에서 사용자의 현재 위치를 보여준다
// 2. 현재 위치에서 사용자가 '시작'을 누르면 러닝을 시작한다. 시간/칼로리/거리/페이스를 UI를 보여준다.
// 3. 러닝이 시작되면 출발점을 저장하고 표시한다. 그리고 시간/칼로리/거리/페이스를 기록한다.
// 4. 러닝 중 일시정지를 하면 시간/거리/페이스/칼로리 기록을 정지한다. 러닝을 다시 시작 여부를 확인하는 알림을 띄운다.
// 5. 사용자가 '정지'를 누르면 러닝 기록을 저장하고, 피드 공유 여부를 물어본다.
