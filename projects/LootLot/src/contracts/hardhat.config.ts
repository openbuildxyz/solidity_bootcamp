import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";
import { HardhatUserConfig, task } from "hardhat/config";

import "@nomiclabs/hardhat-solhint";
import "@openzeppelin/hardhat-upgrades";
import "@zero-dao/eno-hardhat-plugin-deploy";
import "hardhat-abi-exporter";

const {
  POLYGON_TESTNET_URL,
  POLYGON_TESTNET_DEPLOYER_PRIVATE_KEY,
  SCROLL_TESTNET_URL,
} = process.env;

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
    ``;
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    polygon_testnet: {
      url: POLYGON_TESTNET_URL,
      chainId: 80001,
      gasPrice: 20000000000,
      accounts: [`0x${POLYGON_TESTNET_DEPLOYER_PRIVATE_KEY}`],
    },
    scroll_testnet: {
      url: SCROLL_TESTNET_URL,
      chainId: 534351,
      gasPrice: 20000000000,
      accounts: [`0x${POLYGON_TESTNET_DEPLOYER_PRIVATE_KEY}`],
    },
  },
  mocha: {
    timeout: 10 * 60 * 1000,
  },

  abiExporter: {
    except: ["contracts/tests", "contracts/core", "contracts/providers"],
  },
};
export default config;
