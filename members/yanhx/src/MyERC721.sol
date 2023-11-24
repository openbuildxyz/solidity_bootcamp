// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract MyERC721 is ERC721, Ownable {
    constructor() ERC721("MyERC721", "M721") Ownable(msg.sender) {}

    function mint(uint256 id) external onlyOwner {
        _mint(owner(), id);
    }

    function burn(uint256 id) external onlyOwner {
        require(msg.sender == _ownerOf(id), "not owner");
        _burn(id);
    }
}
