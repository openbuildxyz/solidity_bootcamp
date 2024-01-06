// 红包状态
export type statusType = "Completed" | "In_Progress" | "Not_Participated";

export type RedPacketType = {
  id: number; // id
  startTime: number; // 发起红包时间
  amount: number; // 单个红包金额
  collectType: string; // 红包类型
  lock: boolean; // 红包锁
  currentTimes: number; // 当前次数
  times: number; // 当前次数
  limit: number; // 限制人数
  users: string[]; // 当前参加的人数
  creator: string; // 发起人
  currentUser: string; // 当前需要发红包的人
  exist: boolean; // 是否存在
  requestId: number; // 随机数映射id，方便vrf回调
};

export type UserType = {
};

export type ClassProps = {
  className?: string;
};
