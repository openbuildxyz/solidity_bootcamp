require("@nomicfoundation/hardhat-toolbox");
require('hardhat-abi-exporter');
require("@openzeppelin/hardhat-upgrades");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  //solidity: "0.8.20", // solidity的编译版本
  solidity: {
      compilers: [
        {
          version: "0.8.20",
            evmVersion: "pairs", //homestead、tangerineWhistle、spuriousDragon、byzantium、constantinople、petersburg、istanbul、berlin、paris、shanghai等。默认值：由solc管理
            settings: {
                optimizer: {
                    enabled: false, //默认关闭
                    runs: 200  //默认200
                }
        }
        },
        {
          version: "0.4.24"
        },
        {
          version: "0.6.6"
        }]
  },
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/d87779e0299e4470bb662c0c476067f0",
      accounts: [process.env.ONLINE_PRIVATE_KEY2],
      chainId: 11155111
    },

     local: {
      url: "http://127.0.0.1:8545",
      accounts: [process.env.LOCAL_PRIVATE_KEY1, process.env.LOCAL_PRIVATE_KEY2],
      chainId: 31337
    }
  },
    abiExporter: {
        path: './abi',
        clear: true,
        flat: true
    },
    // npx hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
    etherscan: {
        apiKey: process.env.ETHERSCAN_API // 替换为你的 Etherscan API Key
    },
    sourcify: {
        enabled: true
    }

};
