import MapLoading from "@/components/workout/MapLoading";
import useUserLocation from "@/hooks/useUserLocation";
import { getPlacesByCoords } from "@/lib/supabase/explore/exploreApi";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

export default function Explore() {
  const { currentLocation, errorMeg } = useUserLocation();

  useEffect(() => {
    if (currentLocation) {
      const { longitude, latitude } = currentLocation.coords;
      getPlacesByCoords(longitude, latitude);
    }
  }, [currentLocation]);

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
