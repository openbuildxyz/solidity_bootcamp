import "../styles/globals.css"; // 导入全局样式
import "@rainbow-me/rainbowkit/styles.css";
import Layout from "../components/Layout";
import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { collectChains } from "@/contants/chains";
import { GlobalStore } from "@/store/global.store";
import { Provider } from "reto";
import { NextUIProvider } from "@nextui-org/react";

const { chains, publicClient } = configureChains(collectChains, [
  publicProvider(),
]);

const { connectors } = getDefaultWallets({
  appName: "RED-POCKET",
  projectId: "1434fcd28b4ae93f54487f7756c9641d",
  chains,
});


const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});
function MyApp({ Component, pageProps }) {
  // if(!!window){
  //   window.fff =wagmiConfig;
  // }
  return (
    <NextUIProvider>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider
          chains={chains}
          theme={darkTheme({
            accentColor: "#7b3fe4",
            accentColorForeground: "white",
            borderRadius: "medium",
          })}
        >
          <Provider of={GlobalStore}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </Provider>
        </RainbowKitProvider>
      </WagmiConfig>
    </NextUIProvider>
  );
}

export default MyApp;
