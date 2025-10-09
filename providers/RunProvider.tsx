import { calcDistance } from "@/util/util";
import * as Location from "expo-location";
import React, { createContext, useContext, useRef, useState } from "react";

export type RunStatus = "running" | "paused" | "stopped";
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
  const [status, setStatus] = useState<RunStatus>("stopped");
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
        accuracy: Location.Accuracy.Highest,
        timeInterval: 1000,
        distanceInterval: 0,
      },
      (location) => {
        const position: LatLon = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        setPath((prev) => {
          if (prev.length === 0) {
            lastPointRef.current = position;
            return [position];
          }
          const last = lastPointRef.current ?? prev[prev.length - 1];

          const disKm = calcDistance(last, position);

          if (disKm > 0.0005) {
            setDistanceKm((km) => km + disKm);
            lastPointRef.current = position;
            return [...prev, position];
          }
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
    setSeconds(0);
    stopWatching();
    setPath([]);
    setDistanceKm(0);
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
