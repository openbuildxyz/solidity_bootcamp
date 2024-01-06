import { PACKET_STATUS } from "@/contants/packetStatus";
import { RedPacketType, statusType } from "@/types/intex";
import { useCallback, useState, useEffect } from "react";

// 处理通过合约获取的数据的值
export const dealConstractData = (data: any): any => {
  if (typeof data === "bigint") {
    return data.toString();
  } else if (data instanceof Array) {
    return data?.map((item: any) => dealConstractData(item));
  } else if (data instanceof Object) {
    const keys = Object.keys(data);
    const newData = {} as any;
    keys.map((key: string) => {
      newData[key] = dealConstractData(data[key]);
    });
    return newData;
  } else {
    return data;
  }
};

// 设置storage
export const setStorage = (key: string, data: any) => {
  // 将对象数据转换为JSON字符串
  const jsonString = JSON.stringify(data);

  // 使用localStorage保存JSON字符串
  localStorage.setItem(key, jsonString);
};

// 获取storage
export const getStorage = (key: string) => {
  // 从localStorage中检索数据并将其解析为对象
  const storedData = localStorage.getItem(key);
  if (storedData) {
    const parsedData = JSON.parse(storedData);
    return parsedData;
  } else {
    console.log("没有找到存储的数据");
  }
};

export function useLocalStorage(key: string, defaultValue: any) {
  if (typeof window === "undefined") {
    return [];
  }
  return useStorage(key, defaultValue, window?.localStorage ?? {});
}

export function useSessionStorage(key: string, defaultValue: any) {
  if (typeof window === "undefined") {
    return [];
  }
  return useStorage(key, defaultValue, window?.sessionStorage ?? {});
}

function useStorage(key: string, defaultValue: any, storageObject: Storage) {
  const [value, setValue] = useState(() => {
    const jsonValue = storageObject?.getItem(key);
    if (jsonValue != null) return JSON.parse(jsonValue);

    if (typeof defaultValue === "function") {
      return defaultValue();
    } else {
      return defaultValue;
    }
  });

  useEffect(() => {
    if (value === undefined) return storageObject?.removeItem(key);
    storageObject?.setItem(key, JSON.stringify(value));
  }, [key, value, storageObject]);

  const remove = useCallback(() => {
    setValue(undefined);
  }, []);

  return [value, setValue, remove];
}

export const getPacketType: (packet: RedPacketType) => statusType = (
  packet: RedPacketType
) => {
  // 未参加的红包
  if (packet.users.length !== packet.limit) {
    return PACKET_STATUS.Not_Participated;
  }

  // 正在红包中
  if (packet.currentTimes > 0 && packet.currentTimes < packet.limit) {
    return PACKET_STATUS.In_Progress;
  }

  // 正在红包中
  if (packet.currentTimes === packet.limit) {
    return PACKET_STATUS.Completed;
  }

  return PACKET_STATUS.Not_Participated;
};

export function truncateString(str: string, maxLength: number = 6) {
  if (str.length <= maxLength) {
    return str; // 字符串长度小于等于 maxLength，无需截断
  }

  const head = str.slice(0, maxLength / 2);
  const tail = str.slice(-maxLength / 2);

  return head + "..." + tail;
}
