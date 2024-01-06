import { useEffect, useState } from "react";

export const useFirst = (value: any) => {
  const [reflashTime, setReflashTime] = useState(0);
  const [first, setFirst] = useState(true);
  useEffect(() => {
    if (first && reflashTime === 0) {
      setFirst(false);
    }
    setReflashTime(reflashTime + 1);
  }, [value]);
  return first;
};
