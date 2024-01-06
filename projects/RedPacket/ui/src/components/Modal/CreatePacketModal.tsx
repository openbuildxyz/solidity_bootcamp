import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import {
  RED_PACKET_ADDRESS,
  useAttendPacket,
  useCreatePacket,
  useGetDeposit,
} from "@/server/redPacketServer";
import { ethers } from "ethers";
import { useLinkApprove } from "@/server/linkServer";
import { Provider, useStore } from "reto";
import { AddDepositModalStore } from "@/store/addDepositModal.store";
import VaildInput from "../ValidInput";
import { useValue } from "@/utils/hooks/useValue";
import { moneyVaildate } from "@/utils/vaildate";
import { ClassProps } from "@/types/intex";

type CreatePacketModalProps = {} & ClassProps;

const CreatePacketModal = ({ className }: CreatePacketModalProps) => {
  const [value, setValue] = useValue({
    limit: "5",
    times: "5",
    amount: 0,
  });
  const countRef = useRef();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [currentDeposit] = useGetDeposit();

  const depost = ethers?.formatUnits(currentDeposit?.toString()??0, 18);
  const max = depost / 10;
  const { write } = useCreatePacket({ listener: () => {} });

  const onClick = () => {
    write({
      args: [
        ethers.parseUnits(value?.amount.toString(),18),
        "LINK",
        ethers.toBigInt(value?.limit),
        ethers.toBigInt(value?.times),
      ],
    });
    onOpen();
  };
  return (
    <>
      <Button
        className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
        onClick={onOpen}
      >
        创建红包
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                创建红包
              </ModalHeader>
              <ModalBody className="flex flex-col">
                <div className="text-sm text-gray-500 mb-4">
                  当前押金:{depost}
                </div>
                <VaildInput
                  ref={countRef}
                  type="number"
                  label="单个红包金额"
                  min={0.1}
                  size="lg"
                  placeholder="0.1"
                  max={max}
                  description={`单个红包金额最高位为${max}`}
                  labelPlacement="outside"
                  value={value?.amount}
                  onChange={(e) => {
                    setValue({
                      amount:
                        e.target.value > max ? max : Number(e.target.value),
                    });
                  }}
                  validate={moneyVaildate}
                ></VaildInput>
                <Select
                  selectionMode={"single"}
                  label="人数限制"
                  placeholder="请选择"
                  className="max-w-xs"
                  labelPlacement="outside"
                  selectedKeys={[value?.limit]}
                  onChange={(e) => {
                    setValue({
                      limit: e.target.value,
                    });
                  }}
                >
                  {["5"].map((num) => (
                    <SelectItem key={num} value={num}>
                      {num}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  selectionMode={"single"}
                  label="红包轮数"
                  placeholder="请选择"
                  className="max-w-xs"
                  labelPlacement="outside"
                  selectedKeys={[value?.times]}
                  onChange={(e) => {
                    setValue({
                      times: e.target.value,
                    });
                  }}
                >
                  {["5"].map((num) => (
                    <SelectItem key={num} value={num}>
                      {num}
                    </SelectItem>
                  ))}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  取消
                </Button>
                <Button onPress={onClick}>确认</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePacketModal;
