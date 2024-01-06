import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAccount } from "wagmi";

export const useNotLogin = () => {
  const { isConnected } = useAccount();
  const router = useRouter();
  const jumpUrl = (to: string) => {
    router.push(to);
  };
  useEffect(() => {
    if (!isConnected) {
      jumpUrl("/home");
    }
  }, [isConnected]);
};
