import { useGetDeposit } from "@/server/redPacketServer";
import { Button, Chip } from "@nextui-org/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import AddDepositModal from "./Modal/AddDepositModal";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import { ethers } from "ethers";

function Layout({ children }) {
  const { isConnected } = useAccount();
  const [data] = useGetDeposit();
  const router = useRouter();
  const jumpUrl = (to: string) => {
    router.push(to);
  };
  const deposit = ethers.formatUnits(data??'0', 18);
  if (typeof window !== "undefined") {
    window.eee = ethers;
    window.ddd = data;
  }
  return (
    <div className="dark">
      <header className="flex justify-between mx-8 mb-4 px-8 py-12">
        <h1
          className="text-4xl text-white text-center font-semibold cursor-pointer"
          onClick={() => jumpUrl("/home")}
        >
          RED-PAKECT
        </h1>

        {/* 放置全局头部内容 */}
        <div className="flex text-white items-center">
          <Chip className="mr-4">当前押金：{deposit}</Chip>
          <AddDepositModal className="mr-4"></AddDepositModal>
          <Button
            // isDisabled={isConnected}
            className="mr-4"
            onPress={() => {
              if (!isConnected) {
                alert("未登录钱包！");
              }
              jumpUrl("/personal");
            }}
          >
            个人中心
          </Button>
          <ConnectButton showBalance></ConnectButton>
        </div>
      </header>
      <main>{children}</main>
      <footer>{/* 放置全局底部内容 */}</footer>
    </div>
  );
}

export default Layout;
