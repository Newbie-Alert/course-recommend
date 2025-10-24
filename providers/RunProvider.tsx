import { saveLastRun } from "@/lib/lastRun";
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
  avgPace: number | null;
  instPace: number | null;
  caloriesKcal: number;
  startRunning: () => void;
  pauseRunning: () => void;
  stopRunning: () => void;
  resumeRunning: () => void;
  resetRunning: () => void;
};

const RunContext = createContext<RunContextType | null>(null);
const KCAL_PER_KM = 65; // 몸무게 기본값
const MIN_STEP_M = 5;
const SPEED_SMOOTH_WINDOW = 5;
const MAX_SPEED = 7;

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

  const timeRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTsRef = useRef<number | null>(null);
  const watchSubRef = useRef<Location.LocationSubscription | null>(null);
  const speedBufRef = useRef<number[]>([]);

  const distanceMeterRef = useRef(0);
  const lastPointRef = useRef<{
    lat: number;
    lon: number;
    timestamp: number;
  } | null>(null);

  // 타이머
  const startTimer = () => {
    if (!timeRef.current) {
      if (startTsRef.current === null) startTsRef.current = Date.now();
      timeRef.current = setInterval(() => {
        if (startTsRef.current !== null) {
          const elapsed = Math.floor((Date.now() - startTsRef.current) / 1000);
          setSeconds(elapsed);
        }
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
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 5,
        mayShowUserSettingsDialog: true,
      },
      (location) => {
        const { latitude, longitude, speed, accuracy } = location.coords;
        const ts = location.timestamp;

        if (typeof accuracy === "number" && accuracy > 25) return;

        if (!lastPointRef.current) {
          lastPointRef.current = {
            lat: latitude,
            lon: longitude,
            timestamp: ts,
          };
          setPath([{ latitude, longitude }]);
          speedBufRef.current = [];
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

          const vRaw =
            speed && speed > 0 ? speed : distanceMeters / distanceTime;
          const v = Math.min(vRaw, MAX_SPEED);
          speedBufRef.current.push(v);
          if (speedBufRef.current.length > SPEED_SMOOTH_WINDOW) {
            speedBufRef.current.shift();
          }

          const vAvg =
            speedBufRef.current.reduce((a, b) => a + b, 0) /
            speedBufRef.current.length;

          setInstPace(vAvg > 0 ? instPaceSecPerKm(vAvg) : null);

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
    try {
      const { status: permission } =
        await Location.requestForegroundPermissionsAsync();
      if (permission !== "granted") throw new Error("위치 권한이 필요합니다.");

      setStatus("running");
      setSeconds(0);
      setPath([]);
      setDistanceKm(0);
      setAvgPace(null);
      setInstPace(null);
      setCaloriesKcal(0);
      distanceMeterRef.current = 0;
      lastPointRef.current = null;
      startTsRef.current = Date.now();
      startTimer();
      await startTracking();
    } catch (error: any) {
      clearTimer();
      stopWatching();
      setStatus("ready");
      startTsRef.current = null;
      Alert.alert("위치 권한 필요", error?.message ?? "위치권한 필요");
    }
  };

  // 러닝 일시 정지
  const pauseRunning = () => {
    if (status !== "running") return;
    setStatus("paused");

    if (startTsRef.current !== null) {
      const soFar = Math.floor((Date.now() - startTsRef.current) / 1000);
      setSeconds(soFar);
    }
    clearTimer();
    stopWatching();
  };

  // 러닝 일시 정지 후 다시 시작
  const resumeRunning = async () => {
    if (status !== "paused") return;
    setStatus("running");
    startTsRef.current = Date.now() - seconds * 1000;
    lastPointRef.current = null; // 일시정지 중에 이동한 거리 버림
    speedBufRef.current = [];
    startTimer();
    await startTracking();
  };

  // 러닝 종료
  const stopRunning = () => {
    if (status !== "running" && status !== "paused") return;

    pauseRunning();

    Alert.alert("러닝 종료", "러닝을 종료 하시겠어요?", [
      { text: "취소", style: "cancel", onPress: () => resumeRunning() },
      {
        text: "종료",
        onPress: async () => {
          clearTimer();
          stopWatching();
          setStatus("stopped");

          await saveLastRun({
            path,
            distanceKm,
            seconds,
            avgPace,
            caloriesKcal,
            createdAt: Date.now(),
          });

          router.push({ pathname: "/results" });
        },
      },
    ]);
  };

  const resetRunning = () => {
    setStatus("ready");
    setSeconds(0);
    setPath([]);
    setDistanceKm(0);
    setAvgPace(null);
    setInstPace(null);
    setCaloriesKcal(0);
    distanceMeterRef.current = 0;
    lastPointRef.current = null;
    clearTimer();
    stopWatching();
    startTsRef.current = null;
  };

  useEffect(() => {
    return () => {
      clearTimer();
      stopWatching();
    };
  }, []);

  // 평균 페이스 실시간 업데이트
  useEffect(() => {
    if (distanceKm >= 0.2 && seconds > 0) {
      setAvgPace(seconds / distanceKm);
    } else {
      setAvgPace(null);
    }
  }, [distanceKm, seconds]);

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
        resetRunning,
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
