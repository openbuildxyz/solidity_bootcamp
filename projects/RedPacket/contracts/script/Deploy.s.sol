// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console2} from "forge-std/Script.sol";
import {RedPacket} from "../src/RedPacket.sol";

contract DeployScript is Script {
    function setUp() public {}

    function run() public {
        address TOKEN_ADDRESS = vm.envAddress("TOKEN_ADDRESS");
        vm.startBroadcast();
        new RedPacket(
            TOKEN_ADDRESS
        );
        vm.stopBroadcast();
    }
}
