"use client";

import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { Input } from "@nextui-org/input";
import { useState } from "react";
import { useAccount } from "wagmi";

export default function Page() {
  const [value, setValue] = useState(0);
  const { isConnected } = useAccount();

  return (
    <div className="bg-gray-100 h-full  rounded grid  gap-10">
      <div className="flex flex-col items-center justify-center text-3xl gap-10">
        <p className="font-bold">Support</p>
        <Input
          radius="lg"
          variant="underlined"
          isRequired
          className="w-10 h-30 text-2xl text-center"
          value={value.toString()}
          onValueChange={setValue}
        >
        </Input>
        <div>
          {isConnected ? (
            <Button type="submit"> Donates</Button>
          ) : (
            "Click right-top cornet to connect"
          )}
        </div>
      </div>
      <Divider />
      <div className="flex flex-col items-center justify-center">
        <p className="font-bold text-xl">Rule</p>
        <ul>
          <li>
            The donates will be use to maintian the website,all detial are
            on-chain.
          </li>
          <li>We want to build a transparent and useful environment.</li>
        </ul>
      </div>
    </div>
  );
}
