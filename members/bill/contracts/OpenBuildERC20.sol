// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract OpenBuildERC20 is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1000000000 * 10**18;
    uint256 public constant MINT_AMOUNT = 10000 * 10**18;
    mapping(address => bool) public minted;

    constructor() ERC20("OpenBuildERC20", "OP") Ownable(_msgSender()) {}

    function mint() public {
        require(totalSupply() + MINT_AMOUNT <= MAX_SUPPLY, "Minting would exceed max supply");
        if (minted[_msgSender()]) {
            revert("Already minted");
        }
        minted[_msgSender()] = true;
        _mint(_msgSender(), MINT_AMOUNT);
    }

    function withdraw() public onlyOwner {
        uint balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }
}


