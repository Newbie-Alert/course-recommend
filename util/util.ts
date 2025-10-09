import { LatLon } from "@/providers/RunProvider";

// 타이머 시간 포맷
export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};

// (이해 할 수 없는) 러닝 거리 계산
export const calcDistance = (a: LatLon, b: LatLon) => {
  const R = 6371; // 지구반지름(km)
  const convertRadians = (degree: number) => (degree * Math.PI) / 180; // 각도를 라디안으로 변환

  const dLat = convertRadians(b.latitude - a.latitude); // 위도 차이 라디안 단위로 계산
  const dLon = convertRadians(b.longitude - b.longitude); // 경도 차이 라디안 단위로 계산

  const la1 = convertRadians(a.latitude); // a 지점의 위도를 라디안으로 변환
  const la2 = convertRadians(b.latitude); // b 지점의 위도를 라디안으로 변환

  // 하버사인 공식 대입: 두 좌표 사이의 구면 거리(지구 곡면)를 구할 때 쓰는 수학 공식
  const haversine =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(haversine));
};
