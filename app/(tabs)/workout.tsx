import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

export default function Workout() {
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObject | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [route, setRoute] = useState<{ latitude: number; longitude: number }[]>(
    []
  );
  const [errorMeg, setErrorMeg] = useState<string | null>(null);

  const watchRef = useRef<Location.LocationSubscription | null>(null);
  const mapRef = useRef<MapView | null>(null);

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

    // 언마운트 시 구독 정리
    return () => {
      watchRef.current?.remove();
      watchRef.current = null;
    };
  }, []);

  const startTracking = async () => {
    if (watchRef.current) return;

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMeg("위치 접근 권한이 필요합니다.");
      return;
    }

    watchRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000, // 1초마다 업데이트
        distanceInterval: 3, // 3m 이동 시 업데이트
        mayShowUserSettingsDialog: true, //
      },
      (location) => {
        const { latitude, longitude } = location.coords;

        // 경로 좌표 누적
        setRoute((prev) => [...prev, { latitude, longitude }]);

        // 현재 위치 갱신
        setCurrentLocation(location);

        // 지도 카메라 따라다니기
        mapRef.current?.animateCamera({
          center: { latitude, longitude },
          zoom: 17,
        });
      }
    );

    setIsRunning(true);
  };

  // 러닝 일시정지
  const pauseTracking = async () => {
    await watchRef.current?.remove();
    watchRef.current = null;
    setIsRunning(false);
  };

  // 러닝 시작/일시정지 토글
  const toggleTracking = () => {
    if (isRunning) {
      pauseTracking();
    } else {
      startTracking();
    }
  };

  return (
    <View style={styles.container}>
      {currentLocation && (
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: currentLocation?.coords.latitude,
            longitude: currentLocation?.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          showsUserLocation
          followsUserLocation={true}
          style={styles.map}>
          {route.length > 1 && (
            <Polyline coordinates={route} strokeWidth={6} geodesic />
          )}

          {route.length > 0 && <Marker coordinate={route[0]} title="Start" />}
        </MapView>
      )}
      <Pressable onPress={toggleTracking} style={styles.startBtn}>
        <Text>{isRunning ? "PAUSE" : "START"}</Text>
      </Pressable>

      <Pressable onPress={toggleTracking} style={styles.startBtn}>
        <Text>{isRunning ? "PAUSE" : "START"}</Text>
      </Pressable>
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
  startBtn: {
    position: "absolute",
    bottom: 50,
    left: 150,
    paddingVertical: 30,
    paddingHorizontal: 30,
    borderRadius: 100,
    backgroundColor: "#2563EB",
    elevation: 4,
  },
});
