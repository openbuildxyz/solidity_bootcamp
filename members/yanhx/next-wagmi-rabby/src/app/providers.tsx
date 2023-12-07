"use client";

import * as React from "react";
import { WagmiConfig } from "wagmi";
// import { createModal } from "@rabby-wallet/rabbykit";

import { config } from "../wagmi";

// export let rabbyKit = () => {
//   let kit: ReturnType<typeof createModal> | undefined;

//   return (p: Parameters<typeof createModal>) => {
//     if (!kit) {
//       kit = createModal(...p);
//     }
//     return kit;
//   };
// };

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
    // createModal({
    //   wagmi: config,
    //   appName: "test",
    //   projectId: "dcae4666e7b86fbc09aa7db6d0620c93",
    // });
  }, []);
  return <WagmiConfig config={config}>{mounted && children}</WagmiConfig>;
}
