import React, { useEffect, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { RED_PACKET_ADDRESS } from "@/server/redPacketServer";
import { ethers } from "ethers";
import { useLinkApprove } from "@/server/linkServer";
import { Provider, useStore } from "reto";
import { AddDepositModalStore } from "@/store/addDepositModal.store";
import VaildInput from "../ValidInput";
import { ClassProps } from "@/types/intex";

type AddDepositModalProps = {} & ClassProps;

// 授权相关逻辑
const useOk = ({ value, ref }) => {
  const { setApprovalTx, setDepositLoading, setStep } =
    useStore(AddDepositModalStore);
  const { write: writeApprove, data } = useLinkApprove({
    onError: () => {
      setDepositLoading(false);
      setStep("approval");
    },
  });

  const onOk = () => {
    if (!ref?.current?.validate()) {
      return;
    }
    writeApprove({
      args: [RED_PACKET_ADDRESS, ethers.parseUnits(value.toString(),18)],
    });
  };

  useEffect(() => {
    setApprovalTx(data?.hash);
  }, [data?.hash]);

  return { onOk };
};

const InnerAddDepositModal = ({ className }: AddDepositModalProps) => {
  const {
    value,
    setValue,
    onAddDeposit,
    depositLoading,
    setDepositLoading,
    step,
    setStep,
  } = useStore(AddDepositModalStore);
  const ref = useRef<any>();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { onOk } = useOk({ value, ref });

  const onChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <>
      <Button
        className={`bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full hover:from-blue-600 hover:to-purple-600 hover:text-white  ${className}`}
        onClick={onOpen}
      >
        添加押金
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              {step === "approval" && (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    授权
                  </ModalHeader>
                  <ModalBody className="flex flex-col">
                    <VaildInput
                      ref={ref}
                      type="number"
                      label="押金"
                      min={0}
                      size="lg"
                      placeholder="0.00"
                      labelPlacement="outside"
                      value={value}
                      onChange={onChange}
                      validate={(val) => {
                        if (val > 0) {
                          return true;
                        } else {
                          return "金额不可为0";
                        }
                      }}
                    ></VaildInput>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      取消
                    </Button>
                    <Button
                      onPress={() => {
                        if (!ref?.current.validate()) {
                          return;
                        }
                        setStep("deposit");
                        setDepositLoading(true);
                        onOk();
                      }}
                    >
                      下一步
                    </Button>
                  </ModalFooter>
                </>
              )}
              {step === "deposit" && (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    添加押金
                  </ModalHeader>
                  <ModalBody className="flex flex-col">
                    转入金额: ({value})
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      isLoading={depositLoading}
                      onPress={() => {
                        onAddDeposit();
                        setStep("approval");
                        onClose();
                        // message
                      }}
                    >
                      确认
                    </Button>
                  </ModalFooter>
                </>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
const AddDepositModal = (props: AddDepositModalProps) => {
  return (
    <Provider of={AddDepositModalStore}>
      <InnerAddDepositModal {...props}></InnerAddDepositModal>
    </Provider>
  );
};

export default AddDepositModal;
