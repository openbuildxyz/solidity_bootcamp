require("@nomicfoundation/hardhat-toolbox");
let dotenv = require('dotenv')
dotenv.config({ path: "./.env" }) 

const { ProxyAgent, setGlobalDispatcher} = require("undici")

const proxyAgent = new ProxyAgent("http://127.0.0.1:7890")
setGlobalDispatcher(proxyAgent)

/** @type import('hardhat/config').HardhatUserConfig */
const scanAPIKey = process.env.ETHERSCAN_API_KEY
const privateKey = process.env.PRIVATEKEY
module.exports = {
  solidity: "0.8.22",

  settings: {
    evmVersion: "paris",
    optimizer: {
      enabled: true,
      runs: 1000,
    },
  },

  networks : {
    sepolia : {
      url: "https://ethereum-sepolia.blockpi.network/v1/rpc/public",
      accounts: [privateKey],
      chainId: 11155111,
    },
  },

  abiExporter: {  
    path: './deployments/abi',
    clear: true,
    flat: true,
    only: [],
    spacing: 2,
    pretty: true,
},

  etherscan: {
    apiKey: {
      sepolia: scanAPIKey,
    },
  },

  sourcify: {
    enabled: false,
  },
};
