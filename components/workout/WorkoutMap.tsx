import MapLoading from "@/components/workout/MapLoading";
import { useRun } from "@/providers/RunProvider";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

export default function WorkoutMap() {
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObject | null>(null);
  const [errorMeg, setErrorMeg] = useState<string | null>(null);
  const { path, status } = useRun();

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
      {currentLocation ? (
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
          style={styles.map}>
          {/* 러닝 시작 지점 */}
          {path.length > 0 && (
            <Marker
              coordinate={{
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
              }}
              title="START"
              pinColor="#00C853"
            />
          )}
          {/* 러닝 종료 지점 */}
          {status === "stopped" && (
            <Marker
              coordinate={{
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
              }}
              title="FINISH"
              pinColor="#D50000"
            />
          )}
          {/* 러닝 루트 */}
          {path.length > 1 && (
            <Polyline
              coordinates={
                path || [
                  { latitude: 35.2518, longitude: 128.752 },
                  { latitude: 35.2513, longitude: 128.7525 },
                ]
              }
              strokeColor="#085FDE"
              strokeWidth={5}></Polyline>
          )}
        </MapView>
      ) : (
        <MapLoading />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
