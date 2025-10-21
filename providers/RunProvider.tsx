import { instPaceSecPerKm } from "@/util/util";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import haversine from "haversine-distance";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Alert } from "react-native";

export type RunStatus = "ready" | "running" | "paused" | "stopped";
export type LatLon = { latitude: number; longitude: number };

export type RunContextType = {
  status: RunStatus;
  seconds: number;
  path: LatLon[];
  distanceKm: number;
  avgPace: number | null; // 러닝 종료 시 평균 페이스
  instPace: number | null; // 실시간 페이스
  caloriesKcal: number;
  startRunning: () => void;
  pauseRunning: () => void;
  stopRunning: () => void;
  resumeRunning: () => void;
};

const RunContext = createContext<RunContextType | null>(null);
const KCAL_PER_KM = 65;
const MIN_STEP_M = 5;

export default function RunProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [status, setStatus] = useState<RunStatus>("ready");
  const [seconds, setSeconds] = useState(0);
  const [path, setPath] = useState<LatLon[]>([]);
  const [distanceKm, setDistanceKm] = useState(0);
  const [avgPace, setAvgPace] = useState<number | null>(null);
  const [instPace, setInstPace] = useState<number | null>(null);
  const [caloriesKcal, setCaloriesKcal] = useState(0);

  const router = useRouter();

  const timeRef = useRef<number | null>(null);
  const watchSubRef = useRef<Location.LocationSubscription>(null);

  const distanceMeterRef = useRef(0);
  const lastPointRef = useRef<{
    lat: number;
    lon: number;
    timestamp: number;
  } | null>(null);

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
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 5,
        mayShowUserSettingsDialog: true,
      },
      (location) => {
        const { latitude, longitude, speed } = location.coords;
        const ts = location.timestamp;

        if (!lastPointRef.current) {
          lastPointRef.current = {
            lat: latitude,
            lon: longitude,
            timestamp: ts,
          };
          setPath([{ latitude, longitude }]);
          return;
        }

        const last = lastPointRef.current;

        const distanceMeters = haversine(
          { lat: last.lat, lon: last.lon },
          { lat: latitude, lon: longitude }
        );

        const distanceTime = Math.max(0.001, (ts - last.timestamp) / 1000);

        // 5m 이상 이동시에만 누적/경로 추가
        if (distanceMeters > MIN_STEP_M) {
          distanceMeterRef.current += distanceMeters;

          // 거리/칼로리 실시간 업데이트
          const kmNow = distanceMeterRef.current / 1000;
          setDistanceKm(kmNow);
          setCaloriesKcal(KCAL_PER_KM * kmNow);

          // 실시간 페이스: GPS speed 우선 없으면 distanceMeters / distanceTime
          const v = speed && speed > 0 ? speed : distanceMeters / distanceTime;
          setInstPace(instPaceSecPerKm(v));

          setPath((prev) => [...prev, { latitude, longitude }]);
          lastPointRef.current = {
            lat: latitude,
            lon: longitude,
            timestamp: ts,
          };
        }
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
    setAvgPace(0);
    setInstPace(0);
    setCaloriesKcal(0);
    distanceMeterRef.current = 0;
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
    if (status !== "running" && status !== "paused") return;

    pauseRunning();

    const totalSeconds = seconds;
    const km = distanceKm;
    const avg = km > 0 ? totalSeconds / km : null;
    const caloriesNow = KCAL_PER_KM * km;

    Alert.alert("러닝 종료", "러닝을 종료 하시겠어요?", [
      { text: "취소", style: "cancel", onPress: () => resumeRunning() },
      {
        text: "종료",
        onPress: () => {
          setAvgPace(avg);
          setStatus("stopped");
          clearTimer();
          stopWatching();
          setCaloriesKcal(0);
          setInstPace(null);

          router.push({
            pathname: "/results",
            params: {
              seconds: totalSeconds.toString(),
              distanceKm: String(km),
              avg: avg ? String(avg) : "0",
              caloriesKcal: String(caloriesNow),
            },
          });
        },
      },
    ]);
  };

  useEffect(() => {
    return () => {
      clearTimer();
      stopWatching();
    };
  }, []);

  return (
    <RunContext.Provider
      value={{
        status,
        seconds,
        path,
        distanceKm,
        avgPace,
        instPace,
        caloriesKcal,
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
  const ctx = useContext(RunContext);
  if (!ctx) throw new Error("useRun은 RunProvider안에서 사용해야합니다.");
  return ctx;
};
