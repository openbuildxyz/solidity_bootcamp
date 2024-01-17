'use client'
import { Button,Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { FC, useMemo, useState } from "react";
import { useAccount } from "wagmi";

type WbtnProps = {
    btnContent: string;
    commentArr: any;
    id?:string;
  };
  
export const Wbtn: FC<WbtnProps> = ({ btnContent,commentArr,id }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { address,isConnected } = useAccount();
    const [ value, setValue ] = useState("");
    const validateEmpty = (value) => value?.length > 0
  
    const isInvalid = useMemo(() => {
      if (value === "") return false;
      return validateEmpty(value) ? false : true
    }, [value]);
  
    return (
      <>
        <Button fullWidth variant="bordered" size="lg" onPress={onOpen}>
          {btnContent}
        </Button>
        {isConnected ? (
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="top-center"
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader>Add Your Comment</ModalHeader>
                  <ModalBody>
                    <Input
                      autoFocus
                      label="please share your thoughts"
                      required
                      errorMessage={isInvalid && "Your couldn't sumbit empty context"}
                      isClearable
                      isInvalid={isInvalid}
                      onValueChange={setValue}
                      value={value}
                    ></Input>
                  </ModalBody>
                  <ModalFooter>
                    <Button onPress={onClose}>Close</Button>
                    {/* todo 链上操作 */}
                    <Button onPress={() => {
                      if(isInvalid && value !== '') {
                       commentArr.push({address:value})
                      }
                   
                      onClose()
                      }}>Add</Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        ) : (
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="top-center"
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader>Please Connect your Wallet</ModalHeader>
                  <ModalBody>
                    <p className="text-gray-500">
                      click the right-top corner button to connect your wallet
                    </p>
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
        )}
      </>
    );
};