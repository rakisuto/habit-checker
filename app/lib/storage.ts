import AsyncStorage from "@react-native-async-storage/async-storage";

const HABITS_KEY = "hc:habits";
const STATUS_KEY = "hc:status:"; // 例: hc:status:2025-11-26

export const getTodayKey = (resetHour = 4) => {
  const now = new Date();
  const local = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
    now.getMilliseconds()
  );
  // リセット時刻前は前日扱い
  if (local.getHours() < resetHour) {
    local.setDate(local.getDate() - 1);
  }
  const y = local.getFullYear();
  const m = String(local.getMonth() + 1).padStart(2, "0");
  const d = String(local.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export async function loadHabits(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(HABITS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveHabits(habits: string[]) {
  await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
}

export type StatusMap = Record<string, boolean>; // habitName → true(した)/false(してない)

export async function loadStatus(dateKey: string): Promise<StatusMap> {
  const raw = await AsyncStorage.getItem(STATUS_KEY + dateKey);
  return raw ? JSON.parse(raw) : {};
}

export async function saveStatus(dateKey: string, status: StatusMap) {
  await AsyncStorage.setItem(STATUS_KEY + dateKey, JSON.stringify(status));
}
