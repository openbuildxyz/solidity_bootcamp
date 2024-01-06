import { statusType } from "@/types/intex";

export const PACKET_STATUS = {
  Completed: "Completed",
  In_Progress: "In_Progress",
  Not_Participated: "Not_Participated",
} as Record<statusType, statusType>;
export const PACKET_STATUS_STR = {
  [PACKET_STATUS.Completed]: "已完成",
  [PACKET_STATUS.In_Progress]: "进行中",
  [PACKET_STATUS.Not_Participated]: "未开始",
} as Record<statusType, statusType>;
