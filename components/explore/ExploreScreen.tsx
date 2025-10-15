import { getCourses } from "@/lib/supabase/courses/courses";
import { Database } from "@/types/db.types";
import { toWGS84 } from "@/util/util";
import BottomSheet from "@gorhom/bottom-sheet";
import * as Location from "expo-location";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Animated from "react-native-reanimated";
import MapLoading from "../workout/MapLoading";
import ModalBackgroundWhite from "./ModalBgWhite";
import OpenCoursesList, { CourseRow } from "./OpenCoursesList";
import SearchBar from "./SearchBar";

export default function ExploreScreen() {
  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObject | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<
    Database["public"]["Tables"]["courses"]["Row"] | null
  >(null);

  const snapPoints = useMemo(() => ["35%", "95%"], []);
  const [searchInput, setSearchInput] = useState("");
  const [inputOpacity, setInputOpacity] = useState(3);
  const [searchResult, setSearchResult] = useState<{
    data: Database["public"]["Tables"]["courses"]["Row"][] | null;
    total: number;
  }>({ data: null, total: 0 });

  useEffect(() => {
    async function getCurrentLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location);
    }
    getCurrentLocation();
  }, []);

  const onSubmit = async () => {
    const data = await getCourses(0, 9, searchInput);
    setSearchResult(data);
  };

  const handleSelectCourse = (course: CourseRow) => {
    if (!course.loc_x || !course.loc_y) return;
    const { latitude, longitude } = toWGS84(course.loc_x, course.loc_y);
    console.log(latitude, longitude);

    setSelectedCourse({ ...course, loc_x: latitude, loc_y: longitude });

    mapRef.current?.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      800
    );

    bottomSheetRef.current?.snapToIndex(0);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <Animated.View style={[styles.searchBar, { opacity: inputOpacity }]}>
        <SearchBar
          input={searchInput}
          onChange={setSearchInput}
          onSubmit={onSubmit}
        />
      </Animated.View>

      <View style={styles.container}>
        {currentLocation ? (
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation
            style={styles.map}>
            {selectedCourse && (
              <Marker
                coordinate={{
                  latitude:
                    selectedCourse.loc_x || currentLocation.coords.latitude,
                  longitude:
                    selectedCourse.loc_y || currentLocation.coords.longitude,
                }}
                title={selectedCourse.course_name || ""}
              />
            )}
          </MapView>
        ) : (
          <MapLoading />
        )}
      </View>

      {searchResult.data && (
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          index={0}
          backgroundComponent={ModalBackgroundWhite}>
          <OpenCoursesList
            searchInput={searchInput}
            setInputOpacity={setInputOpacity}
            onSelect={handleSelectCourse}
          />
        </BottomSheet>
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchBar: {
    position: "absolute",
    zIndex: 1,
    top: "5%",
    left: "50%",
    transform: [{ translateX: "-50%" }],
  },
  map: { flex: 1, width: "100%", height: "100%" },
});
