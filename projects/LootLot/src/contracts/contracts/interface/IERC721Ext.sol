//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/IERC721EnumerableUpgradeable.sol";

interface IERC721Ext is IERC721EnumerableUpgradeable {
    function safeMint(address to, uint256 tokenId) external;
}
