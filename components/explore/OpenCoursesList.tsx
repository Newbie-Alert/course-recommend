import { getCourses } from "@/lib/supabase/courses/courses";
import { Database } from "@/types/db.types";
import { BottomSheetFlatList, useBottomSheet } from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { RefreshControl, Text, TouchableOpacity, View } from "react-native";
import {
  Extrapolation,
  interpolate,
  useAnimatedReaction,
} from "react-native-reanimated";
import { runOnJS } from "react-native-worklets";

export type CourseRow = Database["public"]["Tables"]["courses"]["Row"];

const PAGE_SIZE = 10;

export default function OpenCoursesList({
  searchInput,
  setInputOpacity,
  onSelect,
}: {
  searchInput?: string;
  setInputOpacity: React.Dispatch<React.SetStateAction<number>>;
  onSelect: (course: Database["public"]["Tables"]["courses"]["Row"]) => void;
}) {
  const { animatedIndex } = useBottomSheet();

  const [courses, setCourses] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchingRef = useRef(false);

  const fetchData = useCallback(
    async (pageNum: number, isRefresh = false) => {
      if (fetchingRef.current) return;
      fetchingRef.current = true;
      setLoading(true);

      const start = Math.max(0, (pageNum - 1) * PAGE_SIZE);
      const end = start + PAGE_SIZE - 1;

      try {
        const { data, total } = await getCourses(start, end, searchInput);
        setCourses((prev) =>
          isRefresh
            ? data
            : [
                ...prev,
                ...data.filter(
                  (d) => !prev.find((p) => p.main_key === d.main_key)
                ),
              ]
        );
        setHasMore(data.length === PAGE_SIZE && start + data.length < total);
      } catch (error) {
        console.error("❌ Error fetching:", error);
      } finally {
        fetchingRef.current = false;
        setLoading(false);
        if (isRefresh) setRefreshing(false);
      }
    },
    [searchInput]
  );

  useEffect(() => {
    setCourses([]);
    setPage(1);
    fetchData(1, true);
  }, [searchInput]);

  const handleLoadMore = useCallback(() => {
    if (!hasMore || loading || refreshing || fetchingRef.current) return;
    const next = page + 1;
    setPage(next);
    fetchData(next);
  }, [page, hasMore, loading, refreshing, fetchData]);

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchData(1, true);
  };

  useAnimatedReaction(
    () => animatedIndex.value,
    (value) => {
      const opacity = interpolate(value, [0, 1], [1, 0], Extrapolation.CLAMP);
      runOnJS(setInputOpacity)(opacity);
    }
  );

  if (courses.length === 0) {
    return (
      <View>
        <Text>검색 결과가 없습니다</Text>
      </View>
    );
  }

  return (
    <BottomSheetFlatList
      data={courses}
      keyExtractor={(item: CourseRow) => item.main_key}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.1}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      renderItem={({ item }: { item: CourseRow }) => (
        <TouchableOpacity
          onPress={() => onSelect(item)}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderBottomWidth: 0.3,
            borderColor: "#ccc",
          }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            {item.course_name}
          </Text>
          <Text style={{ fontSize: 12, color: "#888" }}>
            {item.h_eng_city} {item.h_eng_gu} {item.h_eng_dong}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
}
