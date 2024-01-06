import { useLinkApproveEvent } from "@/server/linkServer";
import { useAddDeposit } from "@/server/redPacketServer";
import { useLocalStorage } from "@/utils/indes";
import { ethers } from "ethers";
import { useEffect } from "react";
import { useTransaction } from "wagmi";

// 添加押金相关逻辑
// 目前添加押金保证页面刷新进程依旧存在
export const AddDepositModalStore = () => {
  const [value, setValue] = useLocalStorage("add-deposit-value", 0);
  const [step, setStep] = useLocalStorage("add-deposit-step", "approval");
  const [depositLoading, setDepositLoading] = useLocalStorage(
    "add-deposit-loading",
    true
  );
  const [approvalTx, setApprovalTx] = useLocalStorage("add-deposit-tx", null);
  const { isLoading } = useTransaction({
    hash: approvalTx,
  });

  useEffect(() => {
    if (approvalTx && !isLoading) {
      setApprovalTx(null);
      setDepositLoading(false);
    }
  }, [approvalTx, isLoading]);

  const { write } = useAddDeposit();

  useLinkApproveEvent({
    eventName: "Approval",
    listener: () => {},
  });
  const onAddDeposit = () => {
    write({
      args: [ethers.parseUnits(value.toString(),18)],
    });
  };
  return {
    value,
    setValue,
    onAddDeposit,
    approvalTx,
    setApprovalTx,
    depositLoading,
    setDepositLoading,
    step,
    setStep,
  };
};
