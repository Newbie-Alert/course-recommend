import useDebounce from "@/hooks/useDebounce";
import { Database } from "@/types/db.types";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import * as Location from "expo-location";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import RootList from "../feed/RootList";
import MapLoading from "../workout/MapLoading";
import ModalBackground from "../workout/ModalBackground";
import SearchBar from "./SearchBar";

export default function ExploreScreen() {
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObject | null>(null);
  const [errorMeg, setErrorMeg] = useState<string | null>(null);

  // 모달 사이즈
  const snapPoints = useMemo(() => ["35%", "95%"], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [snapPointIndex, setSnapPointIndex] = useState(0);

  // 검색
  const [searchInput, setSearchInput] = useState<string>("");
  const debounced = useDebounce({ value: searchInput, delay: 500 });
  const [searchResult, setSearchResult] =
    useState<Pick<Database["public"]["Tables"], "feeds">[]>();

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

  const fetchPlaces = async (query: string) => {
    const res = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.ANDROID_GOOGLE_PLACES_API_KEY!,
          "X-Goog-FieldMask":
            "places.displayName,places.formattedAddress,places.location",
        },
        body: JSON.stringify({
          textQuery: query,
          languageCode: "ko",
          regionCode: "KR",
        }),
      }
    );

    const data = await res.json();
    console.log(data);
    return data.places;
  };

  useEffect(() => {
    fetchPlaces(debounced);
  }, [debounced]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <View
        style={{
          position: "absolute",
          zIndex: 3,
          top: "5%",
          left: "50%",
          transform: [{ translateX: "-50%" }],
        }}>
        <SearchBar input={searchInput} onChange={setSearchInput} />
      </View>
      {/* 지도 */}
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
      {/* 모달 */}
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={0}
        onChange={setSnapPointIndex}
        backgroundComponent={ModalBackground}>
        <BottomSheetView style={styles.modalContainer}>
          <RootList />
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContainer: {
    height: "100%",
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
