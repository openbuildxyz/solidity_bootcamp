// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import {Script} from "forge-std/Script.sol";
import {MyERC20} from "../src/MyERC20.sol";

contract DeployMyERC20 is Script {
    function run() external returns (MyERC20) {
        vm.startBroadcast();
        MyERC20 myERC20 = new MyERC20();
        vm.stopBroadcast();
        return myERC20;
    }
}
