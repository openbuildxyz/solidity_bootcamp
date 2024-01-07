import { createRoot } from 'react-dom/client'
import 'tailwindcss/tailwind.css'
import { ThirdwebProvider, metamaskWallet } from '@thirdweb-dev/react'
import { RouterProvider } from 'react-router-dom'
import router from 'routers'

const container = document.getElementById('root') as HTMLDivElement
const root = createRoot(container)

root.render(
  <ThirdwebProvider
    supportedWallets={[metamaskWallet()]}
    activeChain={{
      chainId: 11155111,
      rpc: ["https://ethereum-sepolia.blockpi.network/v1/rpc/public"],
      //"https://eth-sepolia-public.unifra.io"
      nativeCurrency: {
        decimals: 18,
        name: "ETH",
        symbol: "ETH",
      },
      shortName: "sepolia", // Display value shown in the wallet UI
      slug: "sepolia", // Display value shown in the wallet UI
      testnet: true, // Boolean indicating whether the chain is a testnet or mainnet
      chain: "sepolia", // Name of the network
      name: "Sepolia Testnet", // Name of the network
    }}
    clientId="111f3fefbac2fef11f27979f6c078bf8"
  >
    <RouterProvider router={router} />
  </ThirdwebProvider>
)
