import MapLoading from "@/components/workout/MapLoading";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

export default function WorkoutMap() {
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
          style={styles.map}></MapView>
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
