// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
// 红包信息
struct Packet {
    uint256 id; // id
    uint256 startTime; // 发起红包时间
    uint256 amount; // 单个红包金额
    string collectType; // 红包类型
    bool lock; // 红包锁
    uint8 currentTimes; // 当前次数
    uint8 times; // 次数限制
    uint32 limit; // 限制人数
    address[] users; // 当前参加的人数
    address creator; // 发起人
    address currentUser; // 当前需要发红包的人
    bool exist; // 是否存在
    uint256 requestId; // 随机数映射id，方便vrf回调
}

// 个人用户信息
struct User {
    uint256 deposit;
    bool lock;
    bool active;
    bool exist;
    uint256 packetId; // 正在参加的红包ID
}

struct RandomArrayResult {
    uint256[] array;
    uint256 maxIndex;
}
