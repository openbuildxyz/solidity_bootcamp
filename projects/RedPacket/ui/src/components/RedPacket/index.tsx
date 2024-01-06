import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Chip,
  Tooltip,
} from "@nextui-org/react";
import "./style.module.scss";
import { RedPacketType, statusType } from "@/types/intex";
import { useAccount } from "wagmi";
import { useAttendPacket, useGetDeposit } from "@/server/redPacketServer";
import { getPacketType, truncateString } from "@/utils/indes";
import { useMemo } from "react";
import { ethers } from "ethers";
import { useStore } from "reto";
import { GlobalStore } from "@/store/global.store";
import { PACKET_STATUS } from "@/contants/packetStatus";
type RedPacketProps = {
  data: RedPacketType;
};

const Config = {
  [PACKET_STATUS.Completed]: { ballColor: "bg-[#FFE0B3]", text: "已完成" },
  [PACKET_STATUS.In_Progress]: { ballColor: "bg-[#25FE15]", text: "进行中" },
  [PACKET_STATUS.Not_Participated]: {
    ballColor: "bg-[#2CA6FF]",
    text: "未开始",
  },
};

const StateComponents = ({
  status,
  isIn,
}: {
  status: statusType;
  isIn: boolean;
}) => {
  const publicClass = {
    Background: "p-1 px-2  bg-zinc-100/40 rounded-full flex flex-row",
    Text: "text-[#FFE0B3]",
  };

  const conf = Config[status];

  return (
    <Chip
      variant="dot"
      className={publicClass.Text}
      classNames={{
        base:
          publicClass.Background +
          "bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30",
        content: "drop-shadow shadow-black text-white",
        dot: conf.ballColor,
      }}
    >
      {conf.text}
      {isIn && "(已参与)"}
    </Chip>
  );
};

const ContextComponent = ({
  status,
  data,
}: {
  status: statusType;
  data: RedPacketType;
}) => {
  const [deposit] = useGetDeposit();
  const { write } = useAttendPacket();
  const onClick = (onClose: () => void) => {
    if (deposit < data?.amount * 10) {
      alert("押金不够，请充值后再操作！");
      return;
    }
    // ethers.to
    write({
      args: [ethers.toBigInt(data?.id)],
    });
    onClose();
  };
  return (
    <>
      {status === PACKET_STATUS.Not_Participated && (
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>您未参与这个红包活动</ModalHeader>
              <ModalBody>
                <p>点击"参与活动"按钮，即可参与新一轮抢红包活动🎉！</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  取消
                </Button>
                <Button
                  className="bg-[#FE3F21] text-white"
                  onPress={() => onClick(onClose)}
                >
                  参与活动
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      )}
      {status !== PACKET_STATUS.Not_Participated && (
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>红包详情</ModalHeader>
              <ModalBody>
                <p>
                  创建时间:{" "}
                  {data?.startTime
                    ? new Date(data?.startTime).toLocaleString()
                    : "Not Data"}
                </p>
                <p>红包金额: {ethers.formatUnits(data.amount, 18) ?? 0}</p>
                <p>代币类型：{data?.collectType ?? ""}</p>
                <p>发起人： {data?.creator ?? "none"}</p>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      )}
    </>
  );
};

const MessageContent = ({
  status,
  data,
}: {
  status: statusType;
  data: RedPacketType;
}) => {
  
  const amount = ethers.formatUnits(data.amount, 18);
  return (
    <>
      {status === PACKET_STATUS.Not_Participated && (
        <>
          <Tooltip
            onClick={(e) => {
              e.stopPropagation();
            }}
            content={`${amount}link`}
          >
            <p className="my-2 text-[#FFE0B3] text-lg font-bold">
              单个红包金额 : {truncateString(amount)}
            </p>
          </Tooltip>
          <p className="my-2 text-[#FFE0B3] text-lg font-bold">
            参与人数 : {data.users.length}/{data.limit}
          </p>
          <p className="my-2 text-[#FFE0B3] text-lg font-bold">
            红包次数 : {data.times}
          </p>
        </>
      )}
      {status === PACKET_STATUS.In_Progress && (
        <>
          <p className="my-2 text-[#FFE0B3] text-lg font-bold">
            单个红包金额 :  {truncateString(amount)}
          </p>
          <p className="my-2 text-[#FFE0B3] text-lg font-bold">
            参与人数 : {data.users.length}/{data.limit}
          </p>
          <p className="my-2 text-[#FFE0B3] text-lg font-bold">
            当前红包轮次 : {data.currentTimes}
          </p>
        </>
      )}
      {status === PACKET_STATUS.Completed && (
        <>
          <p className="my-2 text-[#FFE0B3] text-lg font-bold">
            单个红包金额 :  {truncateString(amount)}
          </p>
          <p className="my-2 text-[#FFE0B3] text-lg font-bold">
            参与人数 : {data.users.length}/{data.limit}
          </p>
          <p className="my-2 text-[#FFE0B3] text-lg font-bold">
            红包次数 : {data.times}
          </p>
        </>
      )}
    </>
  );
};

function RedPacket({ data }: RedPacketProps) {
  const { isConnected } = useStore(GlobalStore);
  const status = getPacketType(data);
  const [deposit] = useGetDeposit();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { address: currentAddress } = useAccount();
  const isIn = useMemo(() => {
    return data.users.includes(currentAddress as string);
  }, [currentAddress, data.users.length]);

  const onClick = () => {
    if (isIn) {
      alert("你已经参加了");
      return;
    }
    if (deposit < data.amount * 10) {
      alert("押金不足");
      return;
    }
    if (!isConnected) {
      alert("请先登录钱包！");
      return;
    }
    onOpen();
  };
  return (
    <>
      <div
        className="flex h-[490px] w-[330px] rounded-[60px]  bg-cover bg-center transition-all hover:scale-105 justify-center"
        style={{ backgroundImage: "url(/img/packet-bgd.png)" }}
        // onClick={() => {
        //   onOpen();
        // }}
      >
        <Button
          className="h-full w-[200px] flex flex-col justify-start pt-18 bg-transparent items-start px-0 pb-44"
          disableRipple
          disableAnimation
          onClick={onClick}
        >
          <StateComponents isIn={isIn} status={status} />
          <div className="w-full flex flex-col flex-1 justify-center items-center">
            <MessageContent status={status} data={data}></MessageContent>
          </div>
        </Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ContextComponent status={status} data={data} />
        </Modal>
      </div>
    </>
  );
}

export default RedPacket;
