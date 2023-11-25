// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import {Script} from "../lib/forge-std/src/Script.sol";
import "../src/Slot.sol";

contract SlotDeploy is Script {
    function run() external {
        vm.startBroadcast();
        Slot slot = new Slot();
        vm.stopBroadcast();
    }
}
