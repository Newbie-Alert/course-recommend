import { useEffect, useState } from "react";

type Props = {
  value: string;
  delay: number; // ms단위
};

export default function useDebounce({ value, delay }: Props) {
  const [debounced, setDebounced] = useState<string>(value || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debounced;
}
