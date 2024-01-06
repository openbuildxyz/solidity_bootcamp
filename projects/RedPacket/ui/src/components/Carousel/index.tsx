import React, { useEffect, useMemo, useRef, useState } from "react";
import Style from "./style.module.scss";
import RedPacket from "../RedPacket";
import ArrowBtn from "../ArrowBtn";
import { RedPacketType } from "@/types/intex";
type CarouselProps = {
  data: RedPacketType[];
  className?: string;
};

const scrollFn = (scrollableContent, direction) => {
  const scrollDistance = 4; // 每次滚动的距离
  const currentScrollLeft = scrollableContent.scrollLeft;

  // 计算下一个滚动位置
  let nextScrollLeft;

  if (direction === "right") {
    nextScrollLeft = currentScrollLeft + scrollDistance;
  } else if (direction === "left") {
    nextScrollLeft = currentScrollLeft - scrollDistance;
  }

  // 检查是否超出边界
  scrollableContent.scrollLeft = nextScrollLeft;
};

const scrollNextFn = (scrollableContent, direction) => {
  const scrollDistance = 268.55 + 16; // 每次滚动的距离
  const currentScrollLeft = scrollableContent.scrollLeft;

  // 计算下一个滚动位置
  let nextScrollLeft;

  if (direction === "right") {
    nextScrollLeft = currentScrollLeft + scrollDistance;
  } else if (direction === "left") {
    nextScrollLeft = currentScrollLeft - scrollDistance;
  }
  scrollableContent.scrollLeft = nextScrollLeft;
  // 检查是否超出边界
  // if (nextScrollLeft >= 0 && nextScrollLeft <= maxScrollLeft) {

  // }
};

const Carousel = React.memo(({ data = [], className }: CarouselProps) => {
  const ref = useRef<any>();
  const [isScroll, setIsScroll] = useState(false);

  const leftClick = () => {
    scrollNextFn(ref?.current, "left");
  };
  const rightClick = () => {
    scrollNextFn(ref?.current, "right");
  };
  const leftLongPress = () => {
    scrollFn(ref?.current, "left");
  };
  const rightLongPress = () => {
    scrollFn(ref?.current, "right");
  };

  // const isScroll = useMemo(() => {}, [data]);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }
    setIsScroll(
      element.scrollHeight > element.clientHeight ||
        element.scrollWidth > element.clientWidth
    );
  }, [data]);

  return (
    <div className={`flex row items-center`}>
      {isScroll && (
        <ArrowBtn
          position={"left"}
          onClick={leftClick}
          onLongPress={leftLongPress}
        ></ArrowBtn>
      )}
      <div
        ref={ref}
        className={`flex row mr-[16px] ${Style.carousel} ${className} ${
          !isScroll ? "justify-center" : ""
        }`}
      >
        {data.length > 0 &&
          data?.map((item, index) => (
            <RedPacket key={index} data={item}></RedPacket>
          ))}
      </div>
      {isScroll && (
        <ArrowBtn
          position={"right"}
          onClick={rightClick}
          onLongPress={rightLongPress}
        ></ArrowBtn>
      )}
    </div>
  );
});

export default Carousel;
