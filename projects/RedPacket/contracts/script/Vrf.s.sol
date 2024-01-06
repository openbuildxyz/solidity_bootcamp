// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console2} from "forge-std/Script.sol";
import {VRFv2Consumer} from "../src/Vrf.sol";

contract DeployScript is Script {
    function setUp() public {}

    function run() public {
        uint64 SUB_SCRIPTION_ID = uint64(vm.envUint("SUB_SCRIPTION_ID"));
        vm.startBroadcast();
        new VRFv2Consumer(
            SUB_SCRIPTION_ID
        );
        vm.stopBroadcast();
    }
}
