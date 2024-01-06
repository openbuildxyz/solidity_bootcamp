import { useAccount } from "wagmi";

export const GlobalStore = () => {
  const { isConnected } = useAccount();
  return { isConnected };
};
