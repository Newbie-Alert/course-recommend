import MapLoading from "@/components/workout/MapLoading";
import useUserLocation from "@/hooks/useUserLocation";
import { useRun } from "@/providers/RunProvider";
import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

export default function WorkoutMap() {
  const { currentLocation, errorMeg } = useUserLocation();
  const { path, status } = useRun();
  const start = path[0];
  const end = path[path.length - 1];

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
          {status === "running" && start && (
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
          {status === "stopped" && end && (
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
