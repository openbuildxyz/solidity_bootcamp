// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract BootcampNFT is ERC721 {
    constructor() ERC721("BootcampNFT", "BcNFT"){}

    function mint(address to, uint256 id) external {
        require(_ownerOf(id) == address(0), "token has minted");
        _mint(to, id);
    }

    function burn(uint256 id) external {
        require(_ownerOf(id) == msg.sender, "msg.sender is not owner");
        _burn(id);
    }

}