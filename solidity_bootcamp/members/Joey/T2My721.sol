// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import  "lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
contract My721token is ERC721{
    constructor(string memory name_, string memory symbol_) ERC721("name_","symbol_"){
        
    }
}