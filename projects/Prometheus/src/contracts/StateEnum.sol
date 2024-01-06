// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

enum StateEnum{
        NOT_JOIN, //未参加
        NOT_WITHDRAW, //未提取押金
        PART_WITHDRAW, //已提取，感谢组织者
        ALL_WITHDRAW   //全部提取
    }