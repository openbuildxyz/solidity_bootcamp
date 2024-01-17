// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {VRFCoordinatorV2Mock} from "@chainlink/contracts/src/v0.8/mocks/VRFCoordinatorV2Mock.sol";
import {LinkToken} from "../test/mocks/LinkToken.sol";

contract HelperConfig is Script {
    struct NetworkConfig {
        uint256 baseFee;
        address admin;
        uint64 subscriptionId;
        bytes32 keyHash;
        uint256 interval;
        uint32 callbackGasLimit;
        address vrfCoordinator;
        address link;
        uint256 deployerKey;
    }

    uint256 public DEFAULT_ANVIL_PRIVATE_KEY = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;

    NetworkConfig public activeNetworkConfig;

    constructor() {
        if (block.chainid == 11155111) {
            activeNetworkConfig = getSepoliaEthConfig();
        } else {
            activeNetworkConfig = getOrCreateAnvilEthConfig();
        }
    }

    function getSepoliaEthConfig() public view returns (NetworkConfig memory sepoliaNetworkConfig) {
        sepoliaNetworkConfig = NetworkConfig({
            baseFee: 0.0004 ether,
            admin: 0xF42f4b5cb102b3f5A180E08E6BA726c0179D172E,
            subscriptionId: 768, // If left as 0, our scripts will create one!
            keyHash: 0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c,
            interval: 60, // 7776000 seconds = 3 months,now use 1 minute
            callbackGasLimit: 250000, // 2,500,000 gas
            vrfCoordinator: 0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625,
            link: 0x779877A7B0D9E8603169DdbD7836e478b4624789,
            deployerKey: vm.envUint("PRIVATE_KEY")
        });
        // link: 0x779877A7B0D9E8603169DdbD7836e478b4624789,
        // deployerKey: vm.envUint("PRIVATE_KEY")
    }

    function getOrCreateAnvilEthConfig() public returns (NetworkConfig memory anvilNetworkConfig) {
        if (activeNetworkConfig.vrfCoordinator != address(0)) {
            return activeNetworkConfig;
        }
        uint96 _baseFee = 0.0001 ether;
        uint96 _gasPriceLink = 0.0000000001 ether;
        vm.startBroadcast();
        VRFCoordinatorV2Mock vrfCoordinator = new VRFCoordinatorV2Mock(_baseFee, _gasPriceLink);
        LinkToken link = new LinkToken();
        vm.stopBroadcast();
        anvilNetworkConfig = NetworkConfig({
            baseFee: 0.0004 ether,
            admin: 0xF42f4b5cb102b3f5A180E08E6BA726c0179D172E,
            subscriptionId: 0, // If left as 0, our scripts will create one!
            keyHash: 0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c,
            interval: 60, // 7776000 seconds = 3 months,now use 1 minute
            callbackGasLimit: 250000, // 2,500,000 gas
            vrfCoordinator: address(vrfCoordinator),
            link: address(link),
            deployerKey: DEFAULT_ANVIL_PRIVATE_KEY
        });
    }
}
