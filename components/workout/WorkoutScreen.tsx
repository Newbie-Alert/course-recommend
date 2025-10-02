import StartButton from "@/components/workout/StartButton";
import { useRun } from "@/providers/RunProvider";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useMemo, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ModalBackground from "./ModalBackground";
import RecordModal from "./RecordModal";
import WorkoutMap from "./WorkoutMap";

export default function WorkoutScreen() {
  // 모달 사이즈
  const snapPoints = useMemo(() => ["35%", "95%"], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [snapPointIndex, setSnapPointIndex] = useState(0);

  // 러닝 상태
  const { status, startRunning } = useRun();

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* 지도 */}
      <WorkoutMap />
      {/* 시작버튼 */}
      {status === "stopped" && <StartButton onPress={startRunning} />}
      {/* 모달 */}
      {status !== "stopped" && (
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          index={0}
          onChange={setSnapPointIndex}
          backgroundComponent={ModalBackground}>
          <BottomSheetView style={styles.modalContainer}>
            <RecordModal snapPointIndex={snapPointIndex} />
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
    height: "100%",
  },
});
