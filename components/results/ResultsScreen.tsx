import { useAuthContext } from "@/hooks/useAuthContext";
import useImageParser from "@/hooks/useImageParser";
import { clearLastRun, loadLastRun } from "@/lib/lastRun";
import { pickAndUploadMultipleImages } from "@/lib/supabase/common/uploadFile";
import { createFeed } from "@/lib/supabase/feed/feedApi";
import { supabase } from "@/lib/supabase/supabase";
import { useRun } from "@/providers/RunProvider";
import { RunSnapshot } from "@/types/run.type";
import {
  avgPaceSecPerKm,
  formatCalories,
  formatDistance,
  formatPace,
  formatTime,
} from "@/util/util";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import BottomSheet from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Dimensions, Pressable, Text, View } from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import ViewShot from "react-native-view-shot";
import ModalBackgroundWhite from "../explore/ModalBackgroundWhite";
import Carousel from "../result/Carousel";
import FeedPostSheet from "./FeedPostSheet";

export default function ResultsScreen() {
  const dimension = Dimensions.get("screen");
  const screenHeight = dimension.height;
  const snapPoints = useMemo(() => [screenHeight], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [snapPointIndex, setSnapPointIndex] = useState(0);
  const [isPost, setIsPost] = useState<boolean>(false);
  const router = useRouter();

  // viewshot Ref
  const viewShotRef = useRef<ViewShot>(null);

  const { imageParser, handleImageUpload } = useImageParser();

  const handleSheetClose = () => {
    setIsPost(false);
  };

  const { session } = useAuthContext();
  const userId = session?.user.id;
  const runContext = useRun();
  const [snap, setSnap] = useState<RunSnapshot | null>(null);
  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  const [selectedImages, setSelectedImages] = useState<string[]>();

  useEffect(() => {
    (async () => {
      const s = await loadLastRun();
      if (s) setSnap(s);
      else {
        setSnap({
          path: runContext.path,
          distanceKm: runContext.distanceKm,
          seconds: runContext.seconds,
          avgPace: runContext.avgPace,
          caloriesKcal: runContext.caloriesKcal,
          createdAt: Date.now(),
        });
      }
    })();
  }, []);

  const path = snap?.path ?? [];
  const distanceKm = snap?.distanceKm ?? 0;
  const seconds = snap?.seconds ?? 0;
  const avgPace = snap?.avgPace ?? null;
  const caloriesKcal = snap?.caloriesKcal ?? 0;

  const start = path[0];
  const end = path[path.length - 1];

  const region = useMemo(() => {
    if (!start) return undefined;

    return {
      latitude: start.latitude,
      longitude: start.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }, [start?.latitude, start?.longitude]);

  const mapRef = useRef<MapView | null>(null);
  useEffect(() => {
    if (mapRef.current && path.length >= 2) {
      mapRef.current.fitToCoordinates(path, {
        edgePadding: { top: 60, bottom: 60, left: 60, right: 60 },
        animated: false,
      });
    }
  }, [path]);

  const toLineStringGeoJSON = () => ({
    type: "LineString",
    coordinate: path.map((p) => [p.longitude, p.latitude]),
  });

  // record 데이터 저장
  const handleSave = async () => {
    try {
      if (!userId) return Alert.alert("오류", "로그인이 필요합니다.");
      if (path.length < 2) return Alert.alert("오류", "경로가 부족합니다.");

      setSaving(true);

      const lineString = toLineStringGeoJSON();

      const { data, error } = await supabase
        .from("records")
        .insert([
          {
            start_lat: start!.latitude,
            start_lon: start!.longitude,
            end_lat: end!.latitude,
            end_lon: end!.longitude,
            distance_km: distanceKm,
            duration_sec: seconds,
            avg_pace_sec_per_km:
              avgPace ?? avgPaceSecPerKm(seconds, distanceKm),
            calories_kcal: caloriesKcal,
            path_geojson: lineString,
          },
        ])
        .select("*")
        .single();

      if (error) throw error;

      await clearLastRun();

      Alert.alert("저장 완료", "기록이 업로드되었습니다.");

      return data;
    } catch (error: any) {
      Alert.alert("저장 실패", error?.message ?? "네트워크 또는 서버 오류");
    } finally {
      setSaving(false);
    }
  };

  // Feed를 저장
  const saveRecordAndPost = async (title: string, memo: string) => {
    if (!userId) throw Error("로그인이 필요합니다");
    if (!viewShotRef.current) {
      throw Error("이미지를 캡처할 수 없습니다. ref 확인");
    }

    const parsedImage = await imageParser(photoUri);
    const { fileName, arrayBuffer, mimeType } = parsedImage!;
    const imagePath = await handleImageUpload({
      fileName,
      arrayBuffer,
      mimeType,
    });

    try {
      const recordSaveRes = await handleSave();

      // record Id를 외래키로 걸어서
      // record와 feed를 연결
      if (recordSaveRes) {
        const recordId = recordSaveRes.id;
        await createFeed({
          title,
          content: memo,
          recordId,
          userId,
          thumbnail: imagePath,
          images: selectedImages,
        });
      }
      setIsPost(false);
      router.push({ pathname: "/workout" });
    } catch (error) {
      Alert.alert("저장 실패 : feed 저장 실패");
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#fff" }}>
      {region && (
        <ViewShot style={{ flex: 3 }} ref={viewShotRef}>
          <MapView
            style={{ flex: 1 }}
            provider={PROVIDER_GOOGLE}
            initialRegion={region}>
            {path.length >= 2 && (
              <Polyline
                coordinates={path}
                strokeColor="#FF6600"
                strokeWidth={5}
              />
            )}
            {start && (
              <Marker coordinate={start} title="출발" pinColor="green" />
            )}
            {end && <Marker coordinate={end} title="도착" pinColor="red" />}
          </MapView>
        </ViewShot>
      )}

      <ScrollView style={{ padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>결과</Text>
        <Text> 시간: {formatTime(seconds)}</Text>
        <Text> 거리: {formatDistance(distanceKm)}</Text>
        <Text> 평균페이스: {formatPace(avgPace)}</Text>
        <Text> 칼로리: {formatCalories(caloriesKcal)}</Text>

        <View style={{ marginTop: 12 }}>
          <View
            style={{
              display: "flex",
            }}>
            <Pressable
              onPress={async () => {
                const images = await pickAndUploadMultipleImages();
                if (!images) return;

                setSelectedImages(images);
              }}
              disabled={saving}>
              <MaterialIcons
                name="add-photo-alternate"
                size={40}
                color="black"
              />
            </Pressable>
          </View>
        </View>
        {selectedImages && (
          <View style={{ height: 200 }}>
            {/* 이미지 캐러셀 미리보기 화면 */}
            <Carousel imagePaths={selectedImages} />
          </View>
        )}

        <View
          style={{
            marginTop: 12,
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
            flex: 1,
          }}>
          <Pressable onPress={() => handleSave()} disabled={saving}>
            <Text>기록저장</Text>
          </Pressable>
          <Pressable
            onPress={async () => {
              if (!viewShotRef.current)
                throw Error("캡처 영역을 찾을 수 없습니다");
              try {
                const photoUri = await viewShotRef?.current?.capture?.();
                setPhotoUri(photoUri);
                setIsPost(true);
              } catch (error) {
                console.log(error);
              }
            }}
            disabled={saving}>
            <Text>피드공유</Text>
          </Pressable>
        </View>
      </ScrollView>

      {isPost && (
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          index={0}
          onChange={setSnapPointIndex}
          backgroundComponent={ModalBackgroundWhite}>
          <FeedPostSheet
            snap={snap}
            photoUri={photoUri}
            onSubmit={saveRecordAndPost}
            onCancle={handleSheetClose}
          />
        </BottomSheet>
      )}
    </GestureHandlerRootView>
  );
}

// 지금 러닝 기록은 feed와 일치
