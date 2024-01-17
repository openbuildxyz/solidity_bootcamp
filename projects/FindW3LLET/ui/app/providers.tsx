"use client";

import '../styles/globals.css';
import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

// import rainbow kit
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { sepolia } from "wagmi/chains";

import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from 'wagmi/providers/alchemy';

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

const { chains, publicClient } = configureChains([sepolia], [alchemyProvider({ apiKey: process.env.ALCHEMY_ID || 'ito0xmpYWbgFruvUaljRK6-2SgcT4eWl' }),publicProvider()]);
const { connectors } = getDefaultWallets({
  appName: "FindWallet",
  projectId: "1",
  chains,
});
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider
          chains={chains}
          theme={
            lightTheme()
          }
        >
          <NextThemesProvider {...themeProps} attribute="class" defaultTheme="light">{children}</NextThemesProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </NextUIProvider>
  );
}
