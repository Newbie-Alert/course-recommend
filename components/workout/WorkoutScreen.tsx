import StartButton from "@/components/workout/StartButton";
import { useRun } from "@/providers/RunProvider";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useMemo, useRef } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import RecordModal from "./RecordModal";
import WorkoutMap from "./WorkoutMap";

export default function WorkoutScreen() {
  // 모달 사이즈
  const snapPoints = useMemo(() => ["3%", "30%", "100%"], []);
  const bottomSheetRef = useRef<BottomSheet>(null);

  // 러닝 상태
  const { status, startRunning } = useRun();

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* 지도 */}
      <WorkoutMap />
      {/* 시작버튼 */}
      {status === "idle" && <StartButton onPress={startRunning} />}
      {/* 모달 */}
      {status !== "idle" && (
        <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints} index={1}>
          <BottomSheetView style={styles.modalContainer}>
            <RecordModal />
          </BottomSheetView>
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
    flex: 1,
    alignItems: "center",
  },
});
