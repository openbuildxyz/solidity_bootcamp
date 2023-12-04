// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FakeUSDT is ERC20 {
    constructor() ERC20("FakeUSDT", "fUSDT") {
        _mint(msg.sender, 10000000000000000000000); //mint 10000 FakeUSDT
    }
}