// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IOpenBuildPartyV2 {

    event Create(address indexed account, address indexed token, uint8 id, uint end, uint stakeAmount);

    event Join(address indexed account, uint8 id);

    event WithDraw(address indexed operator, address indexed account, uint8 id, bool isAll, uint amount);

    event SetShare(address indexed account, uint8 id, uint share);

    event AddBlack(address indexed account);

    event RemoveBlack(address indexed account);

    function create(IERC20 token, uint stakeAmount, uint endTime) external;

    function join(uint8 id) external;

    function withdraw(uint8 id, address player) external;

    function setShares(uint8 id, address[] calldata players, uint8[] calldata shares) external;

    function setSharesAndWithdraw(uint8 id, address[] calldata players, uint8[] calldata shares) external;


}