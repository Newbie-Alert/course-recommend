import { LAST_RUN_KEY, RunSnapshot } from "@/types/run.type";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function saveLastRun(snapshot: RunSnapshot) {
  await AsyncStorage.setItem(LAST_RUN_KEY, JSON.stringify(snapshot));
}

export async function loadLastRun(): Promise<RunSnapshot | null> {
  const raw = await AsyncStorage.getItem(LAST_RUN_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as RunSnapshot;
  } catch {
    await AsyncStorage.removeItem(LAST_RUN_KEY);
    return null;
  }
}

export async function clearLastRun() {
  await AsyncStorage.removeItem(LAST_RUN_KEY);
}
