import Carousel from "@/components/Carousel";
import CreatePacketModal from "@/components/Modal/CreatePacketModal";
import RedPacket from "@/components/RedPacket";
import { useAttendPacket, useGetAllPacket } from "@/server/redPacketServer";
import { RedPacketType } from "@/types/intex";
import { Button } from "@nextui-org/react";

const RedPacketList = () => {
  const [data] = useGetAllPacket() as [RedPacketType[]];
  return (
    <div>
      <div className="mr-16 flex flex-row-reverse">
        {/* <Button className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg" onClick={onCreatePacket}>
          创建红包
        </Button> */}
        <CreatePacketModal></CreatePacketModal>
      </div>
      <div className="flex row justify-center">
        <Carousel data={data}></Carousel>
      </div>
    </div>
  );
};
export default RedPacketList;
