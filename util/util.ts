import proj4 from "proj4";

// 타이머 시간 포맷
export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};

// 실시간 페이스 계산
export const instPaceSecPerKm = (speed: number | null) => {
  if (!speed || speed <= 0) return null;
  return 1000 / speed;
};

// 평균 페이스 계산
export const avgPaceSecPerKm = (sec: number, km: number) => {
  if (km <= 0) return null;
  return sec / km;
};

// 거리 포맷
export const formatDistance = (km: number | null) => {
  if (km === null || !isFinite(km)) return "0.00";
  return `${km.toFixed(2)}`;
};

// 칼로리 포맷
export const formatCalories = (kcal: number | null) => {
  if (kcal === null || !isFinite(kcal)) return "0.0";
  return `${kcal.toFixed(1)}`;
};

// 페이스 포맷
export const formatPace = (secPerKm: number | null) => {
  if (secPerKm === null || !isFinite(secPerKm) || secPerKm <= 0) return "--:--";
  const m = Math.floor(secPerKm / 60);
  const s = Math.round(secPerKm % 60);

  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

// 좌표 포맷 변경
proj4.defs(
  "EPSG:5181",
  "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +units=m +no_defs"
);

export const toWGS84 = (x: number, y: number) => {
  const [lng, lat] = proj4("EPSG:5181", "EPSG:4326", [x, y]);
  return { latitude: lat, longitude: lng };
};
