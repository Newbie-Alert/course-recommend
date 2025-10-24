import { useAuthContext } from "@/hooks/useAuthContext";
import { clearLastRun, loadLastRun } from "@/lib/lastRun";
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
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

export default function ResultsScreen() {
  const { session } = useAuthContext();
  const userId = session?.user.id;
  const runContext = useRun();
  const [snap, setSnap] = useState<RunSnapshot | null>(null);
  const [saving, setSaving] = useState(false);

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

  const handleSave = async () => {
    try {
      if (!userId) return Alert.alert("오류", "로그인이 필요합니다.");
      if (path.length < 2) return Alert.alert("오류", "경로가 부족합니다.");

      setSaving(true);

      const lineString = toLineStringGeoJSON();

      const { error } = await supabase
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
            path_geojson: toLineStringGeoJSON(),
          },
        ])
        .single();

      if (error) throw error;

      await clearLastRun();

      Alert.alert("저장 완료", "기록이 업로드되었습니다.");
    } catch (error: any) {
      console.log("저장 실패");
      Alert.alert("저장 실패", error?.message ?? "네트워크 또는 서버 오류");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {region && (
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
          {start && <Marker coordinate={start} title="출발" pinColor="green" />}
          {end && <Marker coordinate={end} title="도착" pinColor="red" />}
        </MapView>
      )}

      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>결과</Text>
        <Text> 시간: {formatTime(seconds)}</Text>
        <Text> 거리: {formatDistance(distanceKm)}</Text>
        <Text> 평균페이스: {formatPace(avgPace)}</Text>
        <Text> 칼로리: {formatCalories(caloriesKcal)}</Text>

        <View style={{ marginTop: 12 }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}>
            <Pressable
              onPress={() => console.log("사진 업로드 기능 추가해주세요~~")}
              disabled={saving}>
              <MaterialIcons
                name="add-photo-alternate"
                size={40}
                color="black"
              />
            </Pressable>
            <Pressable
              onPress={() => console.log("피드공유기능 추가해주세요~~")}
              disabled={saving}>
              <Text>피드공유</Text>
            </Pressable>
          </View>
        </View>

        <View style={{ marginTop: 12 }}>
          <Pressable onPress={() => handleSave()} disabled={saving}>
            <Text>기록저장</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

// 지금 러닝 기록은 feed와 일치
