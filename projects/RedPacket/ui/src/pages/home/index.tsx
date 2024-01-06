import { useAccount, useConnect, useNetwork } from "wagmi";
import { useGetDeposit } from "@/server/redPacketServer";
import Banner from "./components/Banner";
import RedPacketList from "./components/RedPacketList";

export default function Home() {
  const aaa = useAccount({
    onConnect: () => {
      console.log("onConnectonConnectonConnect");
    },
  });
  const bbb = useConnect();
  const ccc = useNetwork();
  const ddd = useGetDeposit();
  // console.log(aaa, bbb, ccc);
  // console.log(ddd);
  return (
    <div className="flex flex-col">
      <Banner className="mb-4"></Banner>
      <RedPacketList></RedPacketList>
    </div>
  );
}
