// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {HelperConfig} from "./HelperConfig.s.sol";
import {VRFCoordinatorV2Mock} from "@chainlink/contracts/src/v0.8/mocks/VRFCoordinatorV2Mock.sol";
import {LinkToken} from "../test/mocks/LinkToken.sol";
import {DevOpsTools} from "lib/foundry-devops/src/DevOpsTools.sol";

contract CreateSubscription is Script {
    function run() external returns (uint64 subscriptionId) {
        subscriptionId = createSubscriptionUsingConfig();
    }

    function createSubscriptionUsingConfig() public returns (uint64 subscriptionId) {
        HelperConfig helperConfig = new HelperConfig();
        (,,,,,, address vrfCoordinator,, uint256 deployerKey) = helperConfig.activeNetworkConfig();
        subscriptionId = createSubscription(vrfCoordinator, deployerKey);
    }

    function createSubscription(address vrfCoordinator, uint256 deployerKey) public returns (uint64 subscriptionId) {
        console.log("Creating subscription on chainId: %s", block.chainid);
        vm.startBroadcast(deployerKey);
        VRFCoordinatorV2Mock vrfCoordinatorMock = VRFCoordinatorV2Mock(vrfCoordinator);
        subscriptionId = vrfCoordinatorMock.createSubscription();
        vm.stopBroadcast();
        console.log("Created subscription with id: %s", subscriptionId);
    }
}

contract FundSubscription is Script {
    LinkToken public linkToken;
    uint96 public constant FOUND_AMOUNT = 1 ether;

    function run() external {
        fundSubscriptionUsingConfig();
    }

    function fundSubscriptionUsingConfig() public {
        HelperConfig helperConfig = new HelperConfig();
        (,, uint64 subscriptionId,,,, address vrfCoordinator, address link, uint256 deployerKey) =
            helperConfig.activeNetworkConfig();
        fundSubscription(vrfCoordinator, subscriptionId, link, deployerKey);
    }

    function fundSubscription(address vrfCoordinator, uint64 subscriptionId, address link, uint256 deployerKey)
        public
    {
        console.log("Funding subscription on chainId: %s", block.chainid);
        console.log("Found amount: %s", FOUND_AMOUNT);
        console.log("Found subscription id: %s", subscriptionId);
        console.log("Found vrfCoordinator: %s", vrfCoordinator);
        if (block.chainid == 31337) {
            vm.startBroadcast(deployerKey);
            VRFCoordinatorV2Mock vrfCoordinatorMock = VRFCoordinatorV2Mock(vrfCoordinator);
            vrfCoordinatorMock.fundSubscription(subscriptionId, FOUND_AMOUNT);
            vm.stopBroadcast();
        } else {
            vm.startBroadcast(deployerKey);
            linkToken = LinkToken(link);
            linkToken.transferAndCall(vrfCoordinator, FOUND_AMOUNT, abi.encode(subscriptionId));
            vm.stopBroadcast();
        }
    }
}

contract AddConsumer is Script {
    constructor() {}

    function run() external {
        address walletCenter = DevOpsTools.get_most_recent_deployment("WalletCenter", block.chainid);
        addConsumerUsingConfig(walletCenter);
    }

    function addConsumerUsingConfig(address walletCenter) public {
        HelperConfig helperConfig = new HelperConfig();
        (,, uint64 subscriptionId,,,, address vrfCoordinator,, uint256 deployerKey) = helperConfig.activeNetworkConfig();
        addConsumer(walletCenter, vrfCoordinator, subscriptionId, deployerKey);
    }

    function addConsumer(address walletCenter, address vrfCoordinator, uint64 subscriptionId, uint256 deployerKey)
        public
    {
        console.log("Adding consumer on chainId: %s", block.chainid);
        console.log("Adding consumer to walletCenter: %s", walletCenter);
        console.log("Adding consumer to subscription id: %s", subscriptionId);
        console.log("Adding consumer to vrfCoordinator: %s", vrfCoordinator);
        vm.startBroadcast(deployerKey);
        VRFCoordinatorV2Mock vrfCoordinatorMock = VRFCoordinatorV2Mock(vrfCoordinator);
        vrfCoordinatorMock.addConsumer(subscriptionId, walletCenter);
        vm.stopBroadcast();
    }
}
