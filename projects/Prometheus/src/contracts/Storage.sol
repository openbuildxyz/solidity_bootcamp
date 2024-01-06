// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./StateEnum.sol";

contract Storage{
    uint8 constant public CHALLENGE_NUMBER_LIMIT = 100;  //队伍数量上限
    uint8 public challengeNumber; //截止目前的活动总数量

    struct Challenge{
        address creator;  //组织者
        IERC20 stakeToken;  //IERC20
        uint stakeAmount;    //参与者需要质押的钱
        uint endTime;  //截止时间
        uint stakeAccountNum;  //参与者数量
        uint balance; //活动余额
    }


    mapping(uint8 => Challenge) public challengeInfo;  //活动信息
    mapping(address => mapping(uint8 => StateEnum)) public playerChallengeState;  //用户参与信息
    mapping(address => bool) public blackPlayer; //用户黑名单

    function _updateChallengeStakeInfo(uint8 id, uint stakeAccountNum, uint balance) internal {
        if(challengeInfo[id].creator == address(0)){
            revert ("challenge not exist");
        }
        challengeInfo[id].stakeAccountNum = stakeAccountNum;
        challengeInfo[id].balance = balance;
    }

    function _updatePlayerChallengeState(address player, uint8 id, StateEnum state) internal {
        playerChallengeState[player][id] = state;
    }



}