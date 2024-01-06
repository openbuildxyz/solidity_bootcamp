import Carousel from "@/components/Carousel";
import { PACKET_STATUS, PACKET_STATUS_STR } from "@/contants/packetStatus";
import { useGetPackets, useGetUser } from "@/server/redPacketServer";
import { RedPacketType } from "@/types/intex";
import { useNotLogin } from "@/utils/hooks/useNotLogin";
import { getPacketType } from "@/utils/indes";
import { Divider } from "@nextui-org/react";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";

type PersonalProps = {};

const useData = () => {
  const [user] = useGetUser();
  const [packets] = useGetPackets({ packetIds: user?.packetIds });
  const notParticipatedPackets = useMemo(() => {
    return packets?.filter((packet: RedPacketType) => {
      const status = getPacketType(packet);
      return status === PACKET_STATUS.Not_Participated;
    });
  }, [packets]);
  const inProgressPackets = useMemo(() => {
    return packets?.filter((packet: RedPacketType) => {
      const status = getPacketType(packet);
      return status === PACKET_STATUS.In_Progress;
    });
  }, [packets]);
  const completedPackets = useMemo(() => {
    return packets?.filter((packet: RedPacketType) => {
      const status = getPacketType(packet);
      return status === PACKET_STATUS.Completed;
    });
  }, [packets]);
  return { notParticipatedPackets, inProgressPackets, completedPackets };
};

const Personal = React.memo((props: PersonalProps) => {
  const { notParticipatedPackets, inProgressPackets, completedPackets } =
    useData();

  useNotLogin();
  return (
    <div key={"person"}>
      <div className="mx-16">
        <div className="text-white text-2xl">
          {PACKET_STATUS_STR.Not_Participated}
        </div>
        <Divider className="h-1 bg-white mt-4"></Divider>
        <div>
          <Carousel data={notParticipatedPackets}></Carousel>
        </div>
      </div>
      <div className="mx-16">
        <div className="text-white text-2xl">
          {PACKET_STATUS_STR.In_Progress}
        </div>
        <Divider className="h-1 bg-white mt-4"></Divider>
        <div>
          <Carousel data={inProgressPackets}></Carousel>
        </div>
      </div>
      <div className="mx-16">
        <div className="text-white text-2xl">{PACKET_STATUS_STR.Completed}</div>
        <Divider className="h-1 bg-white mt-4"></Divider>
        <div>
          <Carousel data={completedPackets}></Carousel>
        </div>
      </div>
    </div>
  );
});

export default Personal;
