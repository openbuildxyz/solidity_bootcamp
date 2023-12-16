// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "src/My721.sol"; // 引入你的合约

contract DeployContractScript is Script {
    function run() public { 
        vm.startBroadcast(); // 开始广播

         new My721token("OldNFT","OFT");

        vm.stopBroadcast(); // 停止广播
    }
}