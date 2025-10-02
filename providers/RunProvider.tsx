import React, { createContext, useContext, useRef, useState } from "react";

type RunStatus = "running" | "paused" | "stopped";

type RunContextType = {
  status: RunStatus;
  seconds: number;
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
  const timeRef = useRef<number | null>(null);

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

  const startRunning = () => {
    setStatus("running");
    startTimer();
  };

  const pauseRunning = () => {
    if (status === "running") {
      setStatus("paused");
      clearTimer();
    }
  };

  const resumeRunning = () => {
    if (status === "paused") {
      setStatus("running");
      startTimer();
    }
  };
  const stopRunning = () => {
    setStatus("stopped");
    clearTimer();
    setSeconds(0);
  };

  return (
    <RunContext.Provider
      value={{
        status,
        seconds,
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
