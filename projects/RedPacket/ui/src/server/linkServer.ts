import {
  erc20ABI,
  useContractEvent,
  useContractWrite as useContractWrite_wagmi,
} from "wagmi";

const LINK_ADDRESS = "0x779877A7B0D9E8603169DdbD7836e478b4624789";

// 监听事件
export const useLinkApproveEvent = (params: any = {}) => {
  return useContractEvent({
    address: LINK_ADDRESS,
    abi: erc20ABI,
    ...params,
  });
};

export const useLinkApprove = (params: any = {}) => {
  return useContractWrite_wagmi({
    address: LINK_ADDRESS,
    abi: erc20ABI,
    functionName: "approve",
    ...params,
  });
};
