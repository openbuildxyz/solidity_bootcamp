// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

/*
 * 任务 3 内容，试想一个小游戏，数组 health 用于存储 10 个角色的 HP（healthPoint）
 * HP 初始值为 1000，每次攻击（fight）会降低 100。
 *
 * 同时满足以下两个条件，角色就可以通过 Automation 补充为 1000：
 * 1. 如果生命值不足 1000
 * 2. 经过某个时间间隔 interval
 * 请完成以下代码，实现上述逻辑
 *
 * 参考视频教程：https://www.bilibili.com/video/BV1ed4y1N7Uv?p=9
 *
 * 任务 3 完成标志：
 * 1. 通过命令 "yarn hardhat test" 使得单元测试 11-12 通过
 * 2. 通过 Remix 在 Ethereum Sepolia 测试网部署，并且测试执行是否如预期
 */

contract AutomationTask is AutomationCompatible {

    uint256 public constant SIZE = 10;
    uint256 public constant MAXIMUM_HEALTH = 1000;
    uint256[SIZE] public healthPoint;
    uint256 public lastTimeStamp;
    uint256 public immutable interval;

    /*
     * 步骤 1 - 在构造函数中完成数组 healthPoint 的初始化
     */
    constructor(uint256 _interval) {
        lastTimeStamp = block.timestamp;
        interval = _interval;
        //在此添加 solidity 代码
        //初始化 healthPoint
        for(uint i=0; i<SIZE; i++){
            healthPoint[i] = MAXIMUM_HEALTH;
        }
    }

    /*
     * 步骤 2 - 定义 fight 函数
     * 使得用户可以通过 fight 函数改变数组中的生命值
     * fight 函数接收一个参数 fighter，代表数组中的下标
     */
    function fight(uint256 fighter) public {
        //在此添加 solidity 代码
        require(fighter < SIZE, "out of range");
        require(healthPoint[fighter] > 100, "low health");
        healthPoint[fighter] -= 100;
    }

    /*
     * 步骤 3 - 通过 checkUpKeep 来检测：
     * 1. 数组 healthPoint 中的数值是否小于 1000
     * 2. 是否经过了时间间隔 interval
     *
     * 注意：
     * 这部分操作将由 Chainlink 预言机节点在链下计算，本地环境中已由脚本配置
     * 可以尝试在 checkUpKeep 函数中改变状态，观察是否会发生改变
     */
    function checkUpkeep(
        bytes memory /* checkData*/
    )
    public
    view
    override
    returns (
        bool upkeepNeeded,
        bytes memory performData
    )
    {
        //在此添加和修改 solidity 代码
        upkeepNeeded = false;
        performData = abi.encode("");

        // 判断是否经过了时间间隔 interval
        bool intervalPassed = (block.timestamp - lastTimeStamp >= interval);
        if (!intervalPassed){
            return (upkeepNeeded, performData);
        }
        // 判断数组 healthPoint 中的数值是否小于 1000
        uint counter = 0;
        for(uint i=0; i<SIZE; i++){
            if(healthPoint[i] < 1000){
                counter++;
            }
        }
        //counter为0，不需要更新
        if (counter == 0){
            return (upkeepNeeded, performData);
        }
        // 申明数组，记录需要更新的index
        uint256[] memory indexUpdate = new uint256[](counter);
        uint indexCounter = 0;
        for(uint i=0; i<SIZE; i++){
            if(healthPoint[i] < 1000){
                indexUpdate[indexCounter] = i;
                indexCounter++;
            }
        }

        upkeepNeeded = true;
        performData = abi.encode(indexUpdate);
        return (upkeepNeeded, performData);
    }

    /*
     * 步骤 4 - 通过 performUpKeep 来完成将补足数组中生命值的操作
     * 例如发现 healthPoint[0] = 500，则将其增加 500 变为 1000
     *
     * 注意：
     * 可以通过 performData 使用 checkUpkeep 的运算结果，减少 gas 费用
     */
    function performUpkeep(
        bytes memory performData
    )
    external
    override
    {
        //在此添加 solidity 代码
        if (performData.length == 0){
            return;
        }
        uint256[] memory indexUpdate = abi.decode(performData, (uint256[]));
        uint length = indexUpdate.length;
        for(uint i=0; i<length; i++){
            healthPoint[indexUpdate[i]] = 1000;
        }
        lastTimeStamp = block.timestamp;
    }
}