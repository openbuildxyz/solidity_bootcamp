"use client";

import { BaseError } from "viem";
import { useAccount, useConfig, useConnect, useDisconnect } from "wagmi";
import { useEffect, useRef } from "react";
import { createModal } from "@rabby-wallet/rabbykit";
import { supportChains } from "../wagmi";

export function Connect() {
  const { connector, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();

  const rabbyKitRef = useRef<ReturnType<typeof createModal>>();
  const config = useConfig();

  useEffect(() => {
    if (!rabbyKitRef.current) {
      rabbyKitRef.current = createModal({
        showWalletConnect: true,
        chains: supportChains,
        wagmi: config,
        appName: "test",
        projectId: "dcae4666e7b86fbc09aa7db6d0620c93",
        customButtons: [],
      });
    }
  }, [config]);

  return (
    <div>
      <div>
        {isConnected && (
          <button onClick={() => disconnect()}>
            Disconnect from {connector?.name}
          </button>
        )}

        <br />

        <button
          onClick={() => {
            rabbyKitRef.current?.setTheme("light");
            rabbyKitRef.current?.open();
          }}
        >
          light mode
        </button>

        <br />

        <button
          onClick={() => {
            rabbyKitRef.current?.setTheme("dark");
            rabbyKitRef.current?.open();
          }}
        >
          dark mode
        </button>
        <br />

        {!isConnected && (
          <button onClick={() => rabbyKitRef.current?.open()}>
            open RabbyKit
          </button>
        )}
        <br />


      </div>

      {error && <div>{(error as BaseError).shortMessage}</div>}
    </div>
  );
}
