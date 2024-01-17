import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useEnterVoteEvent, useGetBaseFee, useVote } from "@/server/findwalletServer";
import { formatEther, parseEther } from "viem";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
type OpinionBtnProps = {
  opinion: 0 | 1;
  onClck?: () => {};
  className?: string;
  disable: boolean;
  walletId: string;
};

export default function OpinionBtn({
  className,
  opinion,
  disable,
  walletId,
}: OpinionBtnProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [baseFee, setBaseFee] = useState<string>("");

  // contract interaction
  const { write } = useVote();
  const { data } = useGetBaseFee();
  useEffect(() => {
    if(data) {
      setBaseFee(formatEther(data));
    }
  }, [data]);
  const Vote = (id: number, isSupporting: 0 | 1, fee: string) => {
    write({ args: [id, isSupporting], value: parseEther(fee) });
  };
  const router = useRouter()
  useEnterVoteEvent()
  //  onclick action
  const onClick = (onClose: () => void) => {
    console.log("click!");
    Vote(parseInt(walletId), opinion, baseFee);
    onClose();
  };

  return (
    <>
      <Button
        className={className}
        isDisabled={disable}
        onPress={onOpen}
        variant="bordered"
        radius="full"
      >
        {opinion === 0 ? "👎" : "👍"}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Tips!</ModalHeader>
              <ModalBody>{`Spend ${parseFloat(baseFee).toFixed(18)} ETH to ${
                opinion === 0 ? "👎" : "👍"
              }.`}</ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>no</Button>
                <Button
                  color="danger"
                  onPress={() => {
                    onClick(onClose);
                  }}
                >
                  yes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
