import fs from 'fs';
import * as dotenv from "dotenv";
import {HardhatUserConfig} from "hardhat/config";
import 'hardhat-preprocessor';
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-foundry";
import "@nomicfoundation/hardhat-verify";
import "./tasks";



dotenv.config();

function getRemappings() {
    return fs
        .readFileSync('remappings.txt', 'utf8')
        .split('\n')
        .filter(Boolean)
        .map((line) => line.trim().split('='));
}

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.21",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
            evmVersion: "shanghai"
        }
    },
    //defaultNetwork: "localhost",
    defaultNetwork: "Sepolia",
    networks: {
        ScrollSepolia: {
            url: process.env.SCROLL_SEPOLIA_URL || "",
            accounts:
                process.env.TESTNET_PRIVATE_KEY !== undefined ? [process.env.TESTNET_PRIVATE_KEY] : [],
            chainId: 534351,
            // Note that when using ethers this value will not be applied
            gas: "auto",
            gasPrice: "auto",
            gasMultiplier: 1,
        },
        Sepolia: {
            url: process.env.SEPOLIA_URL || "",
            accounts:
                process.env.TESTNET_PRIVATE_KEY !== undefined ? [process.env.TESTNET_PRIVATE_KEY] : [],
            chainId: 11155111,
            // Note that when using ethers this value will not be applied
            gas: "auto",
            gasPrice: "auto",
            gasMultiplier: 1,
        },
        localhost: {
            url: process.env.LOCALHOST_URL || "",
            accounts:
                process.env.LOCAL_PRIVATE_KEY !== undefined ? [process.env.LOCAL_PRIVATE_KEY] : [],
        },
    },
    paths: {
        sources: './contracts',
        tests: "./test",
        artifacts: "./artifacts",
        cache: './cache_hardhat', // Use a different cache for Hardhat than Foundry
    },
    etherscan: {
        apiKey: {
            Sepolia: process.env.SEPOLIA_SCAN_API_KEY || "",
            ScrollSepolia: process.env.SCROLL_SEPOLIA_SCAN_API_KEY || "",
            //Scroll: process.env.SCROLL_SCAN_API_KEY || "",
        },
        customChains: [
            {
                network: "Sepolia",
                chainId: Number(String(process.env.SEPOLIA_CHAIN_ID)) || 11155111,
                urls: {
                    apiURL: "https://blockscout.scroll.io/api",
                    browserURL: "https://blockscout.scroll.io/",
                }
            },
            {
                network: "ScrollSepolia",
                chainId: Number(String(process.env.SCROLL_SEPOLIA_CHAIN_ID)) || 534351,
                urls: {
                    apiURL: "https://sepolia-blockscout.scroll.io/api",
                    browserURL: "https://sepolia-blockscout.scroll.io/"
                }
            },
            {
                network: "Scroll",
                chainId: Number(String(process.env.SCROLL_CHAIN_ID)) || 534352,
                urls: {
                    apiURL: process.env.SCROLL_URL || "",
                    browserURL: process.env.SCROLL_SCAN_URL || ""
                }
            }
        ]
    },
    // This fully resolves paths for imports in the ./lib directory for Hardhat
    preprocess: {
        eachLine: () => ({
            transform: (line: string) => {
                if (line.match(/^\s*import /i)) {
                    getRemappings().forEach(([find, replace]) => {
                        if (line.match(find) && find != '@openzeppelin/') {
                            line = line.replace(find, replace);
                        }
                    });
                }
                return line;
            },
        }),
    },
};

export default config;
