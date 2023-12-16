// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
contract MyERC20 is ERC20{
    constructor(string memory name_, string memory symbol_) ERC20("SmileToken", "SMT"){
        
    }

}