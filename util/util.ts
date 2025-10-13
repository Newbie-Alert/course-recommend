// 타이머 시간 포맷
export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};

// 평균 페이스 계산
export const avgPaceSecPerKm = (sec: number, km: number) => {
  if (km <= 0) return null;
  return sec / km;
};
