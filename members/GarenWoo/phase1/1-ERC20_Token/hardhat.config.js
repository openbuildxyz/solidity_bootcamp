require("@nomicfoundation/hardhat-toolbox");
require('hardhat-abi-exporter');
require('dotenv').config();
let dotenv = require('dotenv');
dotenv.config({ path: "./.env" }) ;

const { ProxyAgent, setGlobalDispatcher} = require("undici");
const proxyAgent = new ProxyAgent("http://127.0.0.1:7890");
setGlobalDispatcher(proxyAgent);
const scankeyAPIKey = process.env.ETHERSCAN_API_KEY;
const privateKey = process.env.PRIVATEKEY;
/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {

  solidity: {
    version: "0.8.23",
    settings: {
      evmVersion: "paris",
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },


  networks: {
    lineaGoerli: {
      url: "https://rpc.goerli.linea.build",
      accounts: [privateKey],
      chainId: 59140,
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
      lineaGoerli: scankeyAPIKey,
    },
    customChains: [
      {
        network: "lineaGoerli",
        chainId: 59140,
        urls: {
          apiURL: "https://api-testnet.lineascan.build/api",
          browserURL: "https://goerli.lineascan.build/"
        }
      }
    ]
  },

  sourcify: {
    enabled: false,
  },

};
