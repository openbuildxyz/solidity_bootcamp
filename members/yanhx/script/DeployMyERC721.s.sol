// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import {Script} from "forge-std/Script.sol";
import {MyERC721} from "../src/MyERC721.sol";

contract DeployMyERC721 is Script {
    function run() external returns (MyERC721) {
        vm.startBroadcast();
        MyERC721 myERC721 = new MyERC721();
        vm.stopBroadcast();
        return myERC721;
    }
}
