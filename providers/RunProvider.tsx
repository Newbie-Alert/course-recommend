import * as Location from "expo-location";
import haversine from "haversine-distance";
import React, { createContext, useContext, useRef, useState } from "react";

export type RunStatus = "ready" | "running" | "paused" | "stopped";
export type LatLon = { latitude: number; longitude: number };

export type RunContextType = {
  status: RunStatus;
  seconds: number;
  path: LatLon[];
  distanceKm: number;
  startRunning: () => void;
  pauseRunning: () => void;
  stopRunning: () => void;
  resumeRunning: () => void;
};

const RunContext = createContext<RunContextType | null>(null);

export default function RunProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [status, setStatus] = useState<RunStatus>("ready");
  const [seconds, setSeconds] = useState(0);
  const [path, setPath] = useState<LatLon[]>([]);
  const [distanceKm, setDistanceKm] = useState(0);

  const timeRef = useRef<number | null>(null);
  const watchSubRef = useRef<Location.LocationSubscription>(null);
  const lastPointRef = useRef<LatLon | null>(null);

  // 타이머
  const startTimer = () => {
    if (!timeRef.current) {
      timeRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
  };

  const clearTimer = () => {
    if (timeRef.current) {
      clearInterval(timeRef.current);
      timeRef.current = null;
    }
  };

  // 위치 구독
  const startTracking = async () => {
    const { status: permission } =
      await Location.requestForegroundPermissionsAsync();
    if (permission !== "granted") throw new Error("위치 권한이 필요합니다.");

    watchSubRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 1000,
        distanceInterval: 5,
        mayShowUserSettingsDialog: true,
      },
      (location) => {
        // 새로 받은 현재 위치를 객체로 받음
        const newPosition: LatLon = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        setPath((prev) => {
          // 위치 정보가 처음에 비어 있을 경우, 처음 위치를 경로에 넣음
          if (prev.length === 0) {
            lastPointRef.current = newPosition;
            return [newPosition];
          }

          // 마지막으로 저장된 위치
          const lastPosition = lastPointRef.current ?? prev[prev.length - 1];

          // 실제 이동 거리 계산 (haversine 라이브러리 사용)
          const disKm = haversine(lastPosition, newPosition);

          // 5m 이동 했을 때 새로운 위치를 추가
          if (disKm > 0.005) {
            setDistanceKm((km) => km + disKm);
            lastPointRef.current = newPosition;
            return [...prev, newPosition];
          }

          // 움직임이 너무 작을 때 기존 경로 그대로 반환
          return prev;
        });
      }
    );
  };

  const stopWatching = () => {
    watchSubRef.current?.remove();
    watchSubRef.current = null;
  };

  // 러닝 시작
  const startRunning = async () => {
    setStatus("running");
    setSeconds(0);
    setPath([]);
    setDistanceKm(0);
    lastPointRef.current = null;
    startTimer();
    await startTracking();
  };

  // 러닝 일시 정지
  const pauseRunning = () => {
    if (status !== "running") return;
    setStatus("paused");
    clearTimer();
    stopWatching();
  };

  // 러닝 일시 정지 후 다시 시작
  const resumeRunning = async () => {
    if (status !== "paused") return;
    setStatus("running");
    startTimer();
    await startTracking();
  };

  // 러닝 종료
  const stopRunning = () => {
    setStatus("stopped");
    clearTimer();
    stopWatching();
  };

  return (
    <RunContext.Provider
      value={{
        status,
        seconds,
        path,
        distanceKm,
        startRunning,
        stopRunning,
        pauseRunning,
        resumeRunning,
      }}>
      {children}
    </RunContext.Provider>
  );
}

export const useRun = (): RunContextType => {
  const context = useContext(RunContext);
  if (!context) {
    throw new Error("useRun은 RunProvider안에서 사용해야합니다.");
  }
  return context;
};

// 러닝 시작 버튼 탭 후 1, 2, 3 카운트 후 러닝 시작
// 카운트가 끝나고 러닝 출발점 찍는다
// 러닝 일시 정지 시, 사용자가 움직여도 루트를 그리지 않음, 타이머도 정지
// 러닝 정지 시, 러닝 끝난지점 찍은 후 기록저장
// 러닝 루트 공유여부 물어보기  - 지도사진/뛴거리/시간/평균페이스/칼로리 + 유저가 원하면 인증사진 찍고 공유하기
// 공유한 루트와 내용 피드에 올리기

// 공유하지 않고 기록 분석만 할 경우 프로필로 이동해서 기록 그래프 뵈주기
