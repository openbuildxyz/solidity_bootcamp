// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// 继承下来测试用
contract MockErc20 is ERC20 {
    constructor()ERC20("Mock ERC20","MERC"){
        _mint(msg.sender, 1000000e18);
    }
}
