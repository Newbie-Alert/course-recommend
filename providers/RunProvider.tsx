import React, { createContext, useContext, useState } from "react";

type RunStatus = "idle" | "running" | "paused" | "stopped";

type RunContext = {
  status: RunStatus;
  setStatus: (status: RunStatus) => void;
};

const RunContext = createContext<RunContext>({
  status: "idle", // 앱은 켜져 있지만 아직 아무것도 시작하지 않은 상태
  setStatus: () => {},
});

export default function RunProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [status, setStatus] = useState<RunStatus>("idle");
  return (
    <RunContext.Provider value={{ status, setStatus }}>
      {children}
    </RunContext.Provider>
  );
}

export const useRun = () => useContext(RunContext);
