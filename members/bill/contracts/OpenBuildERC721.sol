// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract OpenBuildERC721 is ERC721, Ownable {
    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public constant MAX_MINT_AMOUNT = 5;
    uint256 public totalSupply = 0;

    constructor() ERC721("OpenBuildErc721", "OP") Ownable(_msgSender()) payable  {}

    function mint(uint256 amount) public payable {
        require(totalSupply + amount <= MAX_SUPPLY, "Exceeds maximum supply");
        require(amount <= MAX_MINT_AMOUNT, "Exceeds maximum mint amount");

        for (uint256 i = 0; i < amount; i++) {
            uint256 tokenId = totalSupply;
            _mint(msg.sender, tokenId);
            totalSupply++;
        }
    }

    function withdraw() public onlyOwner {
        uint balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }
}

