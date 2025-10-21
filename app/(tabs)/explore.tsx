import DetailSheet from "@/components/explore/DetailSheet";
import ModalBackgroundWhite from "@/components/explore/ModalBackgroundWhite";
import RootList from "@/components/explore/RootList";
import SearchBar from "@/components/explore/SearchBar";
import MapLoading from "@/components/workout/MapLoading";
import useUserLocation from "@/hooks/useUserLocation";
import {
  getPlacesByCoords,
  getPlacesBySearchText,
} from "@/lib/supabase/explore/exploreApi";
import { Place, PlaceResponse } from "@/types/places.type";
import BottomSheet from "@gorhom/bottom-sheet";
import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { BackHandler, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Animated from "react-native-reanimated";

export default function Explore() {
  const { currentLocation, errorMeg } = useUserLocation();
  const [places, setPlaces] = useState<PlaceResponse["places"]>();
  const [searchInput, setSearchInput] = useState<string>("");
  const [inputOpacity, setInputOpacity] = useState<number>(3);
  const mapRef = useRef<MapView | null>(null);

  // 모달 사이즈
  const snapPoints = useMemo(() => ["35%", "95%"], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [snapPointIndex, setSnapPointIndex] = useState(0);

  const [detail, setDetail] = useState<Place>();

  useEffect(() => {
    if (currentLocation) {
      const { longitude, latitude } = currentLocation.coords;
      const getPlaces = async () => {
        const res = await getPlacesByCoords(longitude, latitude);
        setPlaces(res);
      };
      getPlaces();
    }
  }, [currentLocation]);

  useEffect(() => {
    if (places && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: detail
          ? detail.location.latitude
          : places[0].location.latitude,
        longitude: detail
          ? detail.location.longitude
          : places[0].location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [places]);

  const setPlaceBySearchResult = async (searchInput: string) => {
    try {
      const res = await getPlacesBySearchText(searchInput);
      setPlaces(res);
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (detail) {
          setDetail(undefined);
          return true; // 기본 뒤로가기 동작 막기
        }
        return false; // detail이 없으면 기본 동작 수행
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [detail])
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <Animated.View
        style={[
          {
            position: "absolute",
            zIndex: 1,
            top: "5%",
            left: "50%",
            transform: [{ translateX: "-50%" }],
            opacity: inputOpacity,
          },
        ]}>
        <SearchBar
          input={searchInput}
          onChange={setSearchInput}
          onSubmit={() => setPlaceBySearchResult(searchInput)}
        />
      </Animated.View>
      {/* 지도 */}
      <View style={styles.container}>
        {currentLocation ? (
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
            {places &&
              places?.map((item) => {
                return (
                  <Marker
                    key={item.displayName.text}
                    onPress={() => {
                      setDetail(item);
                    }}
                    coordinate={{
                      latitude: item.location?.latitude,
                      longitude: item.location.longitude,
                    }}
                  />
                );
              })}
          </MapView>
        ) : (
          <MapLoading />
        )}
      </View>
      {/* 모달 */}
      {places && (
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          index={0}
          onChange={setSnapPointIndex}
          backgroundComponent={ModalBackgroundWhite}>
          {detail ? (
            <DetailSheet detail={detail} setOpacity={setInputOpacity} />
          ) : (
            <RootList
              searchResult={places}
              setOpacity={setInputOpacity}
              setDetail={setDetail}
            />
          )}
        </BottomSheet>
      )}
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
