import { ClassProps } from "@/types/intex";
import { useEffect, useRef, useState } from "react";

const POSITIONS = {
  left: "/img/arrow-right.png",
  right: "/img/arrow-right.png",
};

type ArrowBtnProps = {
  position: "left" | "right";
  onClick?: () => void;
  onLongPress?: () => void;
} & ClassProps;

const ArrowBtn = ({
  position = "left",
  className = "",
  onClick,
  onLongPress,
}: ArrowBtnProps) => {
  const ref = useRef({
    start: 0,
    end: 0,
  });
  const [isPress, setIsPress] = useState(false);
  useEffect(() => {
    if (!isPress) {
      return;
    }
    const scrollInterval = setInterval(() => {
      if (new Date().getTime() - ref.current.start > 200) {
        onLongPress && onLongPress();
      }
    }, 5);
    return () => {
      clearInterval(scrollInterval);
    };
  }, [isPress]);
  return (
    <div
      className={`cursor-pointer h-[88px] w-[88px] rounded-[88px] bg-gray-700 hover:bg-gray-900 flex items-center justify-center ${className}`}
      onClick={() => {
        if (ref.current.end - ref.current.start <= 2 * 100) {
          onClick && onClick();
        }
      }}
      onMouseDown={() => {
        setIsPress(true);
        ref.current.start = new Date().getTime();
      }}
      onMouseUp={() => {
        setIsPress(false);
        ref.current.end = new Date().getTime();
      }}
    >
      <div
        className={`${
          position === "left" ? "scale-[-1]" : ""
        } h-[32px] w-[32px] bg-cover bg-center transition-all`}
        style={{ backgroundImage: `url(${POSITIONS[position]})` }}
      ></div>
    </div>
  );
};

export default ArrowBtn;
