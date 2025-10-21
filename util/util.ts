import proj4 from "proj4";

// 타이머 시간 포맷
export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
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