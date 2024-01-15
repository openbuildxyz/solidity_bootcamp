// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./StateEnum.sol";
import {Storage} from "./Storage.sol";

contract StorageV2 is Storage{

    uint8 constant public TOTAL_SHARE = 100;  //总份额
    uint8 constant public MAX_SHARE = 100;  //最大份额
    uint8 constant public DEFAULT_SHARE = 101;  //初始化默认份额
    uint8 constant public MAX_BATCH_NUMBER = 2; //批量查询最大数量
    mapping(uint8 => address[]) public challengePlayerList;  //参与用户列表
    mapping(uint8 => mapping(address => uint8)) public challengePlayerShares;  //活动创建者设置的用户可提取比例


    function _addChallengePlayerList(uint8 id, address player) internal {
        challengePlayerList[id].push(player);
    }

    function _updateChallengePlayerShare(uint8 id, address player, uint8 percent) internal {
        challengePlayerShares[id][player] = percent;
    }



}