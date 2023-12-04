//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract GarenTestNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address owner;

    constructor() ERC721("Garen Test NFT", "GTNT") {
        owner = msg.sender;
    }
    // @dev the current _tokenIds.value is the token id of the minted NFT. 
    // @param After NFT minted, _tokenIds.value will increase by the function increment().
    // @param tokenURI points to the URL of metadata storage
    function mint(address to, string memory tokenURI) public returns (uint256) {
        require(msg.sender == owner, "Only owner can mint");
        uint256 newItemId = _tokenIds.current();
        _mint(to, newItemId);
        _setTokenURI(newItemId, tokenURI);
        _tokenIds.increment();
        return newItemId;
    }
}