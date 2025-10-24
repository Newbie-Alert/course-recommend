// types/run.ts
export type RunSnapshot = {
  path: { latitude: number; longitude: number }[];
  distanceKm: number;
  seconds: number;
  avgPace: number | null;
  caloriesKcal: number;
  createdAt: number;
};

export const LAST_RUN_KEY = "last_run_snapshot";
