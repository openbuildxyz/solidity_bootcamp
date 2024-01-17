// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {WalletCenter} from "../src/WalletCenter.sol";
import {HelperConfig} from "./HelperConfig.s.sol";
import {CreateSubscription, FundSubscription, AddConsumer} from "./Integrations.s.sol";

contract DeployWalletCenter is Script {
    function run() external returns (WalletCenter walletCenter, HelperConfig helperConfig) {
        helperConfig = new HelperConfig();
        (
            uint256 baseFee,
            address admin,
            uint64 subscriptionId,
            bytes32 keyHash,
            uint256 interval,
            uint32 callbackGasLimit,
            address vrfCoordinator,
            address link,
            uint256 deployerKey
        ) = helperConfig.activeNetworkConfig();
        if (subscriptionId == 0) {
            // if you are in a local network, here to mock the integration of the real chain with chainlink just like interact with the chainlink ui
            // step1. create a subscription
            CreateSubscription createSubscription = new CreateSubscription();
            subscriptionId = createSubscription.createSubscription(vrfCoordinator, deployerKey);
            // step2. fund the subscription
            FundSubscription fundSubscription = new FundSubscription();
            fundSubscription.fundSubscription(vrfCoordinator, subscriptionId, link, deployerKey);
        }
        address[2] memory owners;
        owners[0] = 0xF42f4b5cb102b3f5A180E08E6BA726c0179D172E;
        owners[1] = 0x4Cfa91a4061a4438EC6F8fBcFe207897856504A9;
        uint256[2] memory shares = [uint256(60), uint256(40)];
        vm.startBroadcast(deployerKey);
        walletCenter = new WalletCenter(
            baseFee,
            owners,
            admin,
            shares,
            subscriptionId,
            keyHash,
            interval,
            callbackGasLimit,
            vrfCoordinator
        );
        vm.stopBroadcast();
        // be careful,add consumer must be after the walletCenter is deployed!!
        // step3. add the consumer
        console.log("#########################################################################");
        console.log("walletCenter address: %s", address(walletCenter));
        console.log("Add consumer on chainId: %s", block.chainid);
        console.log("#########################################################################");
        AddConsumer addConsumer = new AddConsumer();
        addConsumer.addConsumer(address(walletCenter), vrfCoordinator, subscriptionId, deployerKey);
    }
}
