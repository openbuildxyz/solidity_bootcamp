// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./CheckTypeEnum.sol";

contract CheckpointStorage{
    uint constant public secondsOneDay = 15; //note 临时改成了15s打一次卡,86400
    uint8 constant public totalTeamLimit = 100;  //队伍数量上限

    uint8 public teamNumber; //队伍数量
    uint public totalScore; //总得分

    struct Team{
        CheckType teamType; //队伍类型 0 单人组; 1 双人组; 2 三人组
        address player1;  //队长
        address player2;
        address player3;
        bool finished;  //是否已经组队完成
    }
    struct Player{
        uint8 teamId;  //组id
        uint score;    //截止当前的分数
        uint lastCheckTime; //最近一次打卡时间
    }

    mapping(address=>Player) public playerInfo;  //用户信息
    mapping(uint8=>Team) public teamInfo;  //组信息
    mapping(address=>bool) public hasWithDrawed; //用户奖励提取
    mapping(address=>bool) public blackPlayer; //用户黑名单
}