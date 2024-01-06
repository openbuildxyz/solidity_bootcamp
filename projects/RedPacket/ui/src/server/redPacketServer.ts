import { redPacketAbi } from "@/abi/redPacketAbi";
import { dealConstractData } from "@/utils/indes";
import { parseUnits } from "ethers";
import { useState } from "react";
import {
  useContractEvent,
  useContractRead as useContractRead_wagmi,
  useContractWrite as useContractWrite_wagmi,
  useWalletClient,
} from "wagmi";

// export const RED_PACKET_ADDRESS = "0xa3ae85342e3836A2d5852F45CFCfACA0C7F6E91A";
// export const RED_PACKET_ADDRESS = "0x55b6E44254c82Ee44AfE66fa00c7f7Cc9da32Cd8";
// export const RED_PACKET_ADDRESS = "0xBbD0091D48f55287604FC6A5e141878068C6c73a";
// export const RED_PACKET_ADDRESS = "0xB55476D3489B593EB9BB02E8D18c64e46b349461";
export const RED_PACKET_ADDRESS = "0x1De216DC32636bf3C2317CebbcDc423297E503b4";

// const ConversionMethod = {
//     'Number':Number,
//     // "RedPacket":RedPacketType()
// }

// read公共方法
export const useContractRead = ({ ...params }) => {
  const [data, setData] = useState<any>();

  useContractRead_wagmi({
    ...params,
    onSuccess(data) {
      setData(dealConstractData(data));
    },
  });
  return [data];
};

// export const useGetBalance = () => {
//   const { data: walletClient } = useWalletClient();
//   return useContractRead({
//     address: RED_PACKET_ADDRESS,
//     abi: redPacketAbi,
//     functionName: "getBalance",
//     args: [],
//     account: walletClient?.account,
//   });
// };

// 获取当前用户押金
export const useGetDeposit = () => {
  const { data: walletClient } = useWalletClient();
  return useContractRead({
    address: RED_PACKET_ADDRESS,
    abi: redPacketAbi,
    functionName: "getDeposit",
    args: [],
    account: walletClient?.account,
    scopeKey: "getDeposit",
    watch: true,
  });
};
// 获取当前用户押金
export const useGetAllPacket = () => {
  const { data: walletClient } = useWalletClient();
  return useContractRead({
    address: RED_PACKET_ADDRESS,
    abi: redPacketAbi,
    functionName: "getAllPackets",
    args: [],
    account: walletClient?.account,
    scopeKey: "getAllPackets",
    watch: true,
  });
};

// 获取当前用户信息
export const useGetUser = () => {
  const { data: walletClient } = useWalletClient();
  return useContractRead({
    address: RED_PACKET_ADDRESS,
    abi: redPacketAbi,
    functionName: "getUser",
    args: [],
    account: walletClient?.account,
    scopeKey: "getUser",
    watch: true,
  });
};
// 获取指定红包信息
export const useGetPacket = () => {
  const { data: walletClient } = useWalletClient();
  return useContractRead({
    address: RED_PACKET_ADDRESS,
    abi: redPacketAbi,
    functionName: "getPacket",
    args: [],
    account: walletClient?.account,
  });
};

// 获取所有红包信息
export const useGetPackets = ({ packetIds = [] }: { packetIds: string[] }) => {
  return useContractRead({
    address: RED_PACKET_ADDRESS,
    abi: redPacketAbi,
    functionName: "getPackets",
    args: [packetIds],
  });
};

// 添加押金
export const useAddDeposit = () => {
  return useContractWrite_wagmi({
    address: RED_PACKET_ADDRESS,
    abi: redPacketAbi,
    functionName: "addDeposit",
  });
};

// 参加红包
export const useAttendPacket = (params: any = {}) => {
  const data = useContractWrite_wagmi({
    address: RED_PACKET_ADDRESS,
    abi: redPacketAbi,
    functionName: "attendPacket",
    ...params,
  });
  return { ...data };
};
// 创建红包
export const useCreatePacket = ({ listener }) => {
  useContractEvent({
    address: RED_PACKET_ADDRESS,
    abi: redPacketAbi,
    eventName: "",
    listener,
    // ...params,
  });
  return useContractWrite_wagmi({
    address: RED_PACKET_ADDRESS,
    abi: redPacketAbi,
    functionName: "createPacket",
  });
};
// 提取小钱钱
export const useWithdrawContractBalance = () => {
  return useContractWrite_wagmi({
    address: RED_PACKET_ADDRESS,
    abi: redPacketAbi,
    functionName: "withdrawContractBalance",
  });
};
