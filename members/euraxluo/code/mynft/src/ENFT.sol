// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract ENFT is ERC721URIStorage {
    uint256 private _tokenIds;

    constructor() ERC721("MyNFT", "NFT") {}

    function createSVG(uint256 tokenID) public pure returns (string memory) {
        // 将tokenID转换为字符串
        string memory idStr = Strings.toString(tokenID);

        // 生成随机颜色
        uint randNum = uint(keccak256(abi.encodePacked(idStr))) % 16777215;
        string memory color = Strings.toHexString(randNum, 6);

        // 拼接SVG字符串
        string memory svg = string(
            abi.encodePacked(
                '<svg width="95.105652" height="90.450806" viewBox="0 0 95.1057 90.4508">',
                '<path d="M47.5528 0L36.3261 34.5477L0 34.5492L29.3876 55.9022L18.1636 90.4508L47.5528 69.1L76.9421 90.4508L65.718 55.9022L95.1057 34.5492L58.7795 34.5477L47.5528 0Z" fill-rule="evenodd" fill="#F8BFB4" />',
                '<text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" font-size="20">',
                         idStr,
                "</text>",
                "</svg>"
            )
        );

        return svg;
    }

    function mintNFT(address recipient) public returns (uint256) {
        _tokenIds += 1;

        // tokenURI 是一个 随机的，颜色随机，形状随机，里面会显示一个字符串，就是当前的tokenIds的SVG
        string memory tokenURI = string(
            abi.encodePacked(
                "data:image/svg+xml;base64,",
                createSVG(_tokenIds)
            )
        );
        uint256 newItemId = _tokenIds;
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }
}
