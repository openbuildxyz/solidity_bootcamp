// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IOpenBuildParty {

    event Create(address indexed account, address indexed token, uint8 id, uint end, uint stakeAmount);

    event Join(address indexed account, uint8 id);

    event WithDraw(address indexed operator, address indexed account, uint8 id, bool isAll, uint amount);

    function create(IERC20 token, uint stakeAmount, uint endTime) external;

    function join(uint8 id) external;

    function withdrawBySignature(address player, uint8 id, uint256 amount, bytes memory signature) external;

    function withdrawBySignatureMessage(address player, uint8 id, uint256 amount, bytes memory signature) external;


}