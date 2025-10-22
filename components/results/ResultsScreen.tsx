import { useAuthContext } from "@/hooks/useAuthContext";
import { supabase } from "@/lib/supabase/supabase";
import { useRun } from "@/providers/RunProvider";
import {
  avgPaceSecPerKm,
  formatCalories,
  formatDistance,
  formatPace,
  formatTime,
} from "@/util/util";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function ResultsScreen() {
  const run = useRun();
  const { session } = useAuthContext();
  const params = useLocalSearchParams();

  const seconds = Number(params.seconds ?? run.seconds ?? 0);
  const distanceKm = Number(params.distanceKm ?? run.distanceKm ?? 0);
  const avg = avgPaceSecPerKm(seconds, distanceKm);
  const caloriesKcal = Number(params.caloriesKcal ?? run.caloriesKcal ?? 0);

  const path = run.path ?? [];
  const start = path[0];
  const end = path[path.length - 1];

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);

      const pathGeoJSON = {
        type: "LineString",
        coordinates: path.map((p) => [p.longitude, p.latitude]),
      };

      const { data, error } = await supabase
        .from("records")
        .insert([
          {
            user_id: session?.user.id,
            start_lat: start?.latitude,
            start_lon: start?.longitude,
            end_lat: end?.latitude,
            end_lon: end?.longitude,
            distance_km: distanceKm,
            duration_sec: seconds,
            avg_pace_sec_per_km: avg,
            calories_kcal: caloriesKcal,
            path_geojson: pathGeoJSON,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={{ padding: 20 }}>
      <Text>결과</Text>
      <Text> 시간: {formatTime(seconds)}</Text>
      <Text> 거리: {formatDistance(distanceKm)}</Text>
      <Text> 평균페이스: {formatPace(avg)}</Text>
      <Text> 칼로리: {formatCalories(caloriesKcal)}</Text>
      <View>
        <Pressable style={styles.shareButton} onPress={handleSave}>
          <Text>피드 공유</Text>
        </Pressable>

        <Pressable style={styles.resultButton}>
          <Text>결과 분석</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shareButton: {
    color: "#242424",
    backgroundColor: "#DBFF00",
    alignItems: "center",
    paddingVertical: 10,
  },
  resultButton: {
    color: "#242424",
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    paddingVertical: 10,
  },
});
